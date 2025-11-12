'use client';
import styled from 'styled-components';
import Period from '@/components/nightmare-gateway-periods/Period';

import { usePeriods } from '@/react-things/providers/PeriodsProvider';

const Container = styled.div`
  border-radius: ${8 / 16}rem;
  padding: ${24 / 16}rem 0;

  display: flex;
  flex-direction: column;
  gap: ${16 / 16}rem;
`;

const Body = () => {
  const { periods } = usePeriods();

  return (
    <Container>
      {periods.map((period, index) => (
        <Period key={period.id} period={period} periodIndex={index} />
      ))}
    </Container>
  );
};

export default Body;
