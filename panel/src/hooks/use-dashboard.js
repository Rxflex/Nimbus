import { useQuery } from '@tanstack/react-query';
import { useAgents } from './use-agents';
import { useRules } from './use-rules';
import { useRoutes } from './use-routes';
import { useGeoDns } from './use-geodns';

// Dashboard statistics
export function useDashboardStats() {
  const { data: agents = [], isLoading: agentsLoading } = useAgents();
  const { data: rules = [], isLoading: rulesLoading } = useRules();
  const { data: routes = [], isLoading: routesLoading } = useRoutes();
  const { data: geodns = [], isLoading: geodnsLoading } = useGeoDns();

  const isLoading = agentsLoading || rulesLoading || routesLoading || geodnsLoading;

  const stats = {
    agents: {
      total: agents.length,
      connected: agents.filter(a => a.status === 'connected').length,
      disconnected: agents.filter(a => a.status === 'disconnected').length,
    },
    rules: {
      total: rules.length,
      byType: rules.reduce((acc, rule) => {
        acc[rule.type] = (acc[rule.type] || 0) + 1;
        return acc;
      }, {}),
    },
    routes: {
      total: routes.length,
      byProtocol: routes.reduce((acc, route) => {
        acc[route.protocol] = (acc[route.protocol] || 0) + 1;
        return acc;
      }, {}),
    },
    geodns: {
      total: geodns.length,
      anycast: geodns.filter(g => g.anycast).length,
      byRecordType: geodns.reduce((acc, g) => {
        acc[g.recordType] = (acc[g.recordType] || 0) + 1;
        return acc;
      }, {}),
    },
  };

  return {
    data: stats,
    isLoading,
    error: null,
  };
}

// Recent activity (mock data for now)
export function useRecentActivity() {
  return useQuery({
    queryKey: ['dashboard', 'recent-activity'],
    queryFn: async () => {
      // This would typically come from an API endpoint
      return [
        {
          id: 1,
          type: 'agent',
          action: 'connected',
          message: 'Agent "Web Server 1" connected',
          timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
          severity: 'info',
        },
        {
          id: 2,
          type: 'rule',
          action: 'created',
          message: 'New HTTP rule created',
          timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
          severity: 'info',
        },
        {
          id: 3,
          type: 'agent',
          action: 'disconnected',
          message: 'Agent "Database Server" disconnected',
          timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
          severity: 'warning',
        },
      ];
    },
    refetchInterval: 10000, // Refetch every 10 seconds
  });
}
