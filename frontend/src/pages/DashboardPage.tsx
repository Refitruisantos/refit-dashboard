import { useMemo, useState } from 'react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { KpiCards, KpiCardsSkeleton } from '@/components/dashboard/KpiCards';
import { ExecutiveSummary } from '@/components/dashboard/ExecutiveSummary';
import { FinancialMetrics } from '@/components/dashboard/FinancialMetrics';
import { RevenueByServiceCard } from '@/components/dashboard/RevenueByServiceCard';
import { ClientsDonutCard, NewClientsCard } from '@/components/dashboard/ClientsCard';
import { AlertsCard } from '@/components/dashboard/AlertsCard';
import { RevenueByMonthCard } from '@/components/dashboard/RevenueByMonthCard';
import { ExpensesByCategoryCard } from '@/components/dashboard/ExpensesByCategoryCard';
import { GoalsCard } from '@/components/dashboard/GoalsCard';
import { CashflowCard } from '@/components/dashboard/CashflowCard';
import { UpcomingEventsCard } from '@/components/dashboard/UpcomingEventsCard';
import { ErrorState } from '@/components/ui/states';
import { useDashboard } from '@/hooks/useDashboard';
import { exportToPdf, exportToExcel, printDashboard } from '@/lib/export';

export function DashboardPage() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [search, setSearch] = useState('');

  const { data, isLoading, isError, error, isFetching, refetch } = useDashboard({ month, year });

  const filtered = useMemo(() => {
    if (!data?.data || !search.trim()) return data?.data;

    const term = search.toLowerCase();
    return {
      ...data.data,
      revenueByService: data.data.revenueByService.filter((item) => item.service.toLowerCase().includes(term)),
      expensesByCategory: data.data.expensesByCategory.filter((item) => item.category.toLowerCase().includes(term)),
    };
  }, [data, search]);

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <ErrorState message={error?.message ?? 'Erro desconhecido'} onRetry={() => refetch()} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader
        month={month}
        year={year}
        onMonthChange={setMonth}
        onYearChange={setYear}
        updatedAt={data?.data.updatedAt}
        isFetching={isFetching}
        onRefresh={() => refetch()}
        search={search}
        onSearchChange={setSearch}
        onExportPdf={() => data?.data && exportToPdf(data.data)}
        onExportExcel={() => data?.data && exportToExcel(data.data)}
        onPrint={printDashboard}
        source={data?.source}
      />

      <main className="mx-auto max-w-[1800px] space-y-6 p-6 pb-12">
        {isLoading ? (
          <>
            <KpiCardsSkeleton />
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-4">
              <div className="h-96 animate-pulse rounded-lg bg-muted/20" />
              <div className="h-96 animate-pulse rounded-lg bg-muted/20" />
              <div className="h-96 animate-pulse rounded-lg bg-muted/20" />
              <div className="h-96 animate-pulse rounded-lg bg-muted/20" />
            </div>
          </>
        ) : (
          filtered && (
            <>
              <KpiCards kpis={filtered.kpis} />

              <ExecutiveSummary data={filtered} />

              <FinancialMetrics data={filtered} />

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <RevenueByMonthCard data={filtered.revenueByMonth} />
                </div>
                <RevenueByServiceCard data={filtered.revenueByService} />
              </div>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
                <ClientsDonutCard clients={filtered.clients} />
                <NewClientsCard newClients={filtered.newClients} />
                <div className="lg:col-span-2">
                  <ExpensesByCategoryCard data={filtered.expensesByCategory} />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                  <CashflowCard data={filtered.cashflow} />
                </div>
                <div className="space-y-6">
                  <AlertsCard alerts={filtered.alerts} />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <GoalsCard goals={filtered.goals} />
                <UpcomingEventsCard events={filtered.upcoming} />
              </div>
            </>
          )
        )}
      </main>
    </div>
  );
}
