import type { executeCommand } from './types';

import * as pingCommand from '@/server-things/discord/commands/ping';
import * as registerCommand from '@/server-things/discord/commands/register';
import * as scoreCommand from '@/server-things/discord/commands/score';
import * as scoreMemberCommand from '@/server-things/discord/commands/score-member';
import * as registerMemberCommand from '@/server-things/discord/commands/register-member';
import * as scoreAutoCommand from '@/server-things/discord/commands/score-auto';
import * as editMemberCommand from '@/server-things/discord/commands/edit-member';
import * as scoreAutoV2Command from '@/server-things/discord/commands/score-auto-v2';
import * as setKkmCommand from '@/server-things/discord/commands/set-kkm';

export type CommandModule = {
  register: unknown & { toJSON: () => unknown };
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
  'score-auto-v2': scoreAutoV2Command,
  'set-kkm': setKkmCommand
};

const getCommands = () => {
  return commandModules;
};

export default getCommands;
