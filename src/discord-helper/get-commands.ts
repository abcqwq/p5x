import type { executeCommand } from './types';
import * as pingCommand from '@/discord-commands/ping';

type CommandModule = {
  register: typeof pingCommand.register;
  execute: executeCommand;
};

const commandModules: Record<string, CommandModule> = {
  ping: pingCommand
};

const getCommands = () => {
  return commandModules;
};

export default getCommands;
