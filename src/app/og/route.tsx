import { ImageResponse } from 'next/og';
import Main from '@/app/og/Main';

export async function GET() {
  return new ImageResponse(<Main />, {
    width: 1200,
    height: 630
  });
}
