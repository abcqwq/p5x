import { SlashCommandBuilder } from '@discordjs/builders';
import type { executeCommand } from '@/discord-helper/types';
import { prisma } from '@/handlers/prisma';
import type { APIChatInputApplicationCommandInteractionData } from 'discord-api-types/v10';

export const register = new SlashCommandBuilder()
  .setName('score')
  .setDescription('Submit your Nightmare Gateway score')
  .addIntegerOption((option) =>
    option
      .setName('score')
      .setDescription('Your score')
      .setRequired(true)
      .setMinValue(0)
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
        discord_user_id: discordUserId
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

    // Fetch the latest nightmare gateway period
    const latestPeriod = await prisma.nightmareGatewayPeriod.findFirst({
      orderBy: {
        end: 'desc'
      }
    });

    if (!latestPeriod) {
      return {
        type: 4,
        data: {
          content:
            'No active Nightmare Gateway period found. Please contact an administrator.'
        }
      };
    }

    // Check if the period has not ended yet
    const now = new Date();
    const periodEnd = new Date(latestPeriod.end);

    if (periodEnd < now) {
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
        nightmare_id: latestPeriod.id
      }
    });

    if (existingScore) {
      // Update only the first half score
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
          content: `Successfully updated your score to **${scoreValue.toLocaleString()}**!`
        }
      };
    } else {
      // Create new score record with first half score only
      await prisma.nightmareGatewayScore.create({
        data: {
          user_id: user.id,
          nightmare_id: latestPeriod.id,
          first_half_score: scoreValue,
          second_half_score: 0
        }
      });

      return {
        type: 4,
        data: {
          content: `Successfully recorded your first half score of **${scoreValue.toLocaleString()}** for ${latestPeriod.first_half_boss_name}!`
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
