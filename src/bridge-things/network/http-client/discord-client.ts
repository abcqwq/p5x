import constructClient from '@/bridge-things/network/http-client/axios';
import {
  DefaultConfig,
  type ClientConfig
} from '@/bridge-things/network/http-client/client-config';

const config: ClientConfig = {
  baseURL: process.env.DISCORD_BASE_URL || DefaultConfig.baseURL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bot ${process.env.DISCORD_TOKEN}`
  }
};

const discordClient = constructClient(config);

export default discordClient;
