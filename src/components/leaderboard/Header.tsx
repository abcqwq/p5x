'use client';
import styled from 'styled-components';
import { corben } from '@/react-things/fonts';

const Container = styled.h1``;

const Header = () => {
  return (
    <Container className={corben.className}>
      Nightmare's Gateway Tracker
    </Container>
  );
};

export default Header;
