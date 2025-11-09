'use client';
import styled from 'styled-components';

const Container = styled.div`
  border-radius: ${8 / 16}rem;

  box-shadow: var(--shadow);
  background-color: var(--color);
`;

const shadowMapper = {
  small: 'var(--shadow-s)',
  medium: 'var(--shadow-m)',
  large: 'var(--shadow-l)'
};

const colorMapper = {
  '1': 'var(--color-bg-1)',
  '2': 'var(--color-bg-2)',
  '3': 'var(--color-bg-3)'
};

const paddingMapper = {
  'p-small': `${8 / 16}rem ${8 / 16}rem`,
  'p-medium': `${12 / 16}rem ${12 / 16}rem`,
  'p-large': `${16 / 16}rem ${16 / 16}rem`,

  small: `${8 / 16}rem ${12 / 16}rem`,
  medium: `${12 / 16}rem ${16 / 16}rem`,
  large: `${16 / 16}rem ${20 / 16}rem`
};

type CardProps = {
  children: React.ReactNode;
  padding?: 'p-small' | 'p-medium' | 'p-large' | 'small' | 'medium' | 'large';
  shadow?: 'small' | 'medium' | 'large';
  color?: '1' | '2' | '3';
};

const Card = ({
  children,
  shadow = 'small',
  color = '2',
  padding = 'p-medium'
}: CardProps) => {
  return (
    <Container
      style={
        {
          '--shadow': shadowMapper[shadow],
          '--color': colorMapper[color],
          padding: paddingMapper[padding]
        } as React.CSSProperties
      }
    >
      {children}
    </Container>
  );
};

export default Card;
