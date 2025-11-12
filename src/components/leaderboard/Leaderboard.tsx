'use client';
import styled from 'styled-components';

import { useScores } from '@/react-things/providers/ScoresProvider';
import { useCompanios } from '@/react-things/providers/CompaniosProvider';
import { ScoreRow } from './ScoreRow';
import { TableHeader } from './TableHeader';

const TableContainer = styled.div`
  overflow-x: auto;
  width: 100%;
`;

const InnerContainer = styled.div`
  width: 100%;
  min-width: max-content;

  & > * {
    margin-bottom: ${6 / 16}rem;
  }

  & > *:last-child {
    margin-bottom: 0;
  }
`;

const Leaderboard = () => {
  const { scores } = useScores();
  const { selectedCompanios } = useCompanios();

  const filteredScores = scores.filter((score) =>
    selectedCompanios.includes(score.user.companio.id)
  );

  return (
    <TableContainer>
      <InnerContainer>
        <TableHeader />
        {filteredScores.map((score, index) => (
          <ScoreRow key={score.id} score={score} rank={index + 1} />
        ))}
      </InnerContainer>
    </TableContainer>
  );
};

export default Leaderboard;
