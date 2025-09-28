import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api';

// Query keys
export const agentKeys = {
  all: ['agents'],
  lists: () => [...agentKeys.all, 'list'],
  list: (filters) => [...agentKeys.lists(), { filters }],
  details: () => [...agentKeys.all, 'detail'],
  detail: (id) => [...agentKeys.details(), id],
};

// Get all agents
export function useAgents() {
  return useQuery({
    queryKey: agentKeys.lists(),
    queryFn: () => apiClient.getAgents(),
    // Убираем refetchInterval для быстрой загрузки
    // Автообновление можно добавить позже при необходимости
  });
}

// Get single agent
export function useAgent(id) {
  return useQuery({
    queryKey: agentKeys.detail(id),
    queryFn: () => apiClient.getAgent(id),
    enabled: !!id,
  });
}

// Create agent
export function useCreateAgent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (agentData) => apiClient.createAgent(agentData),
    onSuccess: () => {
      // Invalidate and refetch agents list
      queryClient.invalidateQueries({ queryKey: agentKeys.lists() });
    },
    onError: (error) => {
      console.error('Failed to create agent:', error);
    },
  });
}

// Update agent
export function useUpdateAgent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => apiClient.updateAgent(id, data),
    onSuccess: (data, variables) => {
      // Update the specific agent in cache
      queryClient.setQueryData(agentKeys.detail(variables.id), data);
      // Invalidate agents list
      queryClient.invalidateQueries({ queryKey: agentKeys.lists() });
    },
    onError: (error) => {
      console.error('Failed to update agent:', error);
    },
  });
}

// Delete agent
export function useDeleteAgent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => apiClient.deleteAgent(id),
    onSuccess: (data, id) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: agentKeys.detail(id) });
      // Invalidate agents list
      queryClient.invalidateQueries({ queryKey: agentKeys.lists() });
    },
    onError: (error) => {
      console.error('Failed to delete agent:', error);
    },
  });
}
