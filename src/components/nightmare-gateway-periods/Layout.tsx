'use client';
import styled from 'styled-components';
import { BREAKPOINTS } from '@/react-things/consts/BREAKPOINTS';

const OuterContainer = styled.div`
  min-height: 100vh;
  min-height: 100dvh;

  background-color: var(--color-bg-1);
  color: var(--color-text-1);

  display: flex;
  justify-content: center;
  padding: ${16 / 16}rem;
`;

const Container = styled.div`
  width: min(${BREAKPOINTS.tablet}px, 100%);
  margin-block-start: ${48 / 16}rem;
  margin-block-end: ${48 / 16}rem;
`;

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <OuterContainer>
      <Container>{children}</Container>
    </OuterContainer>
  );
};

export default Layout;
