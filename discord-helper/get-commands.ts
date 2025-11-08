import { resolve } from 'path';
import { readdirSync } from 'fs';

import type { SlashCommandBuilder } from '@discordjs/builders';
import type { executeCommand } from './types';

type commandModule = {
  execute: executeCommand;
  register: SlashCommandBuilder;
};

let seenCommands: {
  [key: string]: commandModule;
} | null = null;

function getTsFiles(dir: string) {
  const files = readdirSync(dir).filter((file) => file.endsWith('.ts'));
  return files;
}

const getCommands = async () => {
  if (seenCommands) return seenCommands;
  const commandDir = resolve(process.cwd(), 'discord-commands');
  const commandFiles = getTsFiles(commandDir);
  const commands: { [key: string]: commandModule } = {};
  for (const file of commandFiles) {
    try {
      const fileContents = (await import(
        '../discord-commands/' + file
      )) as commandModule;
      if (fileContents) commands[file] = fileContents;
    } catch (_) {}
  }
  seenCommands = commands;
  return commands;
};

export default getCommands;
