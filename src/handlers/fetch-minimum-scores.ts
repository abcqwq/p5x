import { prisma } from '@/handlers/prisma';
import {
  type CompanioPeriodMinimumScores,
  CompanioPeriodMinimumScoreSchema
} from '@/bridge-things/schemas/nightmare-gateway';

export async function fetchMinimumScores(
  periodId: string
): Promise<CompanioPeriodMinimumScores | null> {
  const minimumScores = await prisma.companioPeriodMinimumScore.findMany({
    where: {
      nightmare_period_id: periodId
    },
    include: {
      companio: true
    }
  });

  if (!minimumScores) return null;

  const parsed = CompanioPeriodMinimumScoreSchema.array().parse(minimumScores);
  return parsed;
}
