'use client';
import styled from 'styled-components';
import Dropdown from '@/components/Dropdown';

import { usePeriod } from '@/react-things/providers/PeriodProvider';

const Container = styled.section`
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  gap: ${16 / 16}rem;
`;

const CompanioInput = () => {
  const { period } = usePeriod();
  if (!period) return null;

  return (
    <Container>
      <Dropdown
        id="period-select"
        label="Period"
        items={[
          {
            id: period.id,
            value: `${period.first_half_boss_name} & ${period.second_half_boss_name}`
          }
        ]}
        selectedItemId={period.id}
        onUpdate={() => {}}
      />
    </Container>
  );
};

export default CompanioInput;
