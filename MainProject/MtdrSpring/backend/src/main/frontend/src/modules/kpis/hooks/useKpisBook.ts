import useSWR from 'swr';
import { KpisResponse } from '../domain/types';
import { useAuth } from '../../../contexts/AuthContext';
import { getTasks } from '../../../api/tasks';

export const useKpisBook = () => {
  const { token } = useAuth();
  const { data, error, isLoading, mutate } = useSWR<KpisResponse>(
    token ? '/api/kpis' : null,
    () => getTasks.kpis(),
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