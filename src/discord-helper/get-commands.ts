import type { executeCommand } from './types';

import * as pingCommand from '@/discord-commands/ping';
import * as registerCommand from '@/discord-commands/register';
import * as scoreCommand from '@/discord-commands/score';

type CommandModule = {
  register:
    | typeof pingCommand.register
    | typeof registerCommand.register
    | typeof scoreCommand.register;
  execute: executeCommand;
};

const commandModules: Record<string, CommandModule> = {
  ping: pingCommand,
  register: registerCommand,
  score: scoreCommand
};

const getCommands = () => {
  return commandModules;
};

export default getCommands;
