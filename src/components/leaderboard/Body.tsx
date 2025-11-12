'use client';
import styled from 'styled-components';
import CompanioInput from '@/components/leaderboard/CompanioInput';
import GeneralInput from '@/components/leaderboard/GeneralInput';
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

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${8 / 16}rem;
`;

const Body = () => {
  return (
    <Container>
      <InputWrapper>
        <CompanioInput />
        <GeneralInput />
      </InputWrapper>
      <Help />
      <Leaderboard />
    </Container>
  );
};

export default Body;
