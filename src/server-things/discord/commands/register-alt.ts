import { SlashCommandBuilder } from '@discordjs/builders';
import type { executeCommand } from '@/server-things/discord/types';
import { prisma } from '@/handlers/prisma';
import { companioMapper } from '@/server-things/utils/p5x';
import { validateAdminId, getOptionValue } from '@/server-things/utils/discord';
import type {
  APIChatInputApplicationCommandInteractionData,
  APIChatInputApplicationCommandInteractionDataResolved
} from 'discord-api-types/v10';
import { STREGA_URL_MESSAGE } from '@/server-things/utils/base-responses';

export const register = new SlashCommandBuilder()
  .setName('register-alt')
  .setDescription('Register an alt account to the Alliance (Admin only)')
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
  )
  .addNumberOption((option) =>
    option
      .setName('alt_number')
      .setDescription(
        'Alt account number (e.g., 1 for first alt, 2 for second alt)'
      )
      .setRequired(true)
      .setMinValue(1)
      .setMaxValue(Number.MAX_SAFE_INTEGER)
  );

export const execute: executeCommand = async (interaction) => {
  const data =
    interaction.data as APIChatInputApplicationCommandInteractionData;

  const executorId = interaction.member?.user.id;
  if (!validateAdminId(executorId)) {
    return {
      type: 4,
      data: {
        content: 'You do not have permission to use this command.'
      }
    };
  }

  const targetUserId = getOptionValue(data.options, 'user');
  if (!targetUserId) {
    return {
      type: 4,
      data: {
        content: 'Unable to retrieve the target user. Please try again.'
      }
    };
  }

  const displayName = getOptionValue(data.options, 'display_name');
  const companioId = getOptionValue(data.options, 'companio');
  const altNumber = getOptionValue(data.options, 'alt_number');
  if (!displayName || !companioId || !altNumber) {
    return {
      type: 4,
      data: {
        content: 'Display name, companio, and alt number are required.'
      }
    };
  }

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
    const userIdWithAlt = `${targetUserId}@${altNumber}`;
    const existingUser = await prisma.user.findUnique({
      where: {
        id: userIdWithAlt
      }
    });

    if (existingUser) {
      const companioName =
        companioMapper[existingUser.companio_id] || 'Unknown';
      return {
        type: 4,
        data: {
          content: `<@${targetUserId}> alt #${altNumber} is already registered as **${existingUser.name}** in companio **${companioName}**! If you need to update their information, please contact an administrator.`
        }
      };
    }

    const extension = targetUser.avatar?.startsWith('a_') ? 'gif' : 'png';
    const avatarUrl = targetUser.avatar
      ? `https://cdn.discordapp.com/avatars/${targetUserId}/${targetUser.avatar}.${extension}`
      : `https://cdn.discordapp.com/embed/avatars/${parseInt(targetUserId) % 5}.png`;

    await prisma.user.create({
      data: {
        id: userIdWithAlt,
        discord_username: `${targetUser.username}@${altNumber}`,
        name: displayName,
        avatar_url: avatarUrl,
        companio_id: companioId
      }
    });

    const companioName = companioMapper[companioId] || 'Unknown';

    return {
      type: 4,
      data: {
        content: `Successfully registered <@${targetUserId}> #${altNumber} alt!\n**Display Name:** ${displayName}\n**Companio:** ${companioName}\n**Alt Number:** ${altNumber}${STREGA_URL_MESSAGE}`
      }
    };
  } catch (error) {
    console.error('Error registering alt account:', error);
    return {
      type: 4,
      data: {
        content:
          'An error occurred while registering. Please try again later or contact an administrator.'
      }
    };
  }
};
