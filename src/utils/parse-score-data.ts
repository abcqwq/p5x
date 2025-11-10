/**
 * Represents a validated score update entry
 */
export interface ScoreUpdate {
  displayName: string;
  score: number;
}

/**
 * Result of parsing extracted text data
 */
export interface ParseScoreDataResult {
  validScores: ScoreUpdate[];
  duplicateDisplayNames: string[];
  invalidEntries: string[];
}

/**
 * Parses extracted text from images into validated score updates
 *
 * @param extractedText - Raw text extracted from image (CSV format: displayName,score)
 * @returns Parsed and validated score data with duplicates and invalid entries separated
 *
 * @example
 * const result = parseScoreData("Akira Kazama,318003948\nMr MJ,247650292");
 * // result.validScores = [{ displayName: "Akira Kazama", score: 318003948 }, ...]
 */
export function parseScoreData(extractedText: string): ParseScoreDataResult {
  const validScores: ScoreUpdate[] = [];
  const invalidEntries: string[] = [];
  const displayNameCounts = new Map<string, number>();
  const displayNameScores = new Map<string, ScoreUpdate>();

  // Split by newlines and process each line
  const lines = extractedText
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  for (const line of lines) {
    // Split by comma
    const parts = line.split(',').map((part) => part.trim());

    // Validate line format
    if (parts.length !== 2) {
      invalidEntries.push(line);
      continue;
    }

    const [displayName, scoreStr] = parts;

    // Validate display name (not empty)
    if (!displayName) {
      invalidEntries.push(line);
      continue;
    }

    // Validate score (must be a valid number)
    const score = Number(scoreStr);
    if (!Number.isFinite(score) || score < 0) {
      invalidEntries.push(line);
      continue;
    }

    // Track display name occurrences
    const currentCount = displayNameCounts.get(displayName) || 0;
    displayNameCounts.set(displayName, currentCount + 1);

    // Store the score update (will be filtered later if duplicate)
    displayNameScores.set(displayName, { displayName, score });
  }

  // Separate duplicates from valid entries
  const duplicateDisplayNames: string[] = [];

  for (const [displayName, count] of displayNameCounts.entries()) {
    if (count > 1) {
      duplicateDisplayNames.push(displayName);
    } else {
      const scoreUpdate = displayNameScores.get(displayName);
      if (scoreUpdate) {
        validScores.push(scoreUpdate);
      }
    }
  }

  return {
    validScores,
    duplicateDisplayNames,
    invalidEntries
  };
}
