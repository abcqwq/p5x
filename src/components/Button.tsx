'use client';
import styled from 'styled-components';

const Container = styled.button`
  // button reset
  border: none;
  margin: 0;
  font: inherit;
  color: inherit;

  padding: ${8 / 16}rem ${12 / 16}rem;
  border-radius: ${8 / 16}rem;

  box-shadow: var(--shadow);
  background-color: var(--color);

  &:hover {
    cursor: pointer;
    background-color: var(--color-bg-4);
  }
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

type ButtonProps = {
  children: React.ReactNode;
  shadow?: 'small' | 'medium' | 'large';
  color?: '1' | '2' | '3';
  onClick?: () => void;
};

const Button = ({
  children,
  shadow = 'small',
  color = '3',
  onClick
}: ButtonProps) => {
  return (
    <Container
      style={
        {
          '--shadow': shadowMapper[shadow],
          '--color': colorMapper[color]
        } as React.CSSProperties
      }
      onClick={onClick}
    >
      {children}
    </Container>
  );
};

export default Button;
