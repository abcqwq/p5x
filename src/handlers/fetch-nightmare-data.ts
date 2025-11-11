import { prisma } from '@/handlers/prisma';
import {
  type NightmareGatewayPeriods,
  type NightmareGatewayScores,
  type Companios,
  NightmareGatewayPeriodSchema,
  NightmareGatewayScoreSchema,
  CompanioSchema
} from '@/bridge-things/schemas/nightmare-gateway';

export async function fetchNightmareGatewayPeriod(): Promise<NightmareGatewayPeriods | null> {
  const periods = await prisma.nightmareGatewayPeriod.findMany({
    orderBy: { end: 'desc' }
  });

  if (!periods) return null;

  const parsed = NightmareGatewayPeriodSchema.array().parse(periods);
  return parsed;
}

export async function fetchNightmareGatewayScores(): Promise<NightmareGatewayScores | null> {
  const scores = await prisma.nightmareGatewayScore.findMany({
    orderBy: { first_half_score: 'desc' },
    include: {
      user: {
        include: {
          companio: true
        }
      }
    }
  });

  if (!scores) return null;

  const parsed = NightmareGatewayScoreSchema.array().parse(scores);
  return parsed;
}

export async function fetchCompanios(): Promise<Companios | null> {
  const companios = await prisma.companio.findMany({});

  if (!companios) return null;

  const parsed = CompanioSchema.array().parse(companios);
  return parsed;
}
