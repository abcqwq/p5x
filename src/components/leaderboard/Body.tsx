'use client';
import styled from 'styled-components';
import CompanioInput from '@/components/leaderboard/CompanioInput';

const Container = styled.section`
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  gap: ${16 / 16}rem;
`;

const Body = () => {
  return (
    <Container>
      <CompanioInput />
    </Container>
  );
};

export default Body;
