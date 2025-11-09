import { SlashCommandBuilder } from '@discordjs/builders';
import type { executeCommand } from '@/discord-helper/types';
import { prisma } from '@/handlers/prisma';
import type { APIChatInputApplicationCommandInteractionData } from 'discord-api-types/v10';

const companioMapper: Record<string, string> = {
  strega: 'Strega',
  zoshigaya: 'Zoshigaya',
  zoshigaya_zen: 'Zoshigaya Zen',
  zoshigaya_zoku: 'Zoshigaya Zoku'
};

export const register = new SlashCommandBuilder()
  .setName('register')
  .setDescription('Register yourself to the Alliance')
  .addStringOption((option) =>
    option
      .setName('display_name')
      .setDescription('Your P5X display name')
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName('companio')
      .setDescription('Your companio')
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

  const displayNameOption = data.options?.find(
    (opt) => opt.name === 'display_name'
  );

  const companioOption = data.options?.find((opt) => opt.name === 'companio');

  const displayName =
    displayNameOption && 'value' in displayNameOption
      ? String(displayNameOption.value)
      : '';
  const companioId =
    companioOption && 'value' in companioOption
      ? String(companioOption.value)
      : '';

  const discordUserId = interaction.member?.user.id;

  if (!discordUserId) {
    return {
      type: 4,
      data: {
        content: 'Unable to retrieve your Discord user ID. Please try again.'
      }
    };
  }

  try {
    // Check if user is already registered
    const existingUser = await prisma.user.findUnique({
      where: {
        discord_user_id: discordUserId
      }
    });

    if (existingUser) {
      return {
        type: 4,
        data: {
          content: `You're already registered as **${existingUser.name}**! If you need to update your information, please contact an administrator.`
        }
      };
    }

    const extension = interaction.member?.user.avatar?.startsWith('a_')
      ? 'gif'
      : 'png';
    const avatarUrl = interaction.member?.user.avatar
      ? `https://cdn.discordapp.com/avatars/${discordUserId}/${interaction.member.user.avatar}.${extension}`
      : `https://cdn.discordapp.com/embed/avatars/${parseInt(discordUserId) % 5}.png`;

    // Create new user
    await prisma.user.create({
      data: {
        id: interaction.member?.user.username || discordUserId,
        discord_user_id: discordUserId,
        name: displayName,
        avatar_url: avatarUrl,
        companio_id: companioId
      }
    });

    const companioName = companioMapper[companioId] || 'Unknown';

    return {
      type: 4,
      data: {
        content: `Successfully registered!\n**Display Name:** ${displayName}\n**Companio:** ${companioName}`
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
