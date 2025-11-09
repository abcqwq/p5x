'use client';
import styled from 'styled-components';

import { useScores } from '@/providers/ScoresProvider';
import { useCompanios } from '@/providers/CompaniosProvider';
import { formatNumber } from '@/utils/number';
import type { NightmareGatewayScore } from '@/schemas/nightmare-gateway';

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

const Row = styled.div`
  padding: ${8 / 16}rem ${16 / 16}rem;
  display: flex;
  justify-content: space-between;
  align-items: center;

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

const ScoreRow = styled(Row)`
  border-radius: ${8 / 16}rem;
  width: 100%;
`;

const Cell = styled.div`
  justify-content: flex-start;
`;

const Img = styled.img`
  height: ${32 / 16}rem;
  border-radius: 50%;
`;

const CompanioImg = styled.img`
  height: ${32 / 16}rem;
`;

const CompanioInnerWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${8 / 16}rem;
`;

const UserInnerWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${8 / 16}rem;
`;

const Score = (score: NightmareGatewayScore, rank: number) => {
  return (
    <ScoreRow key={score.id}>
      <Cell>{rank}</Cell>
      <Cell>
        <UserInnerWrapper>
          {score.user.avatar_url && (
            <Img src={score.user.avatar_url} alt={score.user.name} />
          )}
          {score.user.name}
        </UserInnerWrapper>
      </Cell>
      <Cell>
        {formatNumber(score.first_half_score + score.second_half_score)}
      </Cell>
      <Cell>
        <CompanioInnerWrapper>
          <CompanioImg
            src={score.user.companio.logo_url}
            alt={score.user.companio.name}
          />
          {score.user.companio.name}
        </CompanioInnerWrapper>
      </Cell>
    </ScoreRow>
  );
};

const Leaderboard = () => {
  const { scores } = useScores();
  const { selectedCompanios } = useCompanios();

  return (
    <TableContainer>
      <InnerContainer>
        <Row>
          <Cell>Rank</Cell>
          <Cell>Name</Cell>
          <Cell>Score</Cell>
          <Cell>Companio</Cell>
        </Row>
        {scores
          .filter((score) => selectedCompanios.includes(score.user.companio.id))
          .map((score, index) => Score(score, index + 1))}
      </InnerContainer>
    </TableContainer>
  );
};

export default Leaderboard;
