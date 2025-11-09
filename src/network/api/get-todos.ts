import client from '@/network/http-client/todo-client';

import { queryOptions } from '@tanstack/react-query';
import { type Todo, TodosSchema } from '@/network/schemas/todo';

const query = async (): Promise<Todo[]> => {
  const res = await client.get('/todos');

  const parsed = TodosSchema.safeParse(res.data);
  if (!parsed.success) {
    throw new Error(`Invalid todos response: ${parsed.error.message}`);
  }

  return parsed.data;
};

export const getTodosQueryOption = () => {
  return queryOptions({
    queryKey: ['todos'],
    queryFn: query
  });
};
