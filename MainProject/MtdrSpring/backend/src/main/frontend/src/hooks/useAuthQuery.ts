import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { authApi } from '../api/auth';
import { User } from '../interfaces/user';

export const useAuthQuery = () => {
  const { token, setToken } = useAuth();
  const queryClient = useQueryClient();

  // Initialize user data from localStorage if available
  const storedUser = token ? JSON.parse(localStorage.getItem('user') || 'null') : null;
  if (storedUser && !queryClient.getQueryData(['user'])) {
    queryClient.setQueryData(['user'], storedUser);
  }

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setToken(data.jwt);
      // Store user data in both React Query and localStorage
      queryClient.setQueryData(['user'], data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
    },
  });

  return {
    login: loginMutation.mutate,
    isLoading: loginMutation.isPending,
    error: loginMutation.error,
    user: queryClient.getQueryData(['user']) as User | undefined,
  };
}; 