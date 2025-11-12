import { SlashCommandBuilder } from '@discordjs/builders';
import type { executeCommand } from '@/server-things/discord/types';
import { prisma } from '@/handlers/prisma';
import { getOptionValue } from '@/server-things/utils/discord';
import type { APIChatInputApplicationCommandInteractionData } from 'discord-api-types/v10';
import { fetchActiveNightmareGatewayPeriod } from '@/handlers/fetch-nightmare-period';

export const register = new SlashCommandBuilder()
  .setName('score-alt')
  .setDescription('Submit your alt account Nightmare Gateway score')
  .addIntegerOption((option) =>
    option
      .setName('score')
      .setDescription('Your score')
      .setRequired(true)
      .setMinValue(0)
      .setMaxValue(Number.MAX_SAFE_INTEGER)
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

  const scoreValue = Number(getOptionValue(data.options, 'score') || 0);
  const altNumber = Number(getOptionValue(data.options, 'alt_number') || 0);

  const discordUserId = interaction.member?.user.id;

  if (!discordUserId) {
    return {
      type: 4,
      data: {
        content: 'Unable to retrieve your Discord user ID. Please try again.'
      }
    };
  }

  if (!altNumber) {
    return {
      type: 4,
      data: {
        content: 'Alt number is required.'
      }
    };
  }

  try {
    const userIdWithAlt = `${discordUserId}@${altNumber}`;
    const user = await prisma.user.findUnique({
      where: {
        id: userIdWithAlt
      }
    });

    if (!user) {
      return {
        type: 4,
        data: {
          content:
            'Please register your alt account first! Contact an administrator to register your alt.'
        }
      };
    }

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

    const existingScore = await prisma.nightmareGatewayScore.findFirst({
      where: {
        user_id: user.id,
        nightmare_id: activePeriod.id
      }
    });

    if (existingScore) {
      await prisma.nightmareGatewayScore.update({
        where: {
          id: existingScore.id
        },
        data: {
          first_half_score: scoreValue,
          second_half_score: 0
        }
      });

      return {
        type: 4,
        data: {
          content: `Successfully updated alt #${altNumber} score to **${scoreValue.toLocaleString()}**!`
        }
      };
    } else {
      await prisma.nightmareGatewayScore.create({
        data: {
          user_id: user.id,
          nightmare_id: activePeriod.id,
          first_half_score: scoreValue,
          second_half_score: 0
        }
      });

      return {
        type: 4,
        data: {
          content: `Successfully recorded alt #${altNumber} score of **${scoreValue.toLocaleString()}**!`
        }
      };
    }
  } catch (error) {
    console.error('Error recording alt score:', error);
    return {
      type: 4,
      data: {
        content:
          'An error occurred while recording your score. Please try again later or contact an administrator.'
      }
    };
  }
};
