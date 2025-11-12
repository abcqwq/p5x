'use client';
import styled from 'styled-components';
import Period from '@/components/nightmare-gateway-periods/Period';

import { usePeriods } from '@/react-things/providers/PeriodsProvider';

const Container = styled.div`
  border-radius: ${8 / 16}rem;
  padding: ${24 / 16}rem 0;
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
