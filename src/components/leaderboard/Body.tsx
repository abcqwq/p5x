'use client';
import styled from 'styled-components';
import CompanioInput from '@/components/leaderboard/CompanioInput';
import Leaderboard from '@/components/leaderboard/Leaderboard';
import Help from '@/components/leaderboard/Help';

const Container = styled.section`
  & > * {
    margin-bottom: ${16 / 16}rem;
  }

  & > *:last-child {
    margin-bottom: 0;
  }
`;

const Body = () => {
  return (
    <Container>
      <CompanioInput />

      <Help />
      <Leaderboard />
    </Container>
  );
};

export default Body;
