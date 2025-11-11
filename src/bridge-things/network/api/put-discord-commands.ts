import client from '@/bridge-things/network/http-client/discord-client';

import getCommands from '@/server-things/discord/get-commands';

export const query = async () => {
  const commands = Object.values(getCommands());
  client.put(
    `/api/applications/${process.env.DISCORD_APP_ID}/commands`,
    commands.map((command) => command.register.toJSON())
  );
};
