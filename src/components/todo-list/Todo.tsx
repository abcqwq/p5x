'use client';
import styled from 'styled-components';
import type { Todo as Entity } from '@/network/schemas/todo';

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${16 / 16}rem;

  padding-block: ${8 / 16}rem;
  padding-inline: ${12 / 16}rem;
  border: 2px solid black;
`;

const Todo = ({ data }: { data: Entity }) => {
  return (
    <Container>
      <p>{data.title}</p>
      <p>{data.completed ? '✅' : '🟡'}</p>
    </Container>
  );
};

export default Todo;
