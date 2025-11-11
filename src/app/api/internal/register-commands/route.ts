import {
  unauthorized,
  success,
  internalServerError
} from '@/server-things/utils/base-responses';
import { query as SyncDiscordCommands } from '@/bridge-things/network/api/put-discord-commands';
import { validateServerKey } from '@/server-things/utils/validator';

export async function POST(req: Request) {
  try {
    if (!validateServerKey(req.headers.get('Authorization'))) {
      return unauthorized();
    }

    await SyncDiscordCommands();

    return success();
  } catch (error) {
    console.error(error);
    return internalServerError();
  }
}
