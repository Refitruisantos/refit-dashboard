import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const API_URL = import.meta.env.VITE_API_URL || 
                (import.meta.env.PROD ? 'https://refit-dashboard.onrender.com' : 'http://localhost:4000');

interface Event {
  id: string;
  name: string;
  category: string;
  description?: string;
  startDate: string;
  endDate?: string;
  startTime?: string;
  location?: string;
  responsible?: string;
  participants?: string;
  budgetPlanned?: number;
  budgetActual?: number;
  status: 'idea' | 'planned' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateEventData {
  name: string;
  category: string;
  description?: string;
  startDate: string;
  endDate?: string;
  startTime?: string;
  location?: string;
  responsible?: string;
  participants?: string;
  budgetPlanned?: number;
  budgetActual?: number;
  status?: 'idea' | 'planned' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
}

interface UpdateEventData extends Partial<CreateEventData> {}

export function useEvents(params?: { startDate?: string; endDate?: string; category?: string; status?: string }) {
  return useQuery({
    queryKey: ['events', params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params?.startDate) searchParams.append('startDate', params.startDate);
      if (params?.endDate) searchParams.append('endDate', params.endDate);
      if (params?.category) searchParams.append('category', params.category);
      if (params?.status) searchParams.append('status', params.status);

      const res = await fetch(`${API_URL}/api/events?${searchParams}`, {
        credentials: 'include',
      });
      
      if (!res.ok) throw new Error('Erro ao buscar eventos');
      return res.json() as Promise<Event[]>;
    },
  });
}

export function useEvent(id: string) {
  return useQuery({
    queryKey: ['events', id],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/events/${id}`, {
        credentials: 'include',
      });
      
      if (!res.ok) throw new Error('Erro ao buscar evento');
      return res.json() as Promise<Event>;
    },
    enabled: !!id,
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateEventData) => {
      const res = await fetch(`${API_URL}/api/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Erro ao criar evento');
      }

      return res.json() as Promise<Event>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
}

export function useUpdateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateEventData }) => {
      const res = await fetch(`${API_URL}/api/events/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Erro ao atualizar evento');
      }

      return res.json() as Promise<Event>;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      queryClient.invalidateQueries({ queryKey: ['events', variables.id] });
    },
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${API_URL}/api/events/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Erro ao eliminar evento');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
}

export function useDuplicateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${API_URL}/api/events/${id}/duplicate`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Erro ao duplicar evento');
      }

      return res.json() as Promise<Event>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
}
