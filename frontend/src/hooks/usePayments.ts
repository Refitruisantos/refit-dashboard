import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const API_URL = import.meta.env.VITE_API_URL || 
                (import.meta.env.PROD ? 'https://refit-dashboard.onrender.com' : 'http://localhost:4000');

interface Payment {
  id: string;
  clientId: string;
  serviceId?: string;
  amount: number;
  period?: string;
  dueDate: string;
  paidAt?: string;
  method?: 'mbway' | 'transfer' | 'cash' | 'card' | 'other';
  status: 'paid' | 'pending' | 'overdue' | 'cancelled';
  notes?: string;
  createdAt: string;
  updatedAt: string;
  client?: {
    id: string;
    name: string;
    email: string;
  };
  service?: {
    id: string;
    name: string;
    price: number;
  };
}

interface CreatePaymentData {
  clientId: string;
  serviceId?: string;
  amount: number;
  period?: string;
  dueDate: string;
  paidAt?: string;
  method?: 'mbway' | 'transfer' | 'cash' | 'card' | 'other';
  status?: 'paid' | 'pending' | 'overdue' | 'cancelled';
  notes?: string;
}

interface UpdatePaymentData extends Partial<CreatePaymentData> {}

interface PaymentsSummary {
  totalReceived: number;
  totalPending: number;
  totalOverdue: number;
  countReceived: number;
  countPending: number;
}

export function usePayments(params?: { clientId?: string; status?: string; startDate?: string; endDate?: string }) {
  return useQuery({
    queryKey: ['payments', params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params?.clientId) searchParams.append('clientId', params.clientId);
      if (params?.status) searchParams.append('status', params.status);
      if (params?.startDate) searchParams.append('startDate', params.startDate);
      if (params?.endDate) searchParams.append('endDate', params.endDate);

      const res = await fetch(`${API_URL}/api/payments?${searchParams}`, {
        credentials: 'include',
      });
      
      if (!res.ok) throw new Error('Erro ao buscar pagamentos');
      return res.json() as Promise<Payment[]>;
    },
  });
}

export function usePaymentsSummary(month?: number, year?: number) {
  return useQuery({
    queryKey: ['payments', 'summary', month, year],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (month) searchParams.append('month', month.toString());
      if (year) searchParams.append('year', year.toString());

      const res = await fetch(`${API_URL}/api/payments/summary?${searchParams}`, {
        credentials: 'include',
      });
      
      if (!res.ok) throw new Error('Erro ao buscar resumo');
      return res.json() as Promise<PaymentsSummary>;
    },
  });
}

export function usePayment(id: string) {
  return useQuery({
    queryKey: ['payments', id],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/payments/${id}`, {
        credentials: 'include',
      });
      
      if (!res.ok) throw new Error('Erro ao buscar pagamento');
      return res.json() as Promise<Payment>;
    },
    enabled: !!id,
  });
}

export function useCreatePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreatePaymentData) => {
      const res = await fetch(`${API_URL}/api/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Erro ao criar pagamento');
      }

      return res.json() as Promise<Payment>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useUpdatePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdatePaymentData }) => {
      const res = await fetch(`${API_URL}/api/payments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Erro ao atualizar pagamento');
      }

      return res.json() as Promise<Payment>;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['payments', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useDeletePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${API_URL}/api/payments/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Erro ao eliminar pagamento');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useMarkPaymentAsPaid() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, method, paidAt }: { id: string; method?: string; paidAt?: string }) => {
      const res = await fetch(`${API_URL}/api/payments/${id}/mark-paid`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ method, paidAt }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Erro ao marcar como pago');
      }

      return res.json() as Promise<Payment>;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['payments', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}
