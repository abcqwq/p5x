import getCommands from '@/server-things/discord/get-commands';

import {
  type APIInteractionResponse,
  InteractionType,
  InteractionResponseType
} from 'discord-api-types/v10';
import {
  verifyInteractionRequest,
  isGuildWhitelisted
} from '@/server-things/discord/helpers';
import {
  unauthorized,
  internalServerError,
  pong
} from '@/server-things/utils/base-responses';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const interaction = await verifyInteractionRequest(req);
    if (!interaction) {
      return unauthorized();
    }

    if (interaction.type === InteractionType.Ping) {
      return pong();
    }

    if (interaction.type !== InteractionType.ApplicationCommand) {
      return unauthorized();
    }

    if (!isGuildWhitelisted(interaction.guild_id)) {
      return NextResponse.json({
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          content:
            'This bot is not available in this server. Contact the administrator to whitelist this server.'
        }
      });
    }

    const command = getCommands()[interaction.data.name];
    if (!command) {
      return NextResponse.json({
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          content: 'Unknown command.'
        }
      });
    }

    const reply: APIInteractionResponse = await command.execute(interaction);
    return NextResponse.json(reply);
  } catch (error) {
    console.error('Error handling interaction:', error);
    return internalServerError();
  }
}
