'use client';
import styled from 'styled-components';

const AVATAR_SIZES = {
  'super-small': `${24 / 16}rem`,
  small: `${36 / 16}rem`,
  medium: `${48 / 16}rem`,
  large: `${64 / 16}rem`,
  'extra-large': `${80 / 16}rem`
};

const Container = styled.div`
  height: var(--size);
  width: var(--size);

  border-radius: 50%;
  overflow: hidden;
`;

const Img = styled.img`
  display: block;
`;

type AvatarProps = {
  src: string;
  size?: 'extra-large' | 'large' | 'medium' | 'small' | 'super-small';
  alt?: string;
};

const Avatar = ({ src, size = 'medium', alt }: AvatarProps) => {
  return (
    <Container
      style={
        {
          '--size': AVATAR_SIZES[size]
        } as React.CSSProperties
      }
    >
      <Img src={src} alt={alt} />
    </Container>
  );
};

export default Avatar;
