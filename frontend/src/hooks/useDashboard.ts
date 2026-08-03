import { useQuery } from '@tanstack/react-query';
import { getDashboard, type DashboardQuery } from '@/services/api';

export const dashboardKeys = {
  all: ['dashboard'] as const,
  period: (q: DashboardQuery) => ['dashboard', q.month, q.year] as const,
};

export function useDashboard(query: DashboardQuery, realtime = true) {
  return useQuery({
    queryKey: dashboardKeys.period(query),
    queryFn: () => getDashboard(query),
    refetchInterval: realtime ? 60_000 : false,
    staleTime: 30_000,
  });
}
