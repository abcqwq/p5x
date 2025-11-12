import { z } from 'zod';
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

export async function fetchNightmareGatewayPeriodById(
  id: string
): Promise<NightmareGatewayPeriod | null> {
  const result = z.uuid().safeParse(id);
  if (!result.success) {
    return null;
  }

  const period = await prisma.nightmareGatewayPeriod.findUnique({
    where: { id }
  });

  if (!period) return null;

  const parsed = NightmareGatewayPeriodSchema.parse(period);
  return parsed;
}
