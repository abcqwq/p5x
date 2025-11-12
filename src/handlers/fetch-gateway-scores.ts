import { prisma } from '@/handlers/prisma';
import {
  type NightmareGatewayScores,
  NightmareGatewayScoreSchema
} from '@/bridge-things/schemas/nightmare-gateway';

export async function fetchNightmareGatewayScores(
  periodId: string
): Promise<NightmareGatewayScores | null> {
  const scores = await prisma.nightmareGatewayScore.findMany({
    where: {
      nightmare_id: periodId
    },
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
