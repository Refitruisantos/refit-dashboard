import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const API_URL = import.meta.env.VITE_API_URL || 
                (import.meta.env.PROD ? 'https://refit-dashboard.onrender.com' : 'http://localhost:4000');

interface Expense {
  id: string;
  description: string;
  category: string;
  supplier?: string;
  amount: number;
  expenseDate: string;
  dueDate: string;
  paidAt?: string;
  method?: 'mbway' | 'transfer' | 'cash' | 'card' | 'debit' | 'other';
  status: 'paid' | 'pending' | 'overdue' | 'cancelled';
  type: 'fixed' | 'variable' | 'extraordinary';
  recurrence: 'once' | 'monthly' | 'quarterly' | 'biannual' | 'annual';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateExpenseData {
  description: string;
  category: string;
  supplier?: string;
  amount: number;
  expenseDate: string;
  dueDate: string;
  paidAt?: string;
  method?: 'mbway' | 'transfer' | 'cash' | 'card' | 'debit' | 'other';
  status?: 'paid' | 'pending' | 'overdue' | 'cancelled';
  type?: 'fixed' | 'variable' | 'extraordinary';
  recurrence?: 'once' | 'monthly' | 'quarterly' | 'biannual' | 'annual';
  notes?: string;
}

interface UpdateExpenseData extends Partial<CreateExpenseData> {}

interface ExpensesSummary {
  totalMonth: number;
  totalPaid: number;
  totalPending: number;
  totalOverdue: number;
  variation: number;
}

export function useExpenses(params?: { category?: string; status?: string; startDate?: string; endDate?: string }) {
  return useQuery({
    queryKey: ['expenses', params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params?.category) searchParams.append('category', params.category);
      if (params?.status) searchParams.append('status', params.status);
      if (params?.startDate) searchParams.append('startDate', params.startDate);
      if (params?.endDate) searchParams.append('endDate', params.endDate);

      const res = await fetch(`${API_URL}/api/expenses?${searchParams}`, {
        credentials: 'include',
      });
      
      if (!res.ok) throw new Error('Erro ao buscar despesas');
      return res.json() as Promise<Expense[]>;
    },
  });
}

export function useExpensesSummary(month?: number, year?: number) {
  return useQuery({
    queryKey: ['expenses', 'summary', month, year],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (month) searchParams.append('month', month.toString());
      if (year) searchParams.append('year', year.toString());

      const res = await fetch(`${API_URL}/api/expenses/summary?${searchParams}`, {
        credentials: 'include',
      });
      
      if (!res.ok) throw new Error('Erro ao buscar resumo');
      return res.json() as Promise<ExpensesSummary>;
    },
  });
}

export function useExpense(id: string) {
  return useQuery({
    queryKey: ['expenses', id],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/expenses/${id}`, {
        credentials: 'include',
      });
      
      if (!res.ok) throw new Error('Erro ao buscar despesa');
      return res.json() as Promise<Expense>;
    },
    enabled: !!id,
  });
}

export function useCreateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateExpenseData) => {
      const res = await fetch(`${API_URL}/api/expenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Erro ao criar despesa');
      }

      return res.json() as Promise<Expense>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useUpdateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateExpenseData }) => {
      const res = await fetch(`${API_URL}/api/expenses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Erro ao atualizar despesa');
      }

      return res.json() as Promise<Expense>;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['expenses', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useDeleteExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${API_URL}/api/expenses/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Erro ao eliminar despesa');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useMarkExpenseAsPaid() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, paidAt, method }: { id: string; paidAt?: string; method?: string }) => {
      const res = await fetch(`${API_URL}/api/expenses/${id}/mark-paid`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ paidAt, method }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Erro ao marcar como pago');
      }

      return res.json() as Promise<Expense>;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      queryClient.invalidateQueries({ queryKey: ['expenses', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useDuplicateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${API_URL}/api/expenses/${id}/duplicate`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Erro ao duplicar despesa');
      }

      return res.json() as Promise<Expense>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
    },
  });
}
