import { z } from 'zod';
import { prisma } from '@/handlers/prisma';
import {
  type NightmareGatewayPeriod,
  NightmareGatewayPeriodSchema
} from '@/bridge-things/schemas/nightmare-gateway';

export async function fetchActiveNightmareGatewayPeriod(): Promise<NightmareGatewayPeriod | null> {
  const period = await prisma.nightmareGatewayPeriod.findFirst({
    where: {
      is_frozen: false
    },
    orderBy: { number: 'asc' }
  });

  if (!period) return null;

  console.log('Fetched active period:', period);

  if (period.start > new Date()) {
    return null;
  }

  if (period.end < new Date()) {
    return null;
  }

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

export async function fetchNightmareGatewayPeriodByNumber(
  periodNumber: string
): Promise<NightmareGatewayPeriod | null> {
  const numberResult = z.coerce
    .number()
    .int()
    .positive()
    .safeParse(periodNumber);
  if (!numberResult.success) {
    return null;
  }

  const period = await prisma.nightmareGatewayPeriod.findUnique({
    where: { number: numberResult.data }
  });

  if (!period) return null;

  const parsed = NightmareGatewayPeriodSchema.parse(period);
  return parsed;
}
