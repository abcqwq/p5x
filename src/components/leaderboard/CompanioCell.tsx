'use client';
import styled from 'styled-components';

const Cell = styled.div`
  justify-content: flex-start;
`;

const Img = styled.img`
  height: ${32 / 16}rem;
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${8 / 16}rem;
`;

interface CompanioCellProps {
  companio: {
    name: string;
    logo_url: string;
  };
}

export const CompanioCell = ({ companio }: CompanioCellProps) => {
  return (
    <Cell>
      <Wrapper>
        <Img src={companio.logo_url} alt={companio.name} />
        {companio.name}
      </Wrapper>
    </Cell>
  );
};
