export interface ClientConfig {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
}

export const DefaultConfig: ClientConfig = {
  baseURL: 'http://localhost:3000',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
};
