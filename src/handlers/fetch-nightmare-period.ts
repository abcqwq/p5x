import { prisma } from '@/handlers/prisma';
import {
  type NightmareGatewayPeriod,
  NightmareGatewayPeriodSchema
} from '@/bridge-things/schemas/nightmare-gateway';

export async function fetchActiveNightmareGatewayPeriod(): Promise<NightmareGatewayPeriod | null> {
  const now = new Date();

  const period = await prisma.nightmareGatewayPeriod.findFirst({
    where: {
      start: { lte: now },
      end: { gte: now }
    },
    orderBy: { start: 'asc' }
  });

  if (!period) return null;

  const parsed = NightmareGatewayPeriodSchema.parse(period);
  return parsed;
}
