import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { authApi } from '../api/auth';

export const useAuthQuery = () => {
  const { setToken, user, setUser } = useAuth();

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      console.log('Login successful:', data);
      setToken(data.jwt);
      setUser(data.user);
    },
  });

  return {
    login: loginMutation.mutate,
    isLoading: loginMutation.isPending,
    error: loginMutation.error,
    user,
    setUser,
  };
}; 