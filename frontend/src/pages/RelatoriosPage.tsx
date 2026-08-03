import { useState } from 'react';
import { FileText, TrendingUp, TrendingDown, Download } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useManagementReport, useRevenueReport, useExpensesReport, useClientsReport, useServicesReport } from '@/hooks/useReports';
import { cn, formatCurrency } from '@/lib/utils';

type ReportType = 'management' | 'revenue' | 'expenses' | 'clients' | 'services';

export function RelatoriosPage() {
  const [activeReport, setActiveReport] = useState<ReportType>('management');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const { data: managementData, isLoading: loadingManagement } = useManagementReport(selectedMonth, selectedYear);
  const { data: revenueData } = useRevenueReport({ groupBy: 'month' });
  const { data: expensesData } = useExpensesReport({ groupBy: 'category' });
  const { data: clientsData } = useClientsReport();
  const { data: servicesData } = useServicesReport();

  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const handleExportPDF = () => {
    alert('Exportação PDF será implementada com jsPDF');
  };

  const handleExportExcel = () => {
    alert('Exportação Excel será implementada com xlsx');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card shadow-sm">
        <div className="mx-auto max-w-[1800px] px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 shadow-sm">
                <FileText className="h-6 w-6 text-primary" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">Relatórios</h1>
                <p className="text-sm text-muted-foreground">Análise e exportação de dados</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleExportExcel} className="gap-2">
                <Download className="h-4 w-4" />
                Excel
              </Button>
              <Button onClick={handleExportPDF} className="gap-2">
                <Download className="h-4 w-4" />
                PDF
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1800px] p-6 pb-12">
        {/* Seletor de Período */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Mês</label>
                <select value={selectedMonth} onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                  className="rounded-lg border border-border bg-background px-3 py-2 text-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
                  {months.map((month, index) => (
                    <option key={index} value={index + 1}>{month}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">Ano</label>
                <select value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                  className="rounded-lg border border-border bg-background px-3 py-2 text-sm transition-all focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">
                  {[2024, 2025, 2026, 2027].map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <div className="mb-6 flex gap-2 border-b border-border overflow-x-auto">
          {[
            { id: 'management', label: 'Gestão Mensal' },
            { id: 'revenue', label: 'Receitas' },
            { id: 'expenses', label: 'Despesas' },
            { id: 'clients', label: 'Clientes' },
            { id: 'services', label: 'Serviços' },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveReport(tab.id as ReportType)}
              className={cn('border-b-2 px-4 py-3 text-sm font-semibold transition-colors whitespace-nowrap',
                activeReport === tab.id ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground')}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Relatório de Gestão */}
        {activeReport === 'management' && managementData && (
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardContent className="p-4">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Receita Total</p>
                  <p className="mt-2 text-2xl font-bold text-success">{formatCurrency(managementData.revenue.total)}</p>
                  <div className="mt-1 flex items-center gap-1 text-xs">
                    {managementData.revenue.changeVsPrevMonth > 0 ? (
                      <><TrendingUp className="h-3 w-3 text-success" /><span className="text-success">+{managementData.revenue.changeVsPrevMonth.toFixed(1)}%</span></>
                    ) : (
                      <><TrendingDown className="h-3 w-3 text-destructive" /><span className="text-destructive">{managementData.revenue.changeVsPrevMonth.toFixed(1)}%</span></>
                    )}
                    <span className="text-muted-foreground">vs mês anterior</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Despesas Totais</p>
                  <p className="mt-2 text-2xl font-bold text-destructive">{formatCurrency(managementData.expenses.total)}</p>
                  <div className="mt-1 flex items-center gap-1 text-xs">
                    {managementData.expenses.changeVsPrevMonth > 0 ? (
                      <><TrendingUp className="h-3 w-3 text-destructive" /><span className="text-destructive">+{managementData.expenses.changeVsPrevMonth.toFixed(1)}%</span></>
                    ) : (
                      <><TrendingDown className="h-3 w-3 text-success" /><span className="text-success">{managementData.expenses.changeVsPrevMonth.toFixed(1)}%</span></>
                    )}
                    <span className="text-muted-foreground">vs mês anterior</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Lucro</p>
                  <p className={cn("mt-2 text-2xl font-bold", managementData.profit.total >= 0 ? "text-success" : "text-destructive")}>
                    {formatCurrency(managementData.profit.total)}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">Margem: {managementData.profit.margin.toFixed(1)}%</p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Clientes Ativos</p>
                  <p className="mt-2 text-2xl font-bold text-primary">{managementData.clients.active}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {managementData.clients.new > 0 && `+${managementData.clients.new} novos`}
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader title="Pagamentos" subtitle="Estado atual" />
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Recebidos</span>
                      <div className="text-right">
                        <p className="font-semibold text-success">{formatCurrency(managementData.payments.paid.amount)}</p>
                        <p className="text-xs text-muted-foreground">{managementData.payments.paid.count} pagamentos</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Pendentes</span>
                      <div className="text-right">
                        <p className="font-semibold text-warning">{formatCurrency(managementData.payments.pending.amount)}</p>
                        <p className="text-xs text-muted-foreground">{managementData.payments.pending.count} pagamentos</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Em Atraso</span>
                      <div className="text-right">
                        <p className="font-semibold text-destructive">{formatCurrency(managementData.payments.overdue.amount)}</p>
                        <p className="text-xs text-muted-foreground">{managementData.payments.overdue.count} pagamentos</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader title="Comparações" subtitle="Períodos anteriores" />
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">Mês Anterior</p>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div>
                          <p className="text-muted-foreground">Receita</p>
                          <p className="font-semibold">{formatCurrency(managementData.revenue.prevMonth)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Despesas</p>
                          <p className="font-semibold">{formatCurrency(managementData.expenses.prevMonth)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Lucro</p>
                          <p className="font-semibold">{formatCurrency(managementData.profit.prevMonth)}</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">Ano Anterior</p>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div>
                          <p className="text-muted-foreground">Receita</p>
                          <p className="font-semibold">{formatCurrency(managementData.revenue.lastYear)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Despesas</p>
                          <p className="font-semibold">{formatCurrency(managementData.expenses.lastYear)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Lucro</p>
                          <p className="font-semibold">{formatCurrency(managementData.profit.lastYear)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Outros Relatórios */}
        {activeReport === 'revenue' && revenueData && (
          <Card>
            <CardHeader title="Relatório de Receitas" subtitle={`Total: ${formatCurrency(revenueData.total)}`} />
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {revenueData.count} pagamentos recebidos
              </p>
              {revenueData.grouped && (
                <div className="mt-4 space-y-2">
                  {Object.entries(revenueData.grouped).map(([key, value]: [string, any]) => (
                    <div key={key} className="flex items-center justify-between border-b border-border pb-2">
                      <span className="text-sm font-medium">{key}</span>
                      <div className="text-right">
                        <p className="font-semibold">{formatCurrency(value.total)}</p>
                        <p className="text-xs text-muted-foreground">{value.count} pagamentos</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeReport === 'expenses' && expensesData && (
          <Card>
            <CardHeader title="Relatório de Despesas" subtitle={`Total: ${formatCurrency(expensesData.total)}`} />
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {expensesData.count} despesas pagas
              </p>
              {expensesData.grouped && (
                <div className="mt-4 space-y-2">
                  {Object.entries(expensesData.grouped).map(([key, value]: [string, any]) => (
                    <div key={key} className="flex items-center justify-between border-b border-border pb-2">
                      <span className="text-sm font-medium">{key}</span>
                      <div className="text-right">
                        <p className="font-semibold text-destructive">{formatCurrency(value.total)}</p>
                        <p className="text-xs text-muted-foreground">{value.count} despesas</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeReport === 'clients' && clientsData && (
          <Card>
            <CardHeader title="Relatório de Clientes" subtitle={`${clientsData.summary.active} clientes ativos`} />
            <CardContent>
              <div className="mb-4 grid grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Total</p>
                  <p className="text-xl font-bold">{clientsData.summary.total}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Ativos</p>
                  <p className="text-xl font-bold text-success">{clientsData.summary.active}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Novos</p>
                  <p className="text-xl font-bold text-primary">{clientsData.summary.new}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Inativos</p>
                  <p className="text-xl font-bold text-muted-foreground">{clientsData.summary.inactive}</p>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      <th className="pb-2">Cliente</th>
                      <th className="pb-2">Serviço</th>
                      <th className="pb-2">Receita</th>
                      <th className="pb-2">Pagamentos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clientsData.clients.slice(0, 10).map((client: any) => (
                      <tr key={client.id} className="border-b border-border/50">
                        <td className="py-2">{client.name}</td>
                        <td className="py-2 text-muted-foreground">{client.service}</td>
                        <td className="py-2 font-semibold">{formatCurrency(client.revenue)}</td>
                        <td className="py-2 text-muted-foreground">{client.paymentsCount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {activeReport === 'services' && servicesData && (
          <Card>
            <CardHeader title="Relatório de Serviços" subtitle={`Receita total: ${formatCurrency(servicesData.totalRevenue)}`} />
            <CardContent>
              <div className="space-y-3">
                {servicesData.services.map((service: any) => (
                  <div key={service.id} className="flex items-center justify-between border-b border-border pb-3">
                    <div>
                      <p className="font-semibold">{service.name}</p>
                      <p className="text-xs text-muted-foreground">{service.activeClients} clientes ativos</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-success">{formatCurrency(service.revenue)}</p>
                      <p className="text-xs text-muted-foreground">{service.paymentsCount} pagamentos</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {loadingManagement && (
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">A carregar relatório...</p>
          </div>
        )}
      </main>
    </div>
  );
}
