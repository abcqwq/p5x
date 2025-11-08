import getCommands from '@/../discord-helper/get-commands';
import { NextResponse } from 'next/server';

import axios from 'axios';

const request = axios.create({
  baseURL: 'https://discord.com',
  timeout: 3000,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
    'Access-Control-Allow-Headers': 'Authorization',
    Authorization: `Bot ${process.env.DISCORD_TOKEN}`
  }
});

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || authHeader !== `Bearer ${process.env.ADMIN_TOKEN}`) {
      return NextResponse.json(
        { message: 'Unauthorized', success: false },
        { status: 401 }
      );
    }

    console.log(
      `hmm ${process.env.DISCORD_TOKEN} ${process.env.DISCORD_APP_ID}`
    );

    const allCommands = await getCommands();
    const commands = Object.values(allCommands);
    const commandsJSON = commands.map((command) => command.register.toJSON());

    console.log(`hmm ${JSON.stringify(commandsJSON)}`);

    const registerCommands = await request.put(
      `/api/applications/${process.env.DISCORD_APP_ID}/commands`,
      commandsJSON
    );

    console.log('== COMMANDS REGISTERED ===');
    console.log(registerCommands.data);
    console.log('== COMMANDS REGISTERED ===');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
