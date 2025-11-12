'use client';
import styled from 'styled-components';
import { corben } from '@/react-things/fonts';

const Container = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${16 / 16}rem;
`;

const Title = styled.h1``;

const Header = () => {
  return (
    <Container>
      <Title className={corben.className}>Nightmare Gateways</Title>
    </Container>
  );
};

export default Header;
