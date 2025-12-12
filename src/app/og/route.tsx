import { ImageResponse } from 'next/og';
import Main from '@/app/og/Main';

export const size = {
  width: 1200,
  height: 630
};

export const contentType = 'image/png';

export async function GET() {
  return new ImageResponse(<Main />, size);
}
