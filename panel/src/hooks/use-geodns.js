import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';

const GEODNS_QUERY_KEY = ['geodns'];

export function useGeoDns() {
  return useQuery({
    queryKey: GEODNS_QUERY_KEY,
    queryFn: () => apiClient.getGeoDns(),
    refetchInterval: 30000, // Refresh every 30 seconds
  });
}

export function useCreateGeoDns() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (newGeoDnsData) => apiClient.createGeoDns(newGeoDnsData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GEODNS_QUERY_KEY });
    },
  });
}

export function useUpdateGeoDns() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => apiClient.updateGeoDns(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GEODNS_QUERY_KEY });
    },
  });
}

export function useDeleteGeoDns() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => apiClient.deleteGeoDns(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: GEODNS_QUERY_KEY });
    },
  });
}