import { NextResponse } from 'next/server';

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
