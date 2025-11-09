'use client';
import styled from 'styled-components';
import CompanioInput from '@/components/leaderboard/CompanioInput';
import Leaderboard from '@/components/leaderboard/Leaderboard';
import Help from '@/components/leaderboard/Help';

import { usePeriods } from '@/providers/PeriodsProvider';
import { corben } from '@/fonts';
import { formatDate } from '@/utils/date';

const Container = styled.section`
  & > * {
    margin-bottom: ${16 / 16}rem;
  }

  & > *:last-child {
    margin-bottom: 0;
  }
`;

const PeriodSection = styled.section``;

const PeriodTitle = styled.h2`
  color: var(--color-text-2);
`;

const Body = () => {
  const { getSelectedDetail } = usePeriods();
  const period = getSelectedDetail();

  return (
    <Container>
      <PeriodSection>
        <PeriodTitle className={corben.className}>Period Details</PeriodTitle>
        <p>
          {formatDate(period?.start || new Date())} -{' '}
          {formatDate(period?.end || new Date())}
        </p>

        <p>{period?.first_half_boss_name || 'N/A'}</p>
        <p>{period?.second_half_boss_name || 'N/A'}</p>
      </PeriodSection>

      <CompanioInput />

      <Help />
      <Leaderboard />
    </Container>
  );
};

export default Body;
