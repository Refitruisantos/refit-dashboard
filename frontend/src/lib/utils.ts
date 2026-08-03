import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const currency = new Intl.NumberFormat('pt-PT', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
});

const currencyDetailed = new Intl.NumberFormat('pt-PT', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2,
});

const number = new Intl.NumberFormat('pt-PT');

export const formatCurrency = (value: number | undefined | null, detailed = false) => {
  if (value === undefined || value === null || isNaN(value)) return '€0';
  return detailed ? currencyDetailed.format(value) : currency.format(value);
};

export const formatNumber = (value: number | undefined | null) => {
  if (value === undefined || value === null || isNaN(value)) return '0';
  return number.format(value);
};

export const formatPercent = (value: number | undefined | null, digits = 1) => {
  if (value === undefined || value === null || isNaN(value)) return '0.0%';
  return `${value > 0 ? '' : ''}${value.toFixed(digits)}%`;
};

export const formatSigned = (value: number | undefined | null, digits = 1) => {
  if (value === undefined || value === null || isNaN(value)) return '0.0%';
  return `${value > 0 ? '+' : ''}${value.toFixed(digits)}%`;
};

export const formatDate = (iso: string) =>
  new Intl.DateTimeFormat('pt-PT', { day: '2-digit', month: 'short' }).format(new Date(iso));

export const formatDateTime = (iso: string) =>
  new Intl.DateTimeFormat('pt-PT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso));

export const MONTHS = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

export const MONTHS_SHORT = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

export const CHART_COLORS = {
  1: '#10b981',
  2: '#3b82f6',
  3: '#f59e0b',
  4: '#ef4444',
  5: '#8b5cf6',
  6: '#64748b',
};

export const SERVICE_COLORS = [
  CHART_COLORS[1],
  CHART_COLORS[2],
  CHART_COLORS[5],
  CHART_COLORS[3],
  CHART_COLORS[4],
  CHART_COLORS[6],
];
