import { SlashCommandBuilder } from '@discordjs/builders';
import type { executeCommand } from '@/server-things/discord/types';
import { prisma } from '@/handlers/prisma';
import type {
  APIChatInputApplicationCommandInteractionData,
  APIChatInputApplicationCommandInteractionDataResolved
} from 'discord-api-types/v10';
import { getOptionValue } from '@/server-things/utils/discord';
import { fetchActiveNightmareGatewayPeriod } from '@/handlers/fetch-nightmare-period';
import { STREGA_URL_MESSAGE } from '@/server-things/utils/base-responses';

// Whitelist of Discord user IDs allowed to record scores for other members
const WHITELISTED_ADMIN_IDS = new Set<string>(
  process.env.WHITELISTED_ADMIN_IDS?.split(',').map((id) => id.trim()) || []
);

export const register = new SlashCommandBuilder()
  .setName('score-member')
  .setDescription(
    'Submit Nightmare Gateway score for another member (Admin only)'
  )
  .addUserOption((option) =>
    option
      .setName('user')
      .setDescription('The user to record score for')
      .setRequired(true)
  )
  .addIntegerOption((option) =>
    option
      .setName('score')
      .setDescription('Their score')
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
      .setRequired(false)
      .setMinValue(1)
      .setMaxValue(Number.MAX_SAFE_INTEGER)
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
  const scoreOption = data.options?.find((opt) => opt.name === 'score');

  const targetUserId =
    userOption && 'value' in userOption ? String(userOption.value) : '';
  const scoreValue =
    scoreOption && 'value' in scoreOption ? Number(scoreOption.value) : 0;

  const altNumber = getOptionValue(data.options, 'alt_number');

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
    const userIdWithAlt = altNumber
      ? `${targetUserId}@${altNumber}`
      : targetUserId;
    const user = await prisma.user.findUnique({
      where: {
        id: userIdWithAlt
      }
    });

    if (!user) {
      return {
        type: 4,
        data: {
          content: altNumber
            ? `User <@${targetUserId}> alt #${altNumber} is not registered. Please ask them to register first.`
            : `User <@${targetUserId}> is not registered. Please ask them to register first.`
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
          content: `Successfully updated score for <@${targetUserId}> (**${user.name}**) to **${scoreValue.toLocaleString()}**!${STREGA_URL_MESSAGE}`
        }
      };
    } else {
      // Create new score record with first half score only
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
          content: `Successfully recorded score of **${scoreValue.toLocaleString()}** for <@${targetUserId}> (**${user.name}**)!${STREGA_URL_MESSAGE}`
        }
      };
    }
  } catch (error) {
    console.error('Error recording score for member:', error);
    return {
      type: 4,
      data: {
        content:
          'An error occurred while recording the score. Please try again later or contact an administrator.'
      }
    };
  }
};
