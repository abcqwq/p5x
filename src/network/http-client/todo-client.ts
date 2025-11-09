import constructClient from '@/network/http-client/axios';
import {
  DefaultConfig,
  type ClientConfig
} from '@/network/http-client/client-config';

const config: ClientConfig = {
  baseURL: process.env.NEXT_PUBLIC_TODO_BASE_URL || DefaultConfig.baseURL
};

const userClient = constructClient(config);

export default userClient;
