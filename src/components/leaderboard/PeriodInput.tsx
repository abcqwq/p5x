'use client';
import styled from 'styled-components';
import Dropdown from '@/components/Dropdown';

import { usePeriods } from '@/react-things/providers/PeriodsProvider';

const Container = styled.section`
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  gap: ${16 / 16}rem;
`;

const CompanioInput = () => {
  const { periods, selectedPeriodId, setSelectedPeriodId } = usePeriods();

  return (
    <Container>
      <Dropdown
        id="period-select"
        label="Period"
        items={periods.map((period) => ({
          id: period.id,
          value: `${period.first_half_boss_name} & ${period.second_half_boss_name}`
        }))}
        selectedItemId={selectedPeriodId}
        onUpdate={setSelectedPeriodId}
      />
    </Container>
  );
};

export default CompanioInput;
