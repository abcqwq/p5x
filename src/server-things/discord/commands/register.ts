import { SlashCommandBuilder } from '@discordjs/builders';
import { prisma } from '@/handlers/prisma';
import { companioMapper } from '@/server-things/utils/p5x';
import { getOptionValue } from '@/server-things/utils/discord';
import type { APIChatInputApplicationCommandInteractionData } from 'discord-api-types/v10';
import type { executeCommand } from '@/server-things/discord/types';
import { STREGA_URL_MESSAGE } from '@/server-things/utils/base-responses';

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
        { name: 'Zoshigaya Zoku', value: 'zoshigaya_zoku' },
        { name: 'Zoshigaya Kai', value: 'zoshigaya_kai' }
      )
  );

export const execute: executeCommand = async (interaction) => {
  const data =
    interaction.data as APIChatInputApplicationCommandInteractionData;

  const displayName = getOptionValue(data.options, 'display_name');
  const companioId = getOptionValue(data.options, 'companio');

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
    const existingUser = await prisma.user.findUnique({
      where: {
        id: discordUserId
      }
    });

    if (existingUser) {
      const companioName =
        companioMapper[existingUser.companio_id] || 'Unknown';
      return {
        type: 4,
        data: {
          content: `You're already registered as **${existingUser.name}** in companio **${companioName}**! If you need to update your information, please contact an administrator.`
        }
      };
    }

    const extension = interaction.member?.user.avatar?.startsWith('a_')
      ? 'gif'
      : 'png';
    const avatarUrl = interaction.member?.user.avatar
      ? `https://cdn.discordapp.com/avatars/${discordUserId}/${interaction.member.user.avatar}.${extension}`
      : `https://cdn.discordapp.com/embed/avatars/${parseInt(discordUserId) % 5}.png`;

    await prisma.user.create({
      data: {
        id: discordUserId,
        discord_username: interaction.member?.user.username || discordUserId,
        name: displayName,
        avatar_url: avatarUrl,
        companio_id: companioId
      }
    });

    const companioName = companioMapper[companioId] || 'Unknown';

    return {
      type: 4,
      data: {
        content: `Successfully registered!\n**Display Name:** ${displayName}\n**Companio:** ${companioName}${STREGA_URL_MESSAGE}`
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
