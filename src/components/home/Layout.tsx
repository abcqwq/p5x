'use client';
import styled from 'styled-components';
import { BREAKPOINTS } from '@/consts/BREAKPOINTS';

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
  width: ${BREAKPOINTS.tablet}px;
  margin-block-start: ${48 / 16}rem;

  display: flex;
  flex-direction: column;
  gap: ${32 / 16}rem;
`;

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <OuterContainer>
      <Container>{children}</Container>
    </OuterContainer>
  );
};

export default Layout;
