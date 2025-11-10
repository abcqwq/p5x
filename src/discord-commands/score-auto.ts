import { SlashCommandBuilder } from '@discordjs/builders';
import type { executeCommand } from '@/discord-helper/types';
import type { APIChatInputApplicationCommandInteractionData } from 'discord-api-types/v10';

export const register = new SlashCommandBuilder()
  .setName('score-auto')
  .setDescription('Automatically record scores from a message')
  .addStringOption((option) =>
    option
      .setName('companio')
      .setDescription('Which companio the scores belong to')
      .setRequired(true)
      .addChoices(
        { name: 'Strega', value: 'strega' },
        { name: 'Zoshigaya', value: 'zoshigaya' },
        { name: 'Zoshigaya Zen', value: 'zoshigaya_zen' },
        { name: 'Zoshigaya Zoku', value: 'zoshigaya_zoku' }
      )
  )
  .addStringOption((option) =>
    option
      .setName('message_id')
      .setDescription('The message ID to fetch scores from')
      .setRequired(true)
  );

export const execute: executeCommand = async (interaction) => {
  // Type guard to check if this is a chat input command
  const data =
    interaction.data as APIChatInputApplicationCommandInteractionData;

  const companioOption = data.options?.find((opt) => opt.name === 'companio');
  const messageIdOption = data.options?.find(
    (opt) => opt.name === 'message_id'
  );

  const companio =
    companioOption && 'value' in companioOption
      ? String(companioOption.value)
      : '';
  const messageId =
    messageIdOption && 'value' in messageIdOption
      ? String(messageIdOption.value)
      : '';

  if (!companio || !messageId) {
    return {
      type: 4,
      data: {
        content: 'Both companio and message_id are required.'
      }
    };
  }

  try {
    // TODO: Fetch the message content using Discord API
    // For now, just log the message ID
    console.log('Message ID:', messageId);
    console.log('Companio:', companio);
    console.log('Message content would be fetched here');

    return {
      type: 4,
      data: {
        content: `Successfully processed message ID: ${messageId} for companio: ${companio}`
      }
    };
  } catch (error) {
    console.error('Error processing message:', error);
    return {
      type: 4,
      data: {
        content:
          'An error occurred while processing the message. Please try again later.'
      }
    };
  }
};
