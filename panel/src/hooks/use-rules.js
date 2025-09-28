import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

const RULES_QUERY_KEY = ['rules'];

export function useRules() {
  return useQuery({
    queryKey: RULES_QUERY_KEY,
    queryFn: async () => {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');
      return api.get('/admin/rules', token);
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });
}

export function useCreateRule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newRuleData) => {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');
      return api.post('/admin/rules', newRuleData, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RULES_QUERY_KEY });
    },
  });
}

export function useUpdateRule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }) => {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');
      return api.put(`/admin/rules/${id}`, data, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RULES_QUERY_KEY });
    },
  });
}

export function useDeleteRule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');
      return api.delete(`/admin/rules/${id}`, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RULES_QUERY_KEY });
    },
  });
}