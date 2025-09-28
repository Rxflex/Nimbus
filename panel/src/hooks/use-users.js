import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

const USERS_QUERY_KEY = ['users'];

export function useUsers() {
  return useQuery({
    queryKey: USERS_QUERY_KEY,
    queryFn: async () => {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');
      return api.get('/auth/users', token);
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newUserData) => {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');
      return api.post('/auth/users', newUserData, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }) => {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');
      return api.put(`/auth/users/${id}`, data, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');
      return api.delete(`/auth/users/${id}`, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY });
    },
  });
}