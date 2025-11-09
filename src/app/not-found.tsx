'use client';
import styled from 'styled-components';
import Link from '@/components/Link';

const OuterContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;

  background-color: var(--color-bg-1);
  color: var(--color-text-1);
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${16 / 16}rem;

  flex-wrap: wrap;
`;

const Img = styled.img`
  height: 240px;
`;

const NotFound = () => {
  return (
    <OuterContainer>
      <Wrapper>
        <Img src={'/assets/manaka-angry.png'} />
        <p>
          what are you trying to do? <Link href="/">go back</Link>
        </p>
      </Wrapper>
    </OuterContainer>
  );
};

export default NotFound;
