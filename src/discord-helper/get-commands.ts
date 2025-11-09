import type { executeCommand } from './types';

const commandModules: Record<string, executeCommand> = {
  ping: async (interaction) => {
    return {
      type: 4,
      data: {
        content: `pong! ${interaction.member?.user.username}`
      }
    };
  }
};

const getCommands = () => {
  return commandModules;
};

export default getCommands;
