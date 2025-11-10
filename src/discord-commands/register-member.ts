import { SlashCommandBuilder } from '@discordjs/builders';
import type { executeCommand } from '@/discord-helper/types';
import { prisma } from '@/handlers/prisma';
import type {
  APIChatInputApplicationCommandInteractionData,
  APIChatInputApplicationCommandInteractionDataResolved
} from 'discord-api-types/v10';

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
  .setName('register-member')
  .setDescription('Register another member to the Alliance (Admin only)')
  .addUserOption((option) =>
    option
      .setName('user')
      .setDescription('The user to register')
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName('display_name')
      .setDescription('Their P5X display name')
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName('companio')
      .setDescription('Their companio')
      .setRequired(true)
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
  const displayName =
    displayNameOption && 'value' in displayNameOption
      ? String(displayNameOption.value)
      : 'Nagisa Kamisiro';
  const companioId =
    companioOption && 'value' in companioOption
      ? String(companioOption.value)
      : 'strega';

  if (!targetUserId) {
    return {
      type: 4,
      data: {
        content: 'Unable to retrieve the target user. Please try again.'
      }
    };
  }

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

    if (existingUser) {
      const companioName =
        companioMapper[existingUser.companio_id] || 'Unknown';
      return {
        type: 4,
        data: {
          content: `<@${targetUserId}> is already registered as **${existingUser.name}** in companio **${companioName}**! If you need to update their information, please contact an administrator.`
        }
      };
    }

    const extension = targetUser.avatar?.startsWith('a_') ? 'gif' : 'png';
    const avatarUrl = targetUser.avatar
      ? `https://cdn.discordapp.com/avatars/${targetUserId}/${targetUser.avatar}.${extension}`
      : `https://cdn.discordapp.com/embed/avatars/${parseInt(targetUserId) % 5}.png`;

    // Create new user
    await prisma.user.create({
      data: {
        id: targetUserId,
        discord_username: targetUser.username || targetUserId,
        name: displayName,
        avatar_url: avatarUrl,
        companio_id: companioId
      }
    });

    const companioName = companioMapper[companioId] || 'Unknown';

    return {
      type: 4,
      data: {
        content: `Successfully registered <@${targetUserId}>!\n**Display Name:** ${displayName}\n**Companio:** ${companioName}`
      }
    };
  } catch (error) {
    console.error('Error registering user:', error);
    return {
      type: 4,
      data: {
        content:
          'An error occurred while registering. Please try again later or contact an administrator.'
      }
    };
  }
};
