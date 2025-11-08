'use client';
import styled from 'styled-components';
import Card from '@/components/Card';

import { useScores } from '@/providers/ScoresProvider';

const Container = styled.section``;

const Body = () => {
  const { scores } = useScores();

  return (
    <Container>
      {scores.map((score, index) => (
        <Card key={score.id}>
          {index + 1} {score.user.name} - {score.user.companio.name}:{' '}
          {score.first_half_score + score.second_half_score}
        </Card>
      ))}
    </Container>
  );
};

export default Body;
