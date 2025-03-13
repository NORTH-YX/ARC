import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { authApi } from '../api/auth';

export const useAuthQuery = () => {
  const { setToken, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setToken(data.token);
      queryClient.setQueryData(['user'], data.user);
    },
  });

  const userQuery = useQuery({
    queryKey: ['user'],
    queryFn: authApi.getCurrentUser,
    enabled: isAuthenticated,
  });

  return {
    login: loginMutation.mutate,
    isLoading: loginMutation.isPending,
    error: loginMutation.error,
    user: userQuery.data,
    isUserLoading: userQuery.isLoading,
    userError: userQuery.error,
  };
}; 