'use client';
import styled from 'styled-components';
import React from 'react';
import Countdown from '@/components/Countdown';
import ProfileCard from '@/components/ProfileCard';
import Link from '@/components/Link';

import { corben } from '@/react-things/fonts';
import { usePeriod } from '@/react-things/providers/PeriodProvider';
import { formatDate } from '@/react-things/utils/date';

const Container = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${16 / 16}rem;
`;

const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${8 / 16}rem;

  flex-wrap: wrap;
`;

const Title = styled.h1``;

const PeriodSection = styled.section`
  & > *:last-child {
    margin-top: ${8 / 16}rem;
  }
`;

const PeriodTitle = styled.h2`
  color: var(--color-text-2);
`;

const BossContainer = styled.div`
  display: flex;
  gap: ${16 / 16}rem;
  flex-wrap: wrap;
`;

const Header = () => {
  const { period } = usePeriod();

  const endDate = React.useMemo(
    () => (period?.end ? new Date(period.end) : new Date()),
    [period?.end]
  );

  const startDate = React.useMemo(
    () => (period?.start ? new Date(period.start) : new Date()),
    [period?.start]
  );

  return (
    <Container>
      <TitleContainer>
        <Title className={corben.className}>Nightmare's Gateway Tracker</Title>
        <Link href="/nightmare-gateway-periods">view all periods</Link>
      </TitleContainer>

      <PeriodSection>
        <PeriodTitle className={corben.className}>Period Details</PeriodTitle>
        <p>
          {formatDate(period?.start || new Date())} -{' '}
          {formatDate(period?.end || new Date())} (
          <Countdown
            endTime={endDate}
            startTime={startDate}
            ongoingCopy=" hours remaining"
          />
          )
        </p>

        <BossContainer>
          <ProfileCard
            name={period?.first_half_boss_name || 'N/A'}
            avatarUrl={period?.first_half_boss_avatar_url || ''}
          />
          <ProfileCard
            name={period?.second_half_boss_name || 'N/A'}
            avatarUrl={period?.second_half_boss_avatar_url || ''}
          />
        </BossContainer>
      </PeriodSection>
    </Container>
  );
};

export default Header;
