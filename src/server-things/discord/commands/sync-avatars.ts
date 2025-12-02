import { SlashCommandBuilder } from '@discordjs/builders';
import type { executeCommand } from '@/server-things/discord/types';
import { prisma } from '@/handlers/prisma';
import discordClient from '@/bridge-things/network/http-client/discord-client';
import { STREGA_URL_MESSAGE } from '@/server-things/utils/base-responses';
import { validateSuperAdminId } from '@/server-things/utils/discord';

export const register = new SlashCommandBuilder()
  .setName('sync-avatars')
  .setDescription('Sync all user avatars from Discord');

async function sendFollowUpMessage(
  applicationId: string,
  interactionToken: string,
  content: string
) {
  const followUpUrl = `/api/v10/webhooks/${applicationId}/${interactionToken}`;
  await discordClient.post(followUpUrl, { content });
}

interface DiscordUser {
  id: string;
  avatar: string | null;
  username: string;
}

function buildAvatarUrl(userId: string, avatar: string | null): string {
  if (!avatar) {
    return `https://cdn.discordapp.com/embed/avatars/${parseInt(userId) % 5}.png`;
  }

  const extension = avatar.startsWith('a_') ? 'gif' : 'png';
  return `https://cdn.discordapp.com/avatars/${userId}/${avatar}.${extension}`;
}

async function syncAvatars(applicationId: string, interactionToken: string) {
  try {
    // Fetch all users from database
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        avatar_url: true
      }
    });

    if (users.length === 0) {
      await sendFollowUpMessage(
        applicationId,
        interactionToken,
        'No users found in the database.'
      );
      return;
    }

    const syncedUsers: { name: string; oldUrl: string; newUrl: string }[] = [];
    const failedUsers: { name: string; error: string }[] = [];

    // Process users with concurrency limit (Discord API rate limiting)
    const CONCURRENCY_LIMIT = 5;
    const userChunks: (typeof users)[] = [];

    for (let i = 0; i < users.length; i += CONCURRENCY_LIMIT) {
      userChunks.push(users.slice(i, i + CONCURRENCY_LIMIT));
    }

    for (const chunk of userChunks) {
      await Promise.all(
        chunk.map(async (user) => {
          try {
            // Extract clean Discord ID (remove everything after '@' if present)
            const cleanDiscordId = user.id.split('@')[0];

            // Fetch user data from Discord API
            const discordUserResponse = await discordClient.get<DiscordUser>(
              `/api/v10/users/${cleanDiscordId}`
            );

            const discordUser = discordUserResponse.data;
            const newAvatarUrl = buildAvatarUrl(
              discordUser.id,
              discordUser.avatar
            );

            // Update user avatar in database if it changed
            if (newAvatarUrl !== user.avatar_url) {
              await prisma.user.update({
                where: { id: user.id },
                data: { avatar_url: newAvatarUrl }
              });

              syncedUsers.push({
                name: user.name,
                oldUrl: user.avatar_url,
                newUrl: newAvatarUrl
              });
            }
          } catch (error) {
            console.error(`Error syncing avatar for user ${user.id}:`, error);
            failedUsers.push({
              name: user.name,
              error:
                error instanceof Error
                  ? error.message
                  : 'Unknown error occurred'
            });
          }
        })
      );
    }

    // Build follow-up message
    const messageParts: string[] = [];

    messageParts.push(`**Avatar Sync Complete**`);
    messageParts.push(`Total synced: **${syncedUsers.length}**`);
    messageParts.push('');

    if (syncedUsers.length > 0) {
      messageParts.push(`**Synced Users (${syncedUsers.length}):**`);
      messageParts.push(syncedUsers.map((u) => `  • ${u.name}`).join('\n'));
      messageParts.push('');
    }

    if (failedUsers.length > 0) {
      messageParts.push(`**Failed to Sync (${failedUsers.length}):**`);
      messageParts.push(
        failedUsers.map((u) => `  • ${u.name}: ${u.error}`).join('\n')
      );
    }

    const followUpContent = messageParts.join('\n') + STREGA_URL_MESSAGE;

    await sendFollowUpMessage(applicationId, interactionToken, followUpContent);
  } catch (error) {
    console.error('Error in syncAvatars:', error);
    await sendFollowUpMessage(
      applicationId,
      interactionToken,
      'An error occurred while syncing avatars. Please try again later.'
    );
  }
}

export const execute: executeCommand = async (interaction) => {
  const executorId = interaction.member?.user.id;
  if (!validateSuperAdminId(executorId)) {
    return {
      type: 4,
      data: {
        content: 'You do not have permission to use this command.'
      }
    };
  }

  // Start processing asynchronously
  syncAvatars(interaction.application_id, interaction.token).catch(
    (error: unknown) => {
      console.error('Unhandled error in syncAvatars:', error);
    }
  );

  // Return immediate response
  return {
    type: 4,
    data: {
      content: 'Avatar sync started, please wait!'
    }
  };
};
