import { prisma } from './prisma';
import {
  type NightmareGatewayPeriodWithScores,
  NightmareGatewayPeriodSchema
} from '@/schemas/nightmare-gateway';

export async function fetchNightmareGatewayData(): Promise<NightmareGatewayPeriodWithScores | null> {
  const latestPeriod = await prisma.nightmareGatewayPeriod.findFirst({
    orderBy: { end: 'desc' }
  });

  if (!latestPeriod) return null;

  const parsed = NightmareGatewayPeriodSchema.parse(latestPeriod);
  return parsed;
}
