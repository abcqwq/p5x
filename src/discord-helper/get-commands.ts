import type { executeCommand } from './types';

import * as pingCommand from '@/discord-commands/ping';
import * as registerCommand from '@/discord-commands/register';
import * as scoreCommand from '@/discord-commands/score';
import * as scoreMemberCommand from '@/discord-commands/score-member';
import * as registerMemberCommand from '@/discord-commands/register-member';
import * as scoreAutoCommand from '@/discord-commands/score-auto';
import * as editMemberCommand from '@/discord-commands/edit-member';
import * as scoreAutoV2Command from '@/discord-commands/score-auto-v2';

type CommandModule = {
  register:
    | typeof pingCommand.register
    | typeof registerCommand.register
    | typeof scoreCommand.register
    | typeof scoreMemberCommand.register
    | typeof registerMemberCommand.register
    | typeof scoreAutoCommand.register
    | typeof editMemberCommand.register
    | typeof scoreAutoV2Command.register;
  execute: executeCommand;
};

const commandModules: Record<string, CommandModule> = {
  ping: pingCommand,
  register: registerCommand,
  score: scoreCommand,
  'score-member': scoreMemberCommand,
  'register-member': registerMemberCommand,
  'score-auto': scoreAutoCommand,
  'edit-member': editMemberCommand,
  'score-auto-v2': scoreAutoV2Command
};

const getCommands = () => {
  return commandModules;
};

export default getCommands;
