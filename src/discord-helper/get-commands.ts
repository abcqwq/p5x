import type { executeCommand } from './types';

import * as pingCommand from '@/discord-commands/ping';
import * as registerCommand from '@/discord-commands/register';
import * as scoreCommand from '@/discord-commands/score';
import * as scoreMemberCommand from '@/discord-commands/score-member';
import * as registerMemberCommand from '@/discord-commands/register-member';

type CommandModule = {
  register:
    | typeof pingCommand.register
    | typeof registerCommand.register
    | typeof scoreCommand.register
    | typeof scoreMemberCommand.register
    | typeof registerMemberCommand.register;
  execute: executeCommand;
};

const commandModules: Record<string, CommandModule> = {
  ping: pingCommand,
  register: registerCommand,
  score: scoreCommand,
  'score-member': scoreMemberCommand,
  'register-member': registerMemberCommand
};

const getCommands = () => {
  return commandModules;
};

export default getCommands;
