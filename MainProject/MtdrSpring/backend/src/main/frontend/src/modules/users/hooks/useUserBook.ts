import useSWR from 'swr';
import { User } from '../../../interfaces/user';
import { getUsers } from '../../../api/users';

export const useUserBook = () => {
  const { data, error, isLoading, mutate } = useSWR<User[]>(
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