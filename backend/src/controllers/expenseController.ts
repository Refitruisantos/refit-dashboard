import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const createExpenseSchema = z.object({
  description: z.string().min(1, 'Descrição é obrigatória'),
  category: z.string().min(1, 'Categoria é obrigatória'),
  supplier: z.string().optional(),
  amount: z.number().positive('Valor deve ser positivo'),
  expenseDate: z.string(),
  dueDate: z.string(),
  paidAt: z.string().optional(),
  method: z.enum(['mbway', 'transfer', 'cash', 'card', 'debit', 'other']).optional(),
  status: z.enum(['paid', 'pending', 'overdue', 'cancelled']).default('pending'),
  type: z.enum(['fixed', 'variable', 'extraordinary']).default('variable'),
  recurrence: z.enum(['once', 'monthly', 'quarterly', 'biannual', 'annual']).default('once'),
  notes: z.string().optional(),
});

const updateExpenseSchema = createExpenseSchema.partial();

export async function getAllExpenses(req: Request, res: Response) {
  try {
    const { category, status, startDate, endDate } = req.query;

    const where: any = {};

    if (category) {
      where.category = category;
    }

    if (status) {
      where.status = status;
    }

    if (startDate || endDate) {
      where.expenseDate = {};
      if (startDate) where.expenseDate.gte = new Date(startDate as string);
      if (endDate) where.expenseDate.lte = new Date(endDate as string);
    }

    const expenses = await prisma.expense.findMany({
      where,
      orderBy: {
        expenseDate: 'desc',
      },
    });

    res.json(expenses);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ error: 'Erro ao buscar despesas' });
  }
}

export async function getExpenseById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const expense = await prisma.expense.findUnique({
      where: { id },
    });

    if (!expense) {
      return res.status(404).json({ error: 'Despesa não encontrada' });
    }

    res.json(expense);
  } catch (error) {
    console.error('Error fetching expense:', error);
    res.status(500).json({ error: 'Erro ao buscar despesa' });
  }
}

export async function createExpense(req: Request, res: Response) {
  try {
    const validatedData = createExpenseSchema.parse(req.body);

    const expense = await prisma.expense.create({
      data: {
        ...validatedData,
        dueDate: new Date(validatedData.dueDate),
      },
    });

    res.status(201).json(expense);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Dados inválidos', details: error.errors });
    }

    console.error('Error creating expense:', error);
    res.status(500).json({ error: 'Erro ao criar despesa' });
  }
}

export async function updateExpense(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const validatedData = updateExpenseSchema.parse(req.body);

    const expense = await prisma.expense.update({
      where: { id },
      data: {
        ...validatedData,
        dueDate: validatedData.dueDate ? new Date(validatedData.dueDate) : undefined,
      },
    });

    res.json(expense);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Dados inválidos', details: error.errors });
    }

    if ((error as any).code === 'P2025') {
      return res.status(404).json({ error: 'Despesa não encontrada' });
    }

    console.error('Error updating expense:', error);
    res.status(500).json({ error: 'Erro ao atualizar despesa' });
  }
}

export async function deleteExpense(req: Request, res: Response) {
  try {
    const { id } = req.params;

    await prisma.expense.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    if ((error as any).code === 'P2025') {
      return res.status(404).json({ error: 'Despesa não encontrada' });
    }

    console.error('Error deleting expense:', error);
    res.status(500).json({ error: 'Erro ao eliminar despesa' });
  }
}

export async function markExpenseAsPaid(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { paidAt, method } = req.body;

    const expense = await prisma.expense.update({
      where: { id },
      data: {
        status: 'paid',
        paidAt: paidAt ? new Date(paidAt) : new Date(),
        method: method || 'transfer',
      },
    });

    res.json(expense);
  } catch (error) {
    if ((error as any).code === 'P2025') {
      return res.status(404).json({ error: 'Despesa não encontrada' });
    }

    console.error('Error marking expense as paid:', error);
    res.status(500).json({ error: 'Erro ao marcar despesa como paga' });
  }
}

export async function getExpensesSummary(req: Request, res: Response) {
  try {
    const { month, year } = req.query;

    const startDate = month && year 
      ? new Date(parseInt(year as string), parseInt(month as string) - 1, 1)
      : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0, 23, 59, 59);

    // Mês anterior para comparação
    const prevStartDate = new Date(startDate.getFullYear(), startDate.getMonth() - 1, 1);
    const prevEndDate = new Date(startDate.getFullYear(), startDate.getMonth(), 0, 23, 59, 59);

    const where = {
      expenseDate: {
        gte: startDate,
        lte: endDate,
      },
    };

    const prevWhere = {
      expenseDate: {
        gte: prevStartDate,
        lte: prevEndDate,
      },
    };

    const [totalMonth, totalPaid, totalPending, totalOverdue, totalPrevMonth] = await Promise.all([
      prisma.expense.aggregate({
        where,
        _sum: { amount: true },
      }),
      prisma.expense.aggregate({
        where: { ...where, status: 'paid' },
        _sum: { amount: true },
      }),
      prisma.expense.aggregate({
        where: { ...where, status: 'pending' },
        _sum: { amount: true },
      }),
      prisma.expense.aggregate({
        where: { ...where, status: 'overdue' },
        _sum: { amount: true },
      }),
      prisma.expense.aggregate({
        where: prevWhere,
        _sum: { amount: true },
      }),
    ]);

    const currentTotal = totalMonth._sum.amount || 0;
    const previousTotal = totalPrevMonth._sum.amount || 0;
    const variation = previousTotal > 0 
      ? ((currentTotal - previousTotal) / previousTotal) * 100 
      : 0;

    res.json({
      totalMonth: currentTotal,
      totalPaid: totalPaid._sum.amount || 0,
      totalPending: totalPending._sum.amount || 0,
      totalOverdue: totalOverdue._sum.amount || 0,
      variation: parseFloat(variation.toFixed(1)),
    });
  } catch (error) {
    console.error('Error fetching expenses summary:', error);
    res.status(500).json({ error: 'Erro ao buscar resumo de despesas' });
  }
}

export async function duplicateExpense(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const originalExpense = await prisma.expense.findUnique({
      where: { id },
    });

    if (!originalExpense) {
      return res.status(404).json({ error: 'Despesa não encontrada' });
    }

    const { id: _, createdAt, updatedAt, paidAt, ...expenseData } = originalExpense;

    const duplicatedExpense = await prisma.expense.create({
      data: {
        ...expenseData,
        description: `${expenseData.description} (Cópia)`,
        status: 'pending',
        paidAt: null,
      },
    });

    res.status(201).json(duplicatedExpense);
  } catch (error) {
    console.error('Error duplicating expense:', error);
    res.status(500).json({ error: 'Erro ao duplicar despesa' });
  }
}
