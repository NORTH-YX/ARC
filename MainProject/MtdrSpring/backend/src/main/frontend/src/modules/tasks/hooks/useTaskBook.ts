import useSWR from 'swr';
import { TasksResponse } from '../../../interfaces/task';
import { getTasks } from '../../../api/tasks';
import { useAuth } from '../../../contexts/AuthContext';

export const useTaskBook = () => {
  const { token } = useAuth();
  const { data, error, isLoading, mutate } = useSWR<TasksResponse>(
    token ? 'tasks' : null,
    () => getTasks.all(),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: false,
      dedupingInterval: 5000,
    }
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
}; 