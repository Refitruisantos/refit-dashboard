import { useQuery } from '@tanstack/react-query';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

interface ManagementReport {
  period: { month: number; year: number };
  revenue: {
    total: number;
    prevMonth: number;
    lastYear: number;
    changeVsPrevMonth: number;
    changeVsLastYear: number;
  };
  expenses: {
    total: number;
    prevMonth: number;
    lastYear: number;
    changeVsPrevMonth: number;
    changeVsLastYear: number;
  };
  profit: {
    total: number;
    prevMonth: number;
    lastYear: number;
    margin: number;
    changeVsPrevMonth: number;
    changeVsLastYear: number;
  };
  payments: {
    paid: { count: number; amount: number };
    pending: { count: number; amount: number };
    overdue: { count: number; amount: number };
  };
  clients: {
    active: number;
    new: number;
    inactive: number;
    avgRevenue: number;
  };
}

export function useManagementReport(month?: number, year?: number) {
  return useQuery({
    queryKey: ['reports', 'management', month, year],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (month) searchParams.append('month', month.toString());
      if (year) searchParams.append('year', year.toString());

      const res = await fetch(`${API_URL}/api/reports/management?${searchParams}`, {
        credentials: 'include',
      });
      
      if (!res.ok) throw new Error('Erro ao buscar relatório de gestão');
      return res.json() as Promise<ManagementReport>;
    },
  });
}

export function useRevenueReport(params?: { startDate?: string; endDate?: string; groupBy?: string }) {
  return useQuery({
    queryKey: ['reports', 'revenue', params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params?.startDate) searchParams.append('startDate', params.startDate);
      if (params?.endDate) searchParams.append('endDate', params.endDate);
      if (params?.groupBy) searchParams.append('groupBy', params.groupBy);

      const res = await fetch(`${API_URL}/api/reports/revenue?${searchParams}`, {
        credentials: 'include',
      });
      
      if (!res.ok) throw new Error('Erro ao buscar relatório de receitas');
      return res.json();
    },
  });
}

export function useExpensesReport(params?: { startDate?: string; endDate?: string; groupBy?: string }) {
  return useQuery({
    queryKey: ['reports', 'expenses', params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params?.startDate) searchParams.append('startDate', params.startDate);
      if (params?.endDate) searchParams.append('endDate', params.endDate);
      if (params?.groupBy) searchParams.append('groupBy', params.groupBy);

      const res = await fetch(`${API_URL}/api/reports/expenses?${searchParams}`, {
        credentials: 'include',
      });
      
      if (!res.ok) throw new Error('Erro ao buscar relatório de despesas');
      return res.json();
    },
  });
}

export function useClientsReport(params?: { startDate?: string; endDate?: string }) {
  return useQuery({
    queryKey: ['reports', 'clients', params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params?.startDate) searchParams.append('startDate', params.startDate);
      if (params?.endDate) searchParams.append('endDate', params.endDate);

      const res = await fetch(`${API_URL}/api/reports/clients?${searchParams}`, {
        credentials: 'include',
      });
      
      if (!res.ok) throw new Error('Erro ao buscar relatório de clientes');
      return res.json();
    },
  });
}

export function useServicesReport(params?: { startDate?: string; endDate?: string }) {
  return useQuery({
    queryKey: ['reports', 'services', params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params?.startDate) searchParams.append('startDate', params.startDate);
      if (params?.endDate) searchParams.append('endDate', params.endDate);

      const res = await fetch(`${API_URL}/api/reports/services?${searchParams}`, {
        credentials: 'include',
      });
      
      if (!res.ok) throw new Error('Erro ao buscar relatório de serviços');
      return res.json();
    },
  });
}
