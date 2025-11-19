import { SlashCommandBuilder } from '@discordjs/builders';
import type { executeCommand } from '@/server-things/discord/types';
import { prisma } from '@/handlers/prisma';
import type { APIChatInputApplicationCommandInteractionData } from 'discord-api-types/v10';
import { fetchActiveNightmareGatewayPeriod } from '@/handlers/fetch-nightmare-period';
import { STREGA_URL_MESSAGE } from '@/server-things/utils/base-responses';

export const register = new SlashCommandBuilder()
  .setName('score')
  .setDescription('Submit your Nightmare Gateway score')
  .addIntegerOption((option) =>
    option
      .setName('score')
      .setDescription('Your score')
      .setRequired(true)
      .setMinValue(0)
      .setMaxValue(Number.MAX_SAFE_INTEGER)
  );

export const execute: executeCommand = async (interaction) => {
  // Type guard to check if this is a chat input command
  const data =
    interaction.data as APIChatInputApplicationCommandInteractionData;

  const scoreOption = data.options?.find((opt) => opt.name === 'score');

  const scoreValue =
    scoreOption && 'value' in scoreOption ? Number(scoreOption.value) : 0;

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
    // Check if user is registered
    const user = await prisma.user.findUnique({
      where: {
        id: discordUserId
      }
    });

    if (!user) {
      return {
        type: 4,
        data: {
          content:
            'Please register yourself first! Use the `/register` command to get started.'
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

    // Check if user already has a score record for this period
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
          content: `Successfully updated your score to **${scoreValue.toLocaleString()}**!${STREGA_URL_MESSAGE}`
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
          content: `Successfully recorded your score of **${scoreValue.toLocaleString()}**!${STREGA_URL_MESSAGE}`
        }
      };
    }
  } catch (error) {
    console.error('Error recording score:', error);
    return {
      type: 4,
      data: {
        content:
          'An error occurred while recording your score. Please try again later or contact an administrator.'
      }
    };
  }
};
