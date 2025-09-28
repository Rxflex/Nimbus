'use client';

import { useDashboardStats, useRecentActivity } from '@/hooks/use-dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const { data: stats, isLoading } = useDashboardStats();
  const { data: recentActivity = [] } = useRecentActivity();

  const statCards = [
    {
      title: 'Total Agents',
      value: stats?.agents?.total || 0,
      subtitle: `${stats?.agents?.connected || 0} connected`,
      icon: '🤖'
    },
    {
      title: 'Rules',
      value: stats?.rules?.total || 0,
      subtitle: 'Active rules',
      icon: '📋'
    },
    {
      title: 'Routes',
      value: stats?.routes?.total || 0,
      subtitle: 'Configured routes',
      icon: '🛣️'
    },
    {
      title: 'GeoDNS',
      value: stats?.geodns?.total || 0,
      subtitle: 'DNS configurations',
      icon: '🌍'
    }
  ];

  if (isLoading && !stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold">Dashboard</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Overview of your Nimbus system</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statCards.map((card, index) => (
          <Card key={index}>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-xl sm:text-2xl">{card.icon}</span>
                </div>
                <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">{card.title}</p>
                  <p className="text-lg sm:text-2xl font-bold">{card.value}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">{card.subtitle}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start text-sm">
                  <span className={`w-2 h-2 rounded-full mr-3 mt-1.5 flex-shrink-0 ${
                    activity.severity === 'warning' ? 'bg-yellow-500' :
                    activity.severity === 'error' ? 'bg-destructive' :
                    'bg-green-500'
                  }`}></span>
                  <div className="min-w-0 flex-1">
                    <div className="break-words">{activity.message}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {new Date(activity.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base sm:text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button variant="ghost" className="w-full justify-start text-sm">
                ➕ Add new agent
              </Button>
              <Button variant="ghost" className="w-full justify-start text-sm">
                📋 Create rule
              </Button>
              <Button variant="ghost" className="w-full justify-start text-sm">
                🛣️ Setup route
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
