import { SlashCommandBuilder } from '@discordjs/builders';
import type { executeCommand } from '@/server-things/discord/types';
import { prisma } from '@/handlers/prisma';
import { companioMapper } from '@/server-things/utils/p5x';
import { validateAdminId, getOptionValue } from '@/server-things/utils/discord';
import type { APIChatInputApplicationCommandInteractionData } from 'discord-api-types/v10';
import { fetchActiveNightmareGatewayPeriod } from '@/handlers/fetch-nightmare-period';

export const register = new SlashCommandBuilder()
  .setName('set-kkm')
  .setDescription('Set minimum score (KKM) for a companio (Admin only)')
  .addStringOption((option) =>
    option
      .setName('companio')
      .setDescription('The companio to set minimum score for')
      .setRequired(true)
      .addChoices(
        { name: 'Strega', value: 'strega' },
        { name: 'Zoshigaya', value: 'zoshigaya' },
        { name: 'Zoshigaya Zen', value: 'zoshigaya_zen' },
        { name: 'Zoshigaya Zoku', value: 'zoshigaya_zoku' }
      )
  )
  .addIntegerOption((option) =>
    option
      .setName('minimum_score')
      .setDescription('The minimum score required')
      .setRequired(true)
      .setMinValue(0)
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

  const companioId = getOptionValue(data.options, 'companio');
  const minimumScore = getOptionValue(data.options, 'minimum_score');

  if (!companioId || minimumScore === null || minimumScore === undefined) {
    return {
      type: 4,
      data: {
        content: 'Companio and minimum score are required.'
      }
    };
  }

  const minimumScoreNum = Number(minimumScore);
  if (Number.isNaN(minimumScoreNum) || minimumScoreNum < 0) {
    return {
      type: 4,
      data: {
        content: 'Minimum score must be a valid positive number.'
      }
    };
  }

  try {
    const activePeriod = await fetchActiveNightmareGatewayPeriod();

    if (!activePeriod) {
      return {
        type: 4,
        data: {
          content:
            'No active Nightmare Gateway period found. Please contact an administrator.'
        }
      };
    }

    if (activePeriod.end < new Date()) {
      return {
        type: 4,
        data: {
          content: `The current Nightmare Gateway period has ended. Please wait for the next period to start.`
        }
      };
    }

    const companio = await prisma.companio.findUnique({
      where: {
        id: companioId
      }
    });

    if (!companio) {
      return {
        type: 4,
        data: {
          content: `Companio **${companioId}** not found.`
        }
      };
    }

    await prisma.companioPeriodMinimumScore.upsert({
      where: {
        companio_id_nightmare_period_id: {
          companio_id: companioId,
          nightmare_period_id: activePeriod.id
        }
      },
      update: {
        minimum_score: minimumScoreNum
      },
      create: {
        companio_id: companioId,
        nightmare_period_id: activePeriod.id,
        minimum_score: minimumScoreNum
      }
    });

    const companioName = companioMapper[companioId] || companioId;

    return {
      type: 4,
      data: {
        content: `KKM for **${companioName}** has been set to **${minimumScoreNum.toLocaleString()}** for the current Nightmare Gateway period.`
      }
    };
  } catch (error) {
    console.error('Error setting minimum score:', error);
    return {
      type: 4,
      data: {
        content:
          'An error occurred while setting the minimum score. Please try again later or contact an administrator.'
      }
    };
  }
};
