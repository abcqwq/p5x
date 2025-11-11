import type {
  APIPingInteraction,
  APIApplicationCommandInteraction
} from 'discord-api-types/v10';
import nacl from 'tweetnacl';

type VerifyWithNaclArgs = {
  appPublicKey: string;
  rawBody: string;
  signature: string;
  timestamp: string;
};

const verifyWithNacl = ({
  appPublicKey,
  signature,
  rawBody,
  timestamp
}: VerifyWithNaclArgs): boolean => {
  const signatureBuffer = Buffer.from(signature, 'hex');
  const publicKeyBuffer = Buffer.from(appPublicKey, 'hex');
  const messageBuffer = Buffer.from(timestamp + rawBody);

  return nacl.sign.detached.verify(
    messageBuffer,
    signatureBuffer,
    publicKeyBuffer
  );
};

export type Interaction = APIPingInteraction | APIApplicationCommandInteraction;

export async function verifyInteractionRequest(
  request: Request
): Promise<Interaction | null> {
  const signature = request.headers.get('x-signature-ed25519');
  const timestamp = request.headers.get('x-signature-timestamp');

  if (!signature || !timestamp) {
    return null;
  }

  const appPublicKey = process.env.DISCORD_PUBLIC_KEY;
  if (!appPublicKey) {
    return null;
  }

  const rawBody = await request.text();
  const isValidRequest = verifyWithNacl({
    appPublicKey,
    rawBody,
    signature,
    timestamp
  });

  if (!isValidRequest) {
    return null;
  }

  return JSON.parse(rawBody) as Interaction;
}

export function isGuildWhitelisted(guildId: string | undefined): boolean {
  const whitelistedServerIds =
    process.env.DISCORD_WHITELISTED_SERVERS?.split(',') || [];

  return whitelistedServerIds.includes(guildId || '');
}
