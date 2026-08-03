import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const createGoalSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  category: z.enum(['financial', 'clients', 'operations', 'custom']),
  metric: z.enum([
    'monthly_revenue',
    'annual_revenue',
    'monthly_profit',
    'annual_profit',
    'max_expenses',
    'active_clients',
    'new_clients',
    'retention_rate',
    'avg_revenue_per_client',
    'activities_count',
    'custom',
  ]),
  target: z.number().positive('Meta deve ser positiva'),
  unit: z.string().default('€'),
  startDate: z.string(),
  endDate: z.string(),
  periodicity: z.enum(['monthly', 'quarterly', 'annual']).default('monthly'),
  notes: z.string().optional(),
  status: z.enum(['active', 'completed', 'cancelled']).default('active'),
});

const updateGoalSchema = createGoalSchema.partial();

// Calcular resultado atual baseado na métrica
async function calculateCurrentValue(metric: string, startDate: Date, endDate: Date): Promise<number> {
  const now = new Date();
  const effectiveEndDate = endDate > now ? now : endDate;

  switch (metric) {
    case 'monthly_revenue':
    case 'annual_revenue': {
      const revenue = await prisma.payment.aggregate({
        where: {
          paidAt: { gte: startDate, lte: effectiveEndDate },
          status: 'paid',
        },
        _sum: { amount: true },
      });
      return revenue._sum.amount || 0;
    }

    case 'monthly_profit':
    case 'annual_profit': {
      const [revenue, expenses] = await Promise.all([
        prisma.payment.aggregate({
          where: {
            paidAt: { gte: startDate, lte: effectiveEndDate },
            status: 'paid',
          },
          _sum: { amount: true },
        }),
        prisma.expense.aggregate({
          where: {
            paidAt: { gte: startDate, lte: effectiveEndDate },
            status: 'paid',
          },
          _sum: { amount: true },
        }),
      ]);
      return (revenue._sum.amount || 0) - (expenses._sum.amount || 0);
    }

    case 'max_expenses': {
      const expenses = await prisma.expense.aggregate({
        where: {
          paidAt: { gte: startDate, lte: effectiveEndDate },
          status: 'paid',
        },
        _sum: { amount: true },
      });
      return expenses._sum.amount || 0;
    }

    case 'active_clients': {
      const clients = await prisma.client.count({
        where: {
          status: 'active',
          joinedAt: { lte: effectiveEndDate },
        },
      });
      return clients;
    }

    case 'new_clients': {
      const newClients = await prisma.client.count({
        where: {
          joinedAt: { gte: startDate, lte: effectiveEndDate },
        },
      });
      return newClients;
    }

    case 'retention_rate': {
      const [totalClients, activeClients] = await Promise.all([
        prisma.client.count({
          where: {
            joinedAt: { lt: startDate },
          },
        }),
        prisma.client.count({
          where: {
            joinedAt: { lt: startDate },
            status: 'active',
          },
        }),
      ]);
      return totalClients > 0 ? (activeClients / totalClients) * 100 : 0;
    }

    case 'avg_revenue_per_client': {
      const [revenue, clientCount] = await Promise.all([
        prisma.payment.aggregate({
          where: {
            paidAt: { gte: startDate, lte: effectiveEndDate },
            status: 'paid',
          },
          _sum: { amount: true },
        }),
        prisma.client.count({
          where: {
            status: 'active',
            joinedAt: { lte: effectiveEndDate },
          },
        }),
      ]);
      return clientCount > 0 ? (revenue._sum.amount || 0) / clientCount : 0;
    }

    case 'activities_count': {
      const [appointments, events] = await Promise.all([
        prisma.appointment.count({
          where: {
            date: { gte: startDate, lte: effectiveEndDate },
            status: { in: ['confirmed', 'completed'] },
          },
        }),
        prisma.event.count({
          where: {
            date: { gte: startDate, lte: effectiveEndDate },
          },
        }),
      ]);
      return appointments + events;
    }

    default:
      return 0;
  }
}

