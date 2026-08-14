import type { DashboardData } from '@/types/dashboard';

// Garantir que em produção usa sempre o Render
const API_URL = import.meta.env.VITE_API_URL || 
                (import.meta.env.PROD ? 'https://refit-dashboard.onrender.com' : '/api');
const TOKEN_KEY = 'refit.token';

export const auth = {
  get token() {
    return localStorage.getItem(TOKEN_KEY);
  },
  set(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  },
  clear() {
    localStorage.removeItem(TOKEN_KEY);
  },
};

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(auth.token ? { Authorization: `Bearer ${auth.token}` } : {}),
      ...init?.headers,
    },
  });

  if (!response.ok) {
    throw new ApiError(`Falha ao contactar a API (${response.status})`, response.status);
  }

  return (await response.json()) as T;
}

export interface DashboardQuery {
  month: number;
  year: number;
}

/**
 * Obtém os dados do dashboard da API.
 */
export async function getDashboard({ month, year }: DashboardQuery): Promise<{ data: DashboardData; source: 'api' | 'demo' }> {
  const data = await request<DashboardData>(`/dashboard?month=${month}&year=${year}`);
  return { data, source: 'api' };
}

export const api = {
  request,
  finance: (q: DashboardQuery) => request(`/finance?month=${q.month}&year=${q.year}`),
  expenses: (q: DashboardQuery) => request(`/expenses?month=${q.month}&year=${q.year}`),
  payments: (q: DashboardQuery) => request(`/payments?month=${q.month}&year=${q.year}`),
  clients: () => request('/clients'),
  reports: (q: DashboardQuery) => request(`/reports?month=${q.month}&year=${q.year}`),
  cashflow: (q: DashboardQuery) => request(`/cashflow?year=${q.year}`),
  goals: (q: DashboardQuery) => request(`/goals?month=${q.month}&year=${q.year}`),
  alerts: (q: DashboardQuery) => request(`/alerts?month=${q.month}&year=${q.year}`),
  login: (email: string, password: string) =>
    request<{ token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
};
