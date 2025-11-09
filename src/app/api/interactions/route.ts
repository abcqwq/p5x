import {
  type APIInteractionResponse,
  type APIPingInteraction,
  type APIApplicationCommandInteraction,
  InteractionType
} from 'discord-api-types/v10';
import { NextResponse } from 'next/server';

import nacl from 'tweetnacl';
import getCommands from '@/discord-helper/get-commands';

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

type Interaction = APIPingInteraction | APIApplicationCommandInteraction;

type VerifyDiscordRequestResult =
  | { isValid: false }
  | {
      isValid: true;
      interaction: Interaction;
    };

async function verifyInteractionRequest(
  request: Request,
  appPublicKey: string
): Promise<VerifyDiscordRequestResult> {
  const signature = request.headers.get('x-signature-ed25519');
  const timestamp = request.headers.get('x-signature-timestamp');

  if (!signature || !timestamp) {
    return { isValid: false };
  }

  const rawBody = await request.text();
  const isValidRequest = verifyWithNacl({
    appPublicKey,
    rawBody,
    signature,
    timestamp
  });

  if (!isValidRequest) {
    return { isValid: false };
  }

  return {
    interaction: JSON.parse(rawBody) as Interaction,
    isValid: true
  };
}

export async function POST(req: Request) {
  try {
    const verifyRes = await verifyInteractionRequest(
      req,
      process.env.DISCORD_PUBLIC_KEY || ''
    );

    if (!verifyRes.isValid || !verifyRes.interaction) {
      return new NextResponse('Invalid request', { status: 401 });
    }
    const { interaction } = verifyRes;

    // Check if the interaction type is a ping
    // PING message, respond with ACK (part of Discord's security and authorization protocol)
    if (interaction.type === InteractionType.Ping) {
      return NextResponse.json({ type: 1 });
    }

    // get all commands
    const allCommands = await getCommands();

    // // execute command
    let reply: APIInteractionResponse | null = null;
    const commandName = interaction.data.name;
    if (allCommands[commandName]) {
      reply = await allCommands[commandName].execute(interaction);
    }

    if (!reply) throw new Error();
    return NextResponse.json({
      ...reply
    });
  } catch (error) {
    console.log(error);
    console.log('SOMETHING WENT WRONG');
    return NextResponse.error();
  }
}
