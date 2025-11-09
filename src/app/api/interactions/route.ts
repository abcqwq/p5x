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

    // Check if the interaction is from a whitelisted server
    const whitelistedServerIds =
      process.env.DISCORD_WHITELISTED_SERVERS?.split(',') || [];

    // Only check guild_id for application commands (not pings)
    if (interaction.type === InteractionType.ApplicationCommand) {
      const guildId = interaction.guild_id;

      // If whitelist is configured and guild_id is not in the whitelist, reject
      if (
        whitelistedServerIds.length > 0 &&
        !whitelistedServerIds.includes(guildId || '')
      ) {
        return NextResponse.json({
          type: 4, // InteractionResponseType.ChannelMessageWithSource
          data: {
            content:
              '❌ This bot is not available in this server. Contact the administrator to whitelist this server.'
          }
        });
      }
    }

    // get all commands
    const allCommands = await getCommands();

    // // execute command
    let reply: APIInteractionResponse | null = null;
    const commandName = interaction.data.name;
    if (allCommands[commandName]) {
      // Send immediate response with custom message
      const initialResponse = NextResponse.json({
        type: 4, // InteractionResponseType.ChannelMessageWithSource
        data: {
          content: 'Got your request, please wait!'
        }
      });

      // Execute the command asynchronously and edit the response
      (async () => {
        try {
          reply = await allCommands[commandName].execute(interaction);

          if (reply && interaction.token) {
            // Edit the original response via Discord API
            const editUrl = `https://discord.com/api/v10/webhooks/${process.env.DISCORD_APP_ID}/${interaction.token}/messages/@original`;

            await fetch(editUrl, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ ...reply })
            });
          }
        } catch (error) {
          console.error('Error executing deferred command:', error);
          // Edit the message with error info
          if (interaction.token) {
            const editUrl = `https://discord.com/api/v10/webhooks/${process.env.DISCORD_APP_ID}/${interaction.token}/messages/@original`;

            await fetch(editUrl, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                content:
                  'An error occurred while processing your command. Please try again later.'
              })
            });
          }
        }
      })();

      return initialResponse;
    }

    // test
    throw new Error('Command not found');
  } catch (error) {
    console.log(error);
    console.log('SOMETHING WENT WRONG');
    return NextResponse.error();
  }
}