// Obter todos os objetivos com progresso
export async function getAllGoals(req: Request, res: Response) {
  try {
    const { status, category, periodicity } = req.query;

    const where: any = {};
    if (status) where.status = status;
    if (category) where.category = category;
    if (periodicity) where.periodicity = periodicity;

    const goals = await prisma.goal.findMany({
      where,
      orderBy: [{ endDate: 'asc' }, { createdAt: 'desc' }],
    });

    // Calcular progresso para cada objetivo
    const goalsWithProgress = await Promise.all(
      goals.map(async (goal) => {
        const currentValue = await calculateCurrentValue(
          goal.metric,
          goal.startDate,
          goal.endDate
        );

        const progress = goal.target > 0 ? (currentValue / goal.target) * 100 : 0;
        const isAchieved = currentValue >= goal.target;
        const isOverdue = new Date() > goal.endDate && !isAchieved;

        let progressStatus: 'achieved' | 'on_track' | 'behind' | 'overdue';
        if (isAchieved) {
          progressStatus = 'achieved';
        } else if (isOverdue) {
          progressStatus = 'overdue';
        } else if (progress >= 70) {
          progressStatus = 'on_track';
        } else {
          progressStatus = 'behind';
        }

        return {
          ...goal,
          currentValue,
          progress: Math.min(progress, 100),
          progressStatus,
          isAchieved,
          isOverdue,
        };
      })
    );

    res.json(goalsWithProgress);
  } catch (error) {
    console.error('Error fetching goals:', error);
    res.status(500).json({ error: 'Erro ao buscar objetivos' });
  }
}

// Obter resumo de objetivos
export async function getGoalsSummary(req: Request, res: Response) {
  try {
    const goals = await prisma.goal.findMany({
      where: { status: 'active' },
    });

    const goalsWithProgress = await Promise.all(
      goals.map(async (goal) => {
        const currentValue = await calculateCurrentValue(
          goal.metric,
          goal.startDate,
          goal.endDate
        );
        return {
          ...goal,
          currentValue,
          progress: goal.target > 0 ? (currentValue / goal.target) * 100 : 0,
        };
      })
    );

    const achieved = goalsWithProgress.filter((g) => g.currentValue >= g.target).length;
    const onTrack = goalsWithProgress.filter(
      (g) => g.currentValue < g.target && g.progress >= 70
    ).length;
    const behind = goalsWithProgress.filter((g) => g.progress < 70).length;

    const avgProgress =
      goalsWithProgress.length > 0
        ? goalsWithProgress.reduce((sum, g) => sum + g.progress, 0) / goalsWithProgress.length
        : 0;

    res.json({
      total: goals.length,
      achieved,
      onTrack,
      behind,
      avgProgress: Math.round(avgProgress),
    });
  } catch (error) {
    console.error('Error fetching goals summary:', error);
    res.status(500).json({ error: 'Erro ao buscar resumo' });
  }
}

// Criar objetivo
export async function createGoal(req: Request, res: Response) {
  try {
    const validatedData = createGoalSchema.parse(req.body);

    const goal = await prisma.goal.create({
      data: {
        ...validatedData,
        startDate: new Date(validatedData.startDate),
        endDate: new Date(validatedData.endDate),
      },
    });

    res.status(201).json(goal);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error('Error creating goal:', error);
    res.status(500).json({ error: 'Erro ao criar objetivo' });
  }
}

// Atualizar objetivo
export async function updateGoal(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const validatedData = updateGoalSchema.parse(req.body);

    const updateData: any = { ...validatedData };
    if (validatedData.startDate) {
      updateData.startDate = new Date(validatedData.startDate);
    }
    if (validatedData.endDate) {
      updateData.endDate = new Date(validatedData.endDate);
    }

    const goal = await prisma.goal.update({
      where: { id },
      data: updateData,
    });

    res.json(goal);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    if ((error as any).code === 'P2025') {
      return res.status(404).json({ error: 'Objetivo não encontrado' });
    }
    console.error('Error updating goal:', error);
    res.status(500).json({ error: 'Erro ao atualizar objetivo' });
  }
}

// Eliminar objetivo
export async function deleteGoal(req: Request, res: Response) {
  try {
    const { id } = req.params;

    await prisma.goal.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    if ((error as any).code === 'P2025') {
      return res.status(404).json({ error: 'Objetivo não encontrado' });
    }
    console.error('Error deleting goal:', error);
    res.status(500).json({ error: 'Erro ao eliminar objetivo' });
  }
}

// Marcar objetivo como concluído
export async function markGoalAsCompleted(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const goal = await prisma.goal.update({
      where: { id },
      data: { status: 'completed' },
    });

    res.json(goal);
  } catch (error) {
    if ((error as any).code === 'P2025') {
      return res.status(404).json({ error: 'Objetivo não encontrado' });
    }
    console.error('Error marking goal as completed:', error);
    res.status(500).json({ error: 'Erro ao marcar objetivo' });
  }
}
