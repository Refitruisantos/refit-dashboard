import { Calendar, ChevronDown, Download, FileText, Moon, RefreshCcw, Sun, Table2, User } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { useTheme } from '@/context/ThemeContext';
import { MONTHS } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface DashboardHeaderProps {
  month: number;
  year: number;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
  updatedAt?: string;
  isFetching: boolean;
  onRefresh: () => void;
  search: string;
  onSearchChange: (value: string) => void;
  onExportPdf: () => void;
  onExportExcel: () => void;
  onPrint: () => void;
  source?: 'api' | 'demo';
}

const YEARS = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 3 + i);

export function DashboardHeader({
  month,
  year,
  onMonthChange,
  onYearChange,
  isFetching,
  onRefresh,
  onExportPdf,
  onExportExcel,
  source,
}: DashboardHeaderProps) {
  const { theme, toggle } = useTheme();
  const [showExportMenu, setShowExportMenu] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-card/95 shadow-sm backdrop-blur-md supports-[backdrop-filter]:bg-card/80">
      <div className="mx-auto max-w-[1800px] px-6 py-5">
        {/* Linha 1: Logo + Título + Ações */}
        <div className="flex items-center justify-between gap-6">
          {/* Logo + Título */}
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-success to-emerald-600 p-2.5 shadow-md">
              <img src="/logo.svg" alt="REFIT" className="h-full w-full brightness-0 invert" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-tight">Dashboard Financeiro</h1>
                {source === 'demo' && (
                  <span className="rounded-md bg-warning/10 px-2 py-0.5 text-2xs font-semibold uppercase tracking-wider text-warning">
                    Demo
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">Visão geral do desempenho do estúdio REFIT</p>
            </div>
          </div>

          {/* Ações Principais */}
          <div className="flex items-center gap-2 no-print">
            {/* Botão Atualizar */}
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isFetching}
              className="h-9 gap-2 border-border/50 px-3"
            >
              <RefreshCcw className={cn('h-4 w-4', isFetching && 'animate-spin')} />
              <span className="hidden sm:inline">Atualizar</span>
            </Button>

            {/* Menu Exportar */}
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="h-9 gap-2 border-border/50 px-3"
              >
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Exportar</span>
                <ChevronDown className="h-3 w-3 opacity-50" />
              </Button>
              {showExportMenu && (
                <div className="absolute right-0 top-full z-50 mt-2 w-40 rounded-lg border border-border/50 bg-card shadow-lg">
                  <div className="p-1">
                    <button
                      onClick={() => {
                        onExportPdf();
                        setShowExportMenu(false);
                      }}
                      className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted"
                    >
                      <FileText className="h-4 w-4" />
                      Exportar PDF
                    </button>
                    <button
                      onClick={() => {
                        onExportExcel();
                        setShowExportMenu(false);
                      }}
                      className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted"
                    >
                      <Table2 className="h-4 w-4" />
                      Exportar Excel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Separador */}
            <div className="h-6 w-px bg-border" />

            {/* Toggle Tema */}
            <Button variant="ghost" size="icon" onClick={toggle} className="h-9 w-9">
              {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </Button>

            {/* Avatar Utilizador */}
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-chart-2 to-chart-5 text-xs font-semibold text-white">
                AD
              </div>
            </Button>
          </div>
        </div>

        {/* Linha 2: Filtros */}
        <div className="mt-4 flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span className="font-medium">Período:</span>
          </div>
          <Select
            className="h-9 w-[130px] text-sm"
            value={month}
            onChange={(event) => onMonthChange(Number(event.target.value))}
            options={MONTHS.map((label, index) => ({ label, value: index + 1 }))}
          />
          <Select
            className="h-9 w-[100px] text-sm"
            value={year}
            onChange={(event) => onYearChange(Number(event.target.value))}
            options={YEARS.map((value) => ({ label: String(value), value }))}
          />
        </div>
      </div>
    </header>
  );
}
