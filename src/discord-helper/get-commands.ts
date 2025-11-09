import type { executeCommand } from './types';

import * as pingCommand from '@/discord-commands/ping';
import * as registerCommand from '@/discord-commands/register';

type CommandModule = {
  register: typeof pingCommand.register | typeof registerCommand.register;
  execute: executeCommand;
};

const commandModules: Record<string, CommandModule> = {
  ping: pingCommand,
  register: registerCommand
};

const getCommands = () => {
  return commandModules;
};

export default getCommands;
