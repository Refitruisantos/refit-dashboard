import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import type { DashboardData } from '@/types/dashboard';
import { MONTHS } from './utils';

const fileName = (data: DashboardData, ext: string) =>
  `refit-dashboard-${MONTHS[data.period.month - 1].toLowerCase()}-${data.period.year}.${ext}`;

export function exportToPdf(data: DashboardData) {
  const doc = new jsPDF({ orientation: 'landscape' });

  doc.setFontSize(18);
  doc.text('REFIT | Dashboard Financeiro', 14, 16);
  doc.setFontSize(10);
  doc.text(`${MONTHS[data.period.month - 1]} ${data.period.year}`, 14, 23);

  autoTable(doc, {
    startY: 30,
    head: [['Indicador', 'Valor']],
    body: [
      ['Clientes ativos', String(data.kpis.activeClients.value)],
      ['Receita do mês', `${data.kpis.revenue.value} EUR`],
      ['Despesas', `${data.kpis.expenses.value} EUR`],
      ['Lucro', `${data.kpis.profit.value} EUR`],
      ['MRR', `${data.metrics.mrr} EUR`],
      ['ARR', `${data.metrics.arr} EUR`],
      ['Margem líquida', `${data.metrics.netMargin}%`],
      ['Churn', `${data.metrics.churn}%`],
      ['LTV / CAC', `${data.metrics.ltv} / ${data.metrics.cac}`],
    ],
    theme: 'grid',
    headStyles: { fillColor: [15, 23, 42] },
  });

  autoTable(doc, {
    head: [['Mês', 'Entradas', 'Saídas', 'Lucro', 'Margem', 'Saldo']],
    body: data.cashflow.map((row) => [
      row.month,
      row.inflow,
      row.outflow,
      row.profit,
      `${row.margin}%`,
      row.balance,
    ]),
    theme: 'striped',
    headStyles: { fillColor: [22, 163, 74] },
  });

  doc.save(fileName(data, 'pdf'));
}

export function exportToExcel(data: DashboardData) {
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    XLSX.utils.json_to_sheet([
      { Indicador: 'Clientes ativos', Valor: data.kpis.activeClients.value },
      { Indicador: 'Receita', Valor: data.kpis.revenue.value },
      { Indicador: 'Despesas', Valor: data.kpis.expenses.value },
      { Indicador: 'Lucro', Valor: data.kpis.profit.value },
      ...Object.entries(data.metrics).map(([key, value]) => ({ Indicador: key, Valor: value })),
    ]),
    'Resumo',
  );
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(data.revenueByService), 'Receita por serviço');
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(data.expensesByCategory), 'Despesas');
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(data.cashflow), 'Fluxo de caixa');
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(data.revenueByMonth), 'Receita mensal');

  XLSX.writeFile(workbook, fileName(data, 'xlsx'));
}

export function printDashboard() {
  window.print();
}
