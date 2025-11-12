'use client';
import styled from 'styled-components';
import Card from '@/components/Card';
import Countdown from '@/components/Countdown';
import Link from '@/components/Link';

import { formatDate } from '@/react-things/utils/date';
import type { NightmareGatewayPeriod } from '@/bridge-things/schemas/nightmare-gateway';

const Container = styled.div`
  & > * {
    display: flex;
    flex-wrap: wrap;
    gap: ${16 / 16}rem;
  }
`;

const InfoContainer = styled.div`
  flex-grow: 1;
`;

const InfoFooterContainer = styled.div`
  display: flex;
  gap: ${8 / 16}rem;
  flex-wrap: wrap;

  & > *:last-child {
    margin-left: auto;
  }
`;

const AvatarsContainer = styled.div`
  display: grid;
  isolation: isolate;
  width: max-content;

  & > * {
    grid-area: 1 / 1;
  }

  & > *:first-child {
    transform: translateX(${-12 / 16}rem) translateY(${-12 / 16}rem);
  }

  & > *:last-child {
    transform: translateX(${12 / 16}rem) translateY(${12 / 16}rem);
  }

  padding: ${14 / 16}rem;
`;

const Img = styled.img`
  display: block;
  height: ${48 / 16}rem;
  width: ${48 / 16}rem;
  border-radius: 50%;
`;

type PeriodProps = {
  period: NightmareGatewayPeriod;
  periodIndex: number;
};

const Period = ({ period }: PeriodProps) => {
  return (
    <Container>
      <Card padding="large">
        <AvatarsContainer>
          {period.first_half_boss_avatar_url && (
            <Img
              src={period.first_half_boss_avatar_url}
              alt={period.first_half_boss_name}
            />
          )}
          {period.second_half_boss_avatar_url && (
            <Img
              src={period.second_half_boss_avatar_url}
              alt={period.second_half_boss_name}
            />
          )}
        </AvatarsContainer>

        <InfoContainer>
          <p>
            {period.first_half_boss_name} ({period.first_half_boss_type}) &{' '}
            {period.second_half_boss_name} ({period.second_half_boss_type})
          </p>
          <p>
            {formatDate(period.start)} {' - '}
            {formatDate(period.end)}
          </p>
          <InfoFooterContainer>
            <p>
              <Countdown
                endTime={new Date(period.end)}
                startTime={new Date(period.start)}
                ongoingCopy=" hours remaining"
              />
            </p>
            <Link href={`/nightmare-gateway/${period.number}`}>
              scores data
            </Link>
          </InfoFooterContainer>
        </InfoContainer>
      </Card>
    </Container>
  );
};

export default Period;
