import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const API_URL = import.meta.env.VITE_API_URL || 
                (import.meta.env.PROD ? 'https://refit-dashboard.onrender.com' : 'http://localhost:4000');

interface Goal {
  id: string;
  name: string;
  category: string;
  metric: string;
  target: number;
  unit: string;
  startDate: string;
  endDate: string;
  periodicity: string;
  notes?: string;
  status: string;
  currentValue?: number;
  progress?: number;
  progressStatus?: 'achieved' | 'on_track' | 'behind' | 'overdue';
  isAchieved?: boolean;
  isOverdue?: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CreateGoalData {
  name: string;
  category: 'financial' | 'clients' | 'operations' | 'custom';
  metric: string;
  target: number;
  unit: string;
  startDate: string;
  endDate: string;
  periodicity?: 'monthly' | 'quarterly' | 'annual';
  notes?: string;
  status?: string;
}

export function useGoals(params?: { status?: string; category?: string; periodicity?: string }) {
  return useQuery({
    queryKey: ['goals', params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params?.status) searchParams.append('status', params.status);
      if (params?.category) searchParams.append('category', params.category);
      if (params?.periodicity) searchParams.append('periodicity', params.periodicity);

      const res = await fetch(`${API_URL}/api/goals?${searchParams}`, {
        credentials: 'include',
      });
      
      if (!res.ok) throw new Error('Erro ao buscar objetivos');
      return res.json() as Promise<Goal[]>;
    },
  });
}

export function useGoalsSummary() {
  return useQuery({
    queryKey: ['goals', 'summary'],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/goals/summary`, {
        credentials: 'include',
      });
      
      if (!res.ok) throw new Error('Erro ao buscar resumo');
      return res.json();
    },
  });
}

export function useCreateGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateGoalData) => {
      const res = await fetch(`${API_URL}/api/goals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Erro ao criar objetivo');
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useUpdateGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CreateGoalData> }) => {
      const res = await fetch(`${API_URL}/api/goals/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Erro ao atualizar objetivo');
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useDeleteGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${API_URL}/api/goals/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Erro ao eliminar objetivo');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useCompleteGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${API_URL}/api/goals/${id}/complete`, {
        method: 'PATCH',
        credentials: 'include',
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Erro ao marcar objetivo');
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
    },
  });
}
