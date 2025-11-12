import { prisma } from '@/handlers/prisma';
import {
  type NightmareGatewayPeriod,
  NightmareGatewayPeriodSchema
} from '@/bridge-things/schemas/nightmare-gateway';

export async function fetchAllNightmareGatewayPeriods(): Promise<
  NightmareGatewayPeriod[]
> {
  const periods = await prisma.nightmareGatewayPeriod.findMany({
    orderBy: { end: 'desc' }
  });

  const parsed = periods.map((period) =>
    NightmareGatewayPeriodSchema.parse(period)
  );
  return parsed;
}
