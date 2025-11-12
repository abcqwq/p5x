'use client';
import styled from 'styled-components';
import { usePeriods } from '@/react-things/providers/PeriodsProvider';

const Container = styled.div`
  background-color: var(--color-bg-2);
  border-radius: ${8 / 16}rem;
  padding: ${24 / 16}rem;
`;

const Pre = styled.pre`
  font-size: ${14 / 16}rem;
  overflow: auto;
  white-space: pre-wrap;
  word-wrap: break-word;
`;

const Body = () => {
  const { periods } = usePeriods();

  return (
    <Container>
      <Pre>{JSON.stringify(periods, null, 2)}</Pre>
    </Container>
  );
};

export default Body;
