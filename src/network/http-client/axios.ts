import axios, { type AxiosInstance } from 'axios';
import {
  type ClientConfig,
  DefaultConfig
} from '@/network/http-client/client-config';

const constructClient = (config: ClientConfig): AxiosInstance => {
  const client = axios.create({
    baseURL: config.baseURL,
    timeout: config.timeout || DefaultConfig.timeout,
    headers: config.headers || DefaultConfig.headers
  });

  return client;
};

export default constructClient;
