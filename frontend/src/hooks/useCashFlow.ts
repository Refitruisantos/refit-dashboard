import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

interface CashFlowMovement {
  id: string;
  type: 'inflow' | 'outflow';
  description: string;
  category?: string;
  amount: number;
  date: string;
  method?: string;
  status: 'realized' | 'forecast';
  origin: 'payment' | 'expense' | 'manual';
  notes?: string;
  createdAt: string;
}

interface CashFlowSummary {
  period: { month: number; year: number };
  currentBalance: number;
  inflows: {
    realized: number;
    forecast: number;
    total: number;
  };
  outflows: {
    realized: number;
    forecast: number;
    total: number;
  };
  netCashFlow: number;
  forecastBalance: number;
}

interface CreateCashFlowData {
  type: 'inflow' | 'outflow';
  description: string;
  category?: string;
  amount: number;
  date: string;
  method?: string;
  status?: 'realized' | 'forecast';
  notes?: string;
}

export function useCashFlowMovements(params?: { startDate?: string; endDate?: string; type?: string; status?: string }) {
  return useQuery({
    queryKey: ['cashflow', 'movements', params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params?.startDate) searchParams.append('startDate', params.startDate);
      if (params?.endDate) searchParams.append('endDate', params.endDate);
      if (params?.type) searchParams.append('type', params.type);
      if (params?.status) searchParams.append('status', params.status);

      const res = await fetch(`${API_URL}/api/cashflow?${searchParams}`, {
        credentials: 'include',
      });
      
      if (!res.ok) throw new Error('Erro ao buscar movimentos');
      return res.json() as Promise<CashFlowMovement[]>;
    },
  });
}

export function useCashFlowSummary(month?: number, year?: number) {
  return useQuery({
    queryKey: ['cashflow', 'summary', month, year],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (month) searchParams.append('month', month.toString());
      if (year) searchParams.append('year', year.toString());

      const res = await fetch(`${API_URL}/api/cashflow/summary?${searchParams}`, {
        credentials: 'include',
      });
      
      if (!res.ok) throw new Error('Erro ao buscar resumo');
      return res.json() as Promise<CashFlowSummary>;
    },
  });
}

export function useCashFlowChart(period?: string, year?: number) {
  return useQuery({
    queryKey: ['cashflow', 'chart', period, year],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (period) searchParams.append('period', period);
      if (year) searchParams.append('year', year.toString());

      const res = await fetch(`${API_URL}/api/cashflow/chart?${searchParams}`, {
        credentials: 'include',
      });
      
      if (!res.ok) throw new Error('Erro ao buscar gráfico');
      return res.json();
    },
  });
}

export function useCreateCashFlowMovement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateCashFlowData) => {
      const res = await fetch(`${API_URL}/api/cashflow`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Erro ao criar movimento');
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cashflow'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useUpdateCashFlowMovement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CreateCashFlowData> }) => {
      const res = await fetch(`${API_URL}/api/cashflow/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Erro ao atualizar movimento');
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cashflow'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useDeleteCashFlowMovement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${API_URL}/api/cashflow/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Erro ao eliminar movimento');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cashflow'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}
