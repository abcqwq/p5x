import { SlashCommandBuilder } from '@discordjs/builders';
import type { executeCommand } from '@/server-things/discord/types';

export const register = new SlashCommandBuilder()
  .setName('ping')
  .setDescription("pong's you back! (bot check)");

export const execute: executeCommand = async (interaction) => {
  console.log('Ping command executed by', interaction.member?.user.username);

  return {
    type: 4,
    data: {
      content: `pong! ${interaction.member?.user.username}`
    }
  };
};
