import { prisma } from './prisma';
import type { ScoreUpdate } from '@/utils/parse-score-data';

/**
 * Result of processing score updates
 */
export interface ProcessScoresResult {
  successful: Array<{
    displayName: string;
    userId: string;
    score: number;
  }>;
  multipleMatches: string[];
  noMatches: string[];
}

/**
 * Processes score updates by matching display names to users and updating their scores
 *
 * @param scoreUpdates - List of validated score updates to process
 * @param nightmareId - The nightmare gateway period ID
 * @param isFirstHalf - Whether this is for the first half (true) or second half (false)
 * @returns Results of the score update operation
 *
 * @example
 * const result = await processScoreUpdates(validScores, periodId, true);
 * // result.successful contains successfully updated scores
 * // result.multipleMatches contains display names that matched multiple users
 * // result.noMatches contains display names that matched no users
 */
export async function processScoreUpdates(
  scoreUpdates: ScoreUpdate[],
  nightmareId: string
): Promise<ProcessScoresResult> {
  const successful: ProcessScoresResult['successful'] = [];
  const multipleMatches: string[] = [];
  const noMatches: string[] = [];

  // Fetch all users from the database
  const allUsers = await prisma.user.findMany({
    select: {
      id: true,
      name: true
    }
  });

  // Process each score update
  for (const scoreUpdate of scoreUpdates) {
    const { displayName, score } = scoreUpdate;

    // Find users matching the display name (case-insensitive)
    const matchingUsers = allUsers.filter(
      (user) => user.name.toLowerCase() === displayName.toLowerCase()
    );

    if (matchingUsers.length === 0) {
      // No matching user found
      noMatches.push(displayName);
      continue;
    }

    if (matchingUsers.length > 1) {
      // Multiple users with the same display name
      multipleMatches.push(displayName);
      continue;
    }

    // Exactly one matching user - update or insert the score
    const user = matchingUsers[0];

    try {
      // Check if a score record already exists for this user and period
      const existingScore = await prisma.nightmareGatewayScore.findFirst({
        where: {
          user_id: user.id,
          nightmare_id: nightmareId
        }
      });

      if (existingScore) {
        // Update existing score
        await prisma.nightmareGatewayScore.update({
          where: {
            id: existingScore.id
          },
          data: { first_half_score: score, second_half_score: 0 }
        });
      } else {
        // Insert new score record
        await prisma.nightmareGatewayScore.create({
          data: {
            user_id: user.id,
            nightmare_id: nightmareId,
            first_half_score: score,
            second_half_score: 0
          }
        });
      }

      successful.push({
        displayName,
        userId: user.id,
        score
      });
    } catch (error) {
      console.error(`Error updating score for ${displayName}:`, error);
      // Treat database errors as failed matches
      noMatches.push(displayName);
    }
  }

  return {
    successful,
    multipleMatches,
    noMatches
  };
}
