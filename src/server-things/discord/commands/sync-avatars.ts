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
    const CONCURRENCY_LIMIT = 20;
    const userChunks: (typeof users)[] = [];

    for (let i = 0; i < users.length; i += CONCURRENCY_LIMIT) {
      userChunks.push(users.slice(i, i + CONCURRENCY_LIMIT));
    }

    // Process each batch with retry logic
    for (let chunkIndex = 0; chunkIndex < userChunks.length; chunkIndex++) {
      let retryCount = 0;
      const MAX_RETRIES = 3;
      let retryAfterMs = 0;
      let batchSucceeded = false;

      while (retryCount <= MAX_RETRIES && !batchSucceeded) {
        const chunk = userChunks[chunkIndex];
        const batchErrors: { user: (typeof users)[0]; error: unknown }[] = [];

        try {
          const results = await Promise.allSettled(
            chunk.map(async (user) => {
              try {
                // Extract clean Discord ID (remove everything after '@' if present)
                const cleanDiscordId = user.id.split('@')[0];

                // Fetch user data from Discord API
                const discordUserResponse =
                  await discordClient.get<DiscordUser>(
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
                throw error;
              }
            })
          );

          // Check for any failures in the batch
          results.forEach((result, index) => {
            if (result.status === 'rejected') {
              const user = chunk[index];
              const error = result.reason;

              // Extract retry-after from rate limit errors
              if (error instanceof Error && error.message.includes('429')) {
                if ('response' in error && error.response) {
                  const response = error.response as {
                    status?: number;
                    statusText?: string;
                    data?: { retry_after?: number; message?: string };
                    headers?: Record<string, unknown>;
                  };

                  console.error(
                    `Rate limit error for user ${user.id}:`,
                    error.message
                  );
                  console.error('Response status:', response.status);
                  console.error(
                    'Response body:',
                    JSON.stringify(response.data, null, 2)
                  );
                  console.error('Rate limit headers:', {
                    'Retry-After': response.headers?.['retry-after'],
                    'X-RateLimit-Remaining':
                      response.headers?.['x-ratelimit-remaining'],
                    'X-RateLimit-Reset':
                      response.headers?.['x-ratelimit-reset'],
                    'X-RateLimit-Reset-After':
                      response.headers?.['x-ratelimit-reset-after']
                  });

                  // Extract retry-after value from body first, then headers
                  const retryAfterValue = response.headers?.['retry-after'];

                  if (retryAfterValue) {
                    const retryAfterSeconds = parseInt(
                      String(retryAfterValue),
                      10
                    );
                    retryAfterMs = Number.isNaN(retryAfterSeconds)
                      ? 30000
                      : Math.ceil(retryAfterSeconds * 1000);
                    console.log(
                      `Extracted retry-after: ${retryAfterSeconds}s (${retryAfterMs}ms)`
                    );
                  } else {
                    retryAfterMs = 30000; // Default to 60 seconds
                    console.log(
                      'No retry-after value found, defaulting to 60s'
                    );
                  }
                }
              }

              batchErrors.push({ user, error });
            }
          });

          // If there were any errors, mark batch as failed and retry
          if (batchErrors.length > 0) {
            if (retryCount < MAX_RETRIES) {
              const waitTimeMs = retryAfterMs || 15000;
              const waitTimeSec = waitTimeMs / 1000;
              console.log(
                `Batch ${chunkIndex + 1} had ${batchErrors.length} errors. ` +
                  `Retrying in ${waitTimeSec}s (retry ${retryCount + 1}/${MAX_RETRIES})...`
              );
              await new Promise((resolve) => setTimeout(resolve, waitTimeMs));
              retryCount++;
            } else {
              // Max retries exceeded, add all errors to failed users
              console.error(
                `Batch ${chunkIndex + 1} failed after ${MAX_RETRIES} retries`
              );
              batchErrors.forEach(({ user, error }) => {
                failedUsers.push({
                  name: user.name,
                  error:
                    error instanceof Error
                      ? error.message
                      : 'Unknown error occurred'
                });
              });
              batchSucceeded = true;
            }
          } else {
            // Batch succeeded
            batchSucceeded = true;
            console.log(`Batch ${chunkIndex + 1} complete.`);

            // Wait before fetching the next batch (unless it's the last batch)
            if (chunkIndex < userChunks.length - 1) {
              console.log(
                `Waiting 5s before processing batch ${chunkIndex + 2}...`
              );
              await new Promise((resolve) => setTimeout(resolve, 5000));
            }
          }
        } catch (error) {
          console.error(`Unexpected error in batch ${chunkIndex + 1}:`, error);
          if (retryCount < MAX_RETRIES) {
            console.log(
              `Retrying batch ${chunkIndex + 1} (retry ${retryCount + 1}/${MAX_RETRIES})...`
            );
            await new Promise((resolve) => setTimeout(resolve, 5000));
            retryCount++;
          } else {
            console.error(
              `Batch ${chunkIndex + 1} failed with unexpected error after ${MAX_RETRIES} retries`
            );
            batchSucceeded = true;
          }
        }
      }
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
