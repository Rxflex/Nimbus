import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

const GEODNS_QUERY_KEY = ['geodns'];

export function useGeoDns() {
  return useQuery({
    queryKey: GEODNS_QUERY_KEY,
    queryFn: async () => {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');
      return api.get('/admin/geodns', token);
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });
}

export function useCreateGeoDns() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newGeoDnsData) => {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');
      return api.post('/admin/geodns', newGeoDnsData, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GEODNS_QUERY_KEY });
    },
  });
}

export function useUpdateGeoDns() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }) => {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');
      return api.put(`/admin/geodns/${id}`, data, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GEODNS_QUERY_KEY });
    },
  });
}

export function useDeleteGeoDns() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');
      return api.delete(`/admin/geodns/${id}`, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GEODNS_QUERY_KEY });
    },
  });
}