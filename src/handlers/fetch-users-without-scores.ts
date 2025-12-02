import { prisma } from '@/handlers/prisma';
import type { User } from '@/bridge-things/schemas/nightmare-gateway';

export async function fetchUsersWithoutScores(
  periodId: string
): Promise<User[]> {
  const usersWithoutScores = await prisma.user.findMany({
    where: {
      OR: [
        {
          nightmare_gateway_scores: {
            none: {
              nightmare_id: periodId
            }
          }
        },
        {
          nightmare_gateway_scores: {
            every: {
              nightmare_id: periodId,
              first_half_score: 0
            }
          }
        }
      ]
    },
    include: {
      companio: true
    }
  });

  if (!usersWithoutScores) {
    return [];
  }

  return usersWithoutScores;
}
