import useSWR from 'swr';
import { UsersResponse } from '../../../interfaces/user';
import { getUsers } from '../../../api/users';

export const useUserBook = () => {
  const { data, error, isLoading, mutate } = useSWR<UsersResponse>(
    'users',
    getUsers.all
  );

  return {
    data,
    error,
    isLoading,
    mutate,
  };
}; 