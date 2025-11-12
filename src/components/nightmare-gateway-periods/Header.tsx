'use client';
import styled from 'styled-components';
import { corben } from '@/react-things/fonts';

const Container = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${16 / 16}rem;
`;

const Title = styled.h1``;

const Subtitle = styled.p`
  color: var(--color-text-2);
`;

const Header = () => {
  return (
    <Container>
      <Title className={corben.className}>Nightmare Gateway Periods</Title>
      <Subtitle>All periods sorted by end date</Subtitle>
    </Container>
  );
};

export default Header;
