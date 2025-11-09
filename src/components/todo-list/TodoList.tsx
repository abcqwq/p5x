'use client';
import styled from 'styled-components';
import Todo from '@/components/todo-list/Todo';

import { useQuery } from '@tanstack/react-query';
import { getTodosQueryOption } from '@/network/api/get-todos';

const Layout = styled.div`
  padding-block: ${16 / 16}rem;
  padding-inline: ${12 / 16}rem;

  overflow-y: auto;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${12 / 16}rem;
`;

const TodosContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${8 / 16}rem;

  max-height: ${425 / 16}rem;
  overflow-y: auto;
`;

const TodoList = () => {
  const {
    data: todos,
    isSuccess,
    isError,
    isLoading
  } = useQuery(getTodosQueryOption());

  return (
    <Layout>
      <h1>todo list</h1>

      {isSuccess && (
        <TodosContainer>
          {todos?.map((todo) => (
            <Todo key={todo.id} data={todo} />
          ))}
        </TodosContainer>
      )}

      {isLoading && <p>fething your data...</p>}

      {isError && <p>something wen't wrong :(</p>}
    </Layout>
  );
};

export default TodoList;
