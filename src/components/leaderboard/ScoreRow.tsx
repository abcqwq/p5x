'use client';
import styled from 'styled-components';

import { formatNumber } from '@/react-things/utils/number';
import { useMinimumScores } from '@/react-things/providers/MinimumScoresProvider';
import type { NightmareGatewayScore } from '@/bridge-things/schemas/nightmare-gateway';
import { UserCell } from '@/components/leaderboard/UserCell';
import { CompanioCell } from '@/components/leaderboard/CompanioCell';

const Row = styled.div`
  padding: ${8 / 16}rem ${16 / 16}rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: ${8 / 16}rem;
  width: 100%;

  & > * {
    flex: 1;
    flex-shrink: 0;
    flex-basis: ${180 / 16}rem;
  }

  & > *:nth-child(1),
  & > *:nth-child(4) {
    flex-basis: ${64 / 16}rem;
  }

  flex-wrap: nowrap;
`;

const Cell = styled.div`
  justify-content: flex-start;
`;

const ScoreColumn = styled.span`
  color: var(--color);
`;

const getScoreColor = (
  passedMinimum: boolean,
  isMinimumCheckEnabled: boolean
) => {
  if (!isMinimumCheckEnabled) return 'var(--color-text-1)';
  if (passedMinimum) return 'var(--color-success)';
  return 'var(--color-danger)';
};

interface ScoreRowProps {
  score: NightmareGatewayScore;
  rank: number;
}

export const ScoreRow = ({ score, rank }: ScoreRowProps) => {
  const { getMinimumScoreForCompanio, isMinimumCheckEnabled } =
    useMinimumScores();

  const minimumScore = getMinimumScoreForCompanio(score.user.companio.id);
  const passedMinimumScore = score.first_half_score >= minimumScore;

  return (
    <Row>
      <Cell>{rank}</Cell>
      <UserCell user={score.user} />
      <Cell>
        <ScoreColumn
          style={
            {
              '--color': getScoreColor(
                passedMinimumScore,
                isMinimumCheckEnabled
              )
            } as React.CSSProperties
          }
        >
          {formatNumber(score.first_half_score)}
        </ScoreColumn>
      </Cell>
      <CompanioCell companio={score.user.companio} />
    </Row>
  );
};
