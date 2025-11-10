import { SlashCommandBuilder } from '@discordjs/builders';
import type { executeCommand } from '@/discord-helper/types';
import type { APIChatInputApplicationCommandInteractionData } from 'discord-api-types/v10';

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
  interactionToken: string
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

    // Build follow-up message with image URLs
    const followUpContent =
      `Found ${imageUrls.length} image(s) in message ID: ${messageId}\n\n` +
      imageUrls
        .map((url: string, index: number) => `**Image ${index + 1}:** ${url}`)
        .join('\n');

    await sendFollowUpMessage(applicationId, interactionToken, followUpContent);
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

  // Start processing asynchronously
  processMessage(
    interaction.channel_id,
    messageId,
    interaction.application_id,
    interaction.token
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
