import { SlashCommandBuilder } from '@discordjs/builders';
import type { executeCommand } from '@/discord-helper/types';
import type { APIChatInputApplicationCommandInteractionData } from 'discord-api-types/v10';
import { extractTextFromImage } from '@/handlers/process-score';
import { parseScoreData } from '@/utils/parse-score-data';
import { processScoreUpdates } from '@/handlers/update-scores';
import { prisma } from '@/handlers/prisma';

export const register = new SlashCommandBuilder()
  .setName('score-auto')
  .setDescription('Automatically record scores from a message')
  .addStringOption((option) =>
    option
      .setName('message_id')
      .setDescription('The message ID to fetch scores from')
      .setRequired(true)
  );

async function sendFollowUpMessage(
  applicationId: string,
  interactionToken: string,
  content: string
) {
  const botToken = process.env.DISCORD_TOKEN;
  if (!botToken) {
    throw new Error('DISCORD_TOKEN is not set');
  }

  const followUpUrl = `https://discord.com/api/v10/webhooks/${applicationId}/${interactionToken}`;

  await fetch(followUpUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bot ${botToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ content })
  });
}

async function processMessage(
  channelId: string,
  messageId: string,
  applicationId: string,
  interactionToken: string,
  nightmareId: string
) {
  try {
    const botToken = process.env.DISCORD_TOKEN;
    if (!botToken) {
      throw new Error('DISCORD_TOKEN is not set');
    }

    // Fetch the message from Discord
    const apiUrl = `https://discord.com/api/v10/channels/${channelId}/messages/${messageId}`;
    const messageResponse = await fetch(apiUrl, {
      headers: {
        Authorization: `Bot ${botToken}`
      }
    });

    if (!messageResponse.ok) {
      const errorText = await messageResponse.text();
      console.error('Failed to fetch message:', errorText);
      await sendFollowUpMessage(
        applicationId,
        interactionToken,
        `Failed to fetch message: ${messageResponse.statusText}`
      );
      return;
    }

    const message = await messageResponse.json();

    // Extract all image URLs from attachments
    const attachments = message.attachments || [];
    const imageUrls = attachments
      .filter((att: { content_type?: string }) =>
        att.content_type?.startsWith('image/')
      )
      .map((att: { url: string }) => att.url);

    if (imageUrls.length === 0) {
      await sendFollowUpMessage(
        applicationId,
        interactionToken,
        `No images found in message ID: ${messageId}`
      );
      return;
    }

    // Process each image individually
    for (let i = 0; i < imageUrls.length; i++) {
      const imageUrl = imageUrls[i];
      const imageNumber = i + 1;

      try {
        // Extract text from the current image
        const extractedText = await extractTextFromImage(
          imageUrl,
          process.env.GOOGLE_GEMINI_API_KEY || ''
        );

        // Parse the extracted text
        const { validScores, duplicateDisplayNames, invalidEntries } =
          parseScoreData(extractedText);

        // Process valid scores against the database
        const processResult = await processScoreUpdates(
          validScores,
          nightmareId
        );

        // Build follow-up message for this image
        const messageParts: string[] = [];
        messageParts.push(`**Image ${imageNumber}/${imageUrls.length}**\n`);

        // Successful updates
        if (processResult.successful.length > 0) {
          messageParts.push(
            `**Successfully updated (${processResult.successful.length}):**`
          );
          messageParts.push(
            processResult.successful
              .map((s) => `  • ${s.displayName}: ${s.score.toLocaleString()}`)
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
            processResult.multipleMatches
              .map((name) => `  • ${name}`)
              .join('\n')
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

        const followUpContent = messageParts.join('\n');

        await sendFollowUpMessage(
          applicationId,
          interactionToken,
          followUpContent
        );
      } catch (error) {
        console.error(`Error processing image ${imageNumber}:`, error);
        await sendFollowUpMessage(
          applicationId,
          interactionToken,
          `**Image ${imageNumber}/${imageUrls.length}**: Failed to process this image.`
        );
      }
    }
  } catch (error) {
    console.error('Error processing message:', error);
    await sendFollowUpMessage(
      applicationId,
      interactionToken,
      'An error occurred while processing the message. Please try again later.'
    );
  }
}

export const execute: executeCommand = async (interaction) => {
  const data =
    interaction.data as APIChatInputApplicationCommandInteractionData;

  const messageIdOption = data.options?.find(
    (opt) => opt.name === 'message_id'
  );
  const messageId =
    messageIdOption && 'value' in messageIdOption
      ? String(messageIdOption.value)
      : '';

  if (!messageId) {
    return {
      type: 4,
      data: {
        content: 'Message ID is required.'
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

  // Start processing asynchronously
  processMessage(
    interaction.channel_id,
    messageId,
    interaction.application_id,
    interaction.token,
    latestPeriod.id
  ).catch((error) => {
    console.error('Unhandled error in processMessage:', error);
  });

  // Return immediate response
  return {
    type: 4,
    data: {
      content: 'Got your request, please wait!'
    }
  };
};
