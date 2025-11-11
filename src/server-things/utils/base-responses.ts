import { NextResponse } from 'next/server';
import { InteractionResponseType } from 'discord-api-types/v10';

export const unauthorized = () => {
  return NextResponse.json(
    { message: 'Unauthorized', success: false },
    { status: 401 }
  );
};

export const success = () => {
  return NextResponse.json({ success: true });
};

export const internalServerError = () => {
  return NextResponse.json(
    { message: 'Internal Server Error', success: false },
    { status: 500 }
  );
};

export const pong = () => {
  return NextResponse.json({ type: InteractionResponseType.Pong });
};
