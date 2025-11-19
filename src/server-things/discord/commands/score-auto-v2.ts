import { SlashCommandBuilder } from '@discordjs/builders';
import type { executeCommand } from '@/server-things/discord/types';
import type { APIChatInputApplicationCommandInteractionData } from 'discord-api-types/v10';
import { parseScoresDataString } from '@/utils/parse-score-data';
import { processScoreUpdates } from '@/handlers/update-scores';
import discordClient from '@/bridge-things/network/http-client/discord-client';
import { fetchActiveNightmareGatewayPeriod } from '@/handlers/fetch-nightmare-period';
import { STREGA_URL_MESSAGE } from '@/server-things/utils/base-responses';

const WHITELISTED_ADMIN_IDS = new Set<string>(
  process.env.WHITELISTED_ADMIN_IDS?.split(',').map((id) => id.trim()) || []
);

export const register = new SlashCommandBuilder()
  .setName('score-auto-v2')
  .setDescription('Automatically record scores from input data')
  .addStringOption((option) =>
    option
      .setName('scores_data')
      .setDescription(
        'It MUST be in the format of {display_name_1}:{score_1},{display_name_2}:{score_2},...'
      )
      .setRequired(true)
  );

async function sendFollowUpMessage(
  applicationId: string,
  interactionToken: string,
  content: string
) {
  const followUpUrl = `/api/v10/webhooks/${applicationId}/${interactionToken}`;
  await discordClient.post(followUpUrl, { content });
}

async function processScoresData(
  scoresData: string,
  applicationId: string,
  interactionToken: string,
  nightmareId: string
) {
  try {
    const { validScores, duplicateDisplayNames, invalidEntries } =
      parseScoresDataString(scoresData);

    // Process valid scores against the database
    const processResult = await processScoreUpdates(validScores, nightmareId);

    // Build follow-up message
    const messageParts: string[] = [];

    // Successful updates
    if (processResult.successful.length > 0) {
      messageParts.push(
        `**Successfully updated (${processResult.successful.length}):**`
      );
      messageParts.push(
        processResult.successful
          .map(
            (s) =>
              `  • ${s.displayName}: ${s.previousScore.toLocaleString()} → ${s.score.toLocaleString()}`
          )
          .join('\n')
      );
      messageParts.push('');
    }

    // Duplicate display names
    if (duplicateDisplayNames.length > 0) {
      messageParts.push(
        `**Duplicate Display Names (${duplicateDisplayNames.length}):**`
      );
      messageParts.push(
        duplicateDisplayNames.map((name) => `  • ${name}`).join('\n')
      );
      messageParts.push('');
    }

    // Multiple user matches
    if (processResult.multipleMatches.length > 0) {
      messageParts.push(
        `**Display Names used by multiple users (${processResult.multipleMatches.length}):**`
      );
      messageParts.push(
        processResult.multipleMatches.map((name) => `  • ${name}`).join('\n')
      );
      messageParts.push('');
    }

    // No user matches
    if (processResult.noMatches.length > 0) {
      messageParts.push(
        `**No User Found (${processResult.noMatches.length}):**`
      );
      messageParts.push(
        processResult.noMatches.map((name) => `  • ${name}`).join('\n')
      );
      messageParts.push('');
    }

    // Invalid entries
    if (invalidEntries.length > 0) {
      messageParts.push(`**Invalid Data (${invalidEntries.length}):**`);
      messageParts.push(
        invalidEntries.map((entry) => `  • ${entry}`).join('\n')
      );
    }

    const followUpContent =
      messageParts.length > 0
        ? messageParts.join('\n') + STREGA_URL_MESSAGE
        : 'No data to process.';

    await sendFollowUpMessage(applicationId, interactionToken, followUpContent);
  } catch (error) {
    console.error('Error processing scores data:', error);
    await sendFollowUpMessage(
      applicationId,
      interactionToken,
      'An error occurred while processing the scores data. Please try again later.'
    );
  }
}

export const execute: executeCommand = async (interaction) => {
  const executorId = interaction.member?.user.id;
  if (!executorId || !WHITELISTED_ADMIN_IDS.has(executorId)) {
    return {
      type: 4,
      data: {
        content: 'You do not have permission to use this command.'
      }
    };
  }

  const data =
    interaction.data as APIChatInputApplicationCommandInteractionData;

  const scoresDataOption = data.options?.find(
    (opt) => opt.name === 'scores_data'
  );
  const scoresData =
    scoresDataOption && 'value' in scoresDataOption
      ? String(scoresDataOption.value)
      : '';

  if (!scoresData) {
    return {
      type: 4,
      data: {
        content: 'Scores data is required.'
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

  // Start processing asynchronously
  processScoresData(
    scoresData,
    interaction.application_id,
    interaction.token,
    activePeriod.id
  ).catch((error: unknown) => {
    console.error('Unhandled error in processScoresData:', error);
  });

  // Return immediate response
  return {
    type: 4,
    data: {
      content: 'Got your request, please wait!'
    }
  };
};
