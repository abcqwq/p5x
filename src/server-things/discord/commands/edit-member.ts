import { SlashCommandBuilder } from '@discordjs/builders';
import type { executeCommand } from '@/server-things/discord/types';
import { prisma } from '@/handlers/prisma';
import type {
  APIChatInputApplicationCommandInteractionData,
  APIChatInputApplicationCommandInteractionDataResolved
} from 'discord-api-types/v10';
import { STREGA_URL_MESSAGE } from '@/server-things/utils/base-responses';

const companioMapper: Record<string, string> = {
  strega: 'Strega',
  zoshigaya: 'Zoshigaya',
  zoshigaya_zen: 'Zoshigaya Zen',
  zoshigaya_zoku: 'Zoshigaya Zoku'
};

// Whitelist of Discord user IDs allowed to register other members
const WHITELISTED_ADMIN_IDS = new Set<string>(
  process.env.WHITELISTED_ADMIN_IDS?.split(',').map((id) => id.trim()) || []
);

export const register = new SlashCommandBuilder()
  .setName('edit-member')
  .setDescription('Edit another member in the Alliance (Admin only)')
  .addUserOption((option) =>
    option.setName('user').setDescription('The user to edit').setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName('display_name')
      .setDescription('Their P5X display name')
      .setRequired(false)
  )
  .addStringOption((option) =>
    option
      .setName('companio')
      .setDescription('Their companio')
      .setRequired(false)
      .addChoices(
        { name: 'Strega', value: 'strega' },
        { name: 'Zoshigaya', value: 'zoshigaya' },
        { name: 'Zoshigaya Zen', value: 'zoshigaya_zen' },
        { name: 'Zoshigaya Zoku', value: 'zoshigaya_zoku' }
      )
  );

export const execute: executeCommand = async (interaction) => {
  // Type guard to check if this is a chat input command
  const data =
    interaction.data as APIChatInputApplicationCommandInteractionData;

  const executorId = interaction.member?.user.id;

  // Check if the executor is whitelisted
  if (!executorId || !WHITELISTED_ADMIN_IDS.has(executorId)) {
    return {
      type: 4,
      data: {
        content: 'You do not have permission to use this command.'
      }
    };
  }

  const userOption = data.options?.find((opt) => opt.name === 'user');
  const displayNameOption = data.options?.find(
    (opt) => opt.name === 'display_name'
  );
  const companioOption = data.options?.find((opt) => opt.name === 'companio');

  const targetUserId =
    userOption && 'value' in userOption ? String(userOption.value) : '';
  if (!targetUserId) {
    return {
      type: 4,
      data: {
        content: 'Unable to retrieve the target user. Please try again.'
      }
    };
  }

  const displayName =
    displayNameOption && 'value' in displayNameOption
      ? String(displayNameOption.value)
      : '';
  const companioId =
    companioOption && 'value' in companioOption
      ? String(companioOption.value)
      : '';

  // Get the target user's information from the resolved data
  const resolvedData = (
    'resolved' in interaction.data ? interaction.data.resolved : undefined
  ) as APIChatInputApplicationCommandInteractionDataResolved | undefined;
  const targetUser = resolvedData?.users?.[targetUserId];

  if (!targetUser) {
    return {
      type: 4,
      data: {
        content: 'Unable to retrieve user information. Please try again.'
      }
    };
  }

  try {
    // Check if user is already registered
    const existingUser = await prisma.user.findUnique({
      where: {
        id: targetUserId
      }
    });

    if (!existingUser) {
      return {
        type: 4,
        data: {
          content:
            'The user has not been registered yet. Please register them first.'
        }
      };
    }

    // Build update data - only include fields that are not empty
    const updateData: { name?: string; companio_id?: string } = {};
    if (displayName) {
      updateData.name = displayName;
    }
    if (companioId) {
      updateData.companio_id = companioId;
    }

    // Update user with non-empty fields
    const updatedUser = await prisma.user.update({
      where: {
        id: targetUserId
      },
      data: updateData
    });

    // Build response message showing what was updated
    let responseMessage = `Successfully updated <@${targetUserId}>!`;
    if (updatedUser.name) {
      responseMessage += `\n**Display Name:** ${updatedUser.name}`;
    }
    if (updatedUser.companio_id) {
      const companioName = companioMapper[updatedUser.companio_id] || 'Unknown';
      responseMessage += `\n**Companio:** ${companioName}`;
    }
    responseMessage += STREGA_URL_MESSAGE;

    return {
      type: 4,
      data: {
        content: responseMessage
      }
    };
  } catch (error) {
    console.error('Error updating user:', error);
    return {
      type: 4,
      data: {
        content:
          'An error occurred while updating. Please try again later or contact an administrator.'
      }
    };
  }
};
