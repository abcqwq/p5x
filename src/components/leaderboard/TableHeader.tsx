'use client';
import styled from 'styled-components';

const Row = styled.div`
  padding: ${8 / 16}rem ${16 / 16}rem;
  display: flex;
  justify-content: space-between;
  align-items: center;

  & > * {
    flex: 1;
    flex-shrink: 0;
    flex-basis: ${180 / 16}rem;
  }

  & > *:nth-child(1),
  & > *:nth-child(4) {
    flex-basis: ${64 / 16}rem;
  }

  flex-wrap: nowrap;
`;

const Cell = styled.div`
  justify-content: flex-start;
`;

export const TableHeader = () => {
  return (
    <Row>
      <Cell>Rank</Cell>
      <Cell>Name</Cell>
      <Cell>Score</Cell>
      <Cell>Companio</Cell>
    </Row>
  );
};
