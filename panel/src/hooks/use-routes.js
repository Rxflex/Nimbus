import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

const ROUTES_QUERY_KEY = ['routes'];

export function useRoutes() {
  return useQuery({
    queryKey: ROUTES_QUERY_KEY,
    queryFn: async () => {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');
      return api.get('/admin/routes', token);
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });
}

export function useCreateRoute() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newRouteData) => {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');
      return api.post('/admin/routes', newRouteData, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ROUTES_QUERY_KEY });
    },
  });
}

export function useUpdateRoute() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }) => {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');
      return api.put(`/admin/routes/${id}`, data, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ROUTES_QUERY_KEY });
    },
  });
}

export function useDeleteRoute() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');
      return api.delete(`/admin/routes/${id}`, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ROUTES_QUERY_KEY });
    },
  });
}