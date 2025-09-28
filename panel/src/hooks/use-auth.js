import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials) => apiClient.login(credentials),
    onSuccess: (data, variables) => {
      // Store token and user data
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify({ username: variables.username }));
      
      // Invalidate and refetch user-related queries
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: (error) => {
      console.error('Login failed:', error);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    onSuccess: () => {
      // Clear all cached data
      queryClient.clear();
    },
  });
}
