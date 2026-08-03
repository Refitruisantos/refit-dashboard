import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const createCashFlowSchema = z.object({
  type: z.enum(['inflow', 'outflow']),
  description: z.string().min(1, 'Descrição é obrigatória'),
  category: z.string().optional(),
  amount: z.number().positive('Valor deve ser positivo'),
  date: z.string(),
  method: z.string().optional(),
  status: z.enum(['realized', 'forecast']).default('realized'),
  notes: z.string().optional(),
});

const updateCashFlowSchema = createCashFlowSchema.partial();

// Obter todos os movimentos (automáticos + manuais)
export async function getAllCashFlowMovements(req: Request, res: Response) {
  try {
    const { startDate, endDate, type, status } = req.query;

    const start = startDate ? new Date(startDate as string) : new Date(new Date().getFullYear(), 0, 1);
    const end = endDate ? new Date(endDate as string) : new Date();

    // Movimentos manuais
    const manualWhere: any = {
      date: { gte: start, lte: end },
    };
    if (type) manualWhere.type = type;
    if (status) manualWhere.status = status;

    const manualMovements = await prisma.cashFlow.findMany({
      where: manualWhere,
      orderBy: { date: 'desc' },
    });

    // Pagamentos (entradas automáticas)
    const paymentsWhere: any = {
      dueDate: { gte: start, lte: end },
    };

    const payments = await prisma.payment.findMany({
      where: paymentsWhere,
      include: {
        client: { select: { name: true } },
        service: { select: { name: true } },
      },
      orderBy: { dueDate: 'desc' },
    });

    // Despesas (saídas automáticas)
    const expensesWhere: any = {
      expenseDate: { gte: start, lte: end },
    };

    const expenses = await prisma.expense.findMany({
      where: expensesWhere,
      orderBy: { expenseDate: 'desc' },
    });

    // Converter pagamentos para formato de movimento
    const paymentMovements = payments.map(payment => ({
      id: `payment-${payment.id}`,
      type: 'inflow',
      description: `Pagamento - ${payment.client?.name || 'Cliente'}`,
      category: payment.service?.name || 'Serviço',
      amount: payment.amount,
      date: payment.paidAt || payment.dueDate,
      method: payment.method,
      status: payment.status === 'paid' ? 'realized' : 'forecast',
      origin: 'payment',
      notes: payment.notes,
      createdAt: payment.createdAt,
    }));

    // Converter despesas para formato de movimento
    const expenseMovements = expenses.map(expense => ({
      id: `expense-${expense.id}`,
      type: 'outflow',
      description: expense.description,
      category: expense.category,
      amount: expense.amount,
      date: expense.paidAt || expense.expenseDate,
      method: expense.method,
      status: expense.status === 'paid' ? 'realized' : 'forecast',
      origin: 'expense',
      notes: expense.notes,
      createdAt: expense.createdAt,
    }));

    // Converter movimentos manuais
    const manualMovementsFormatted = manualMovements.map(movement => ({
      ...movement,
      origin: 'manual',
    }));

    // Combinar todos os movimentos
    const allMovements = [
      ...paymentMovements,
      ...expenseMovements,
      ...manualMovementsFormatted,
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    res.json(allMovements);
  } catch (error) {
    console.error('Error fetching cash flow movements:', error);
    res.status(500).json({ error: 'Erro ao buscar movimentos' });
  }
}

// Resumo do Fluxo de Caixa
export async function getCashFlowSummary(req: Request, res: Response) {
  try {
    const { month, year } = req.query;

    const currentMonth = month ? parseInt(month as string) : new Date().getMonth() + 1;
    const currentYear = year ? parseInt(year as string) : new Date().getFullYear();

    const startDate = new Date(currentYear, currentMonth - 1, 1);
    const endDate = new Date(currentYear, currentMonth, 0, 23, 59, 59);

    // Entradas realizadas (pagamentos pagos)
    const realizedInflows = await prisma.payment.aggregate({
      where: {
        paidAt: { gte: startDate, lte: endDate },
        status: 'paid',
      },
      _sum: { amount: true },
    });

    // Entradas previstas (pagamentos pendentes)
    const forecastInflows = await prisma.payment.aggregate({
      where: {
        dueDate: { gte: startDate, lte: endDate },
        status: { in: ['pending', 'overdue'] },
      },
      _sum: { amount: true },
    });

    // Saídas realizadas (despesas pagas)
    const realizedOutflows = await prisma.expense.aggregate({
      where: {
        paidAt: { gte: startDate, lte: endDate },
        status: 'paid',
      },
      _sum: { amount: true },
    });

    // Saídas previstas (despesas pendentes)
    const forecastOutflows = await prisma.expense.aggregate({
      where: {
        expenseDate: { gte: startDate, lte: endDate },
        status: { in: ['pending', 'overdue'] },
      },
      _sum: { amount: true },
    });

    // Movimentos manuais realizados
    const [manualInflowsRealized, manualOutflowsRealized] = await Promise.all([
      prisma.cashFlow.aggregate({
        where: {
          date: { gte: startDate, lte: endDate },
          type: 'inflow',
          status: 'realized',
        },
        _sum: { amount: true },
      }),
      prisma.cashFlow.aggregate({
        where: {
          date: { gte: startDate, lte: endDate },
          type: 'outflow',
          status: 'realized',
        },
        _sum: { amount: true },
      }),
    ]);

    // Movimentos manuais previstos
    const [manualInflowsForecast, manualOutflowsForecast] = await Promise.all([
      prisma.cashFlow.aggregate({
        where: {
          date: { gte: startDate, lte: endDate },
          type: 'inflow',
          status: 'forecast',
        },
        _sum: { amount: true },
      }),
      prisma.cashFlow.aggregate({
        where: {
          date: { gte: startDate, lte: endDate },
          type: 'outflow',
          status: 'forecast',
        },
        _sum: { amount: true },
      }),
    ]);

    // Calcular totais
    const totalRealizedInflows = (realizedInflows._sum.amount || 0) + (manualInflowsRealized._sum.amount || 0);
    const totalForecastInflows = (forecastInflows._sum.amount || 0) + (manualInflowsForecast._sum.amount || 0);
    const totalRealizedOutflows = (realizedOutflows._sum.amount || 0) + (manualOutflowsRealized._sum.amount || 0);
    const totalForecastOutflows = (forecastOutflows._sum.amount || 0) + (manualOutflowsForecast._sum.amount || 0);

    const currentBalance = totalRealizedInflows - totalRealizedOutflows;
    const netCashFlow = currentBalance;
    const forecastBalance = currentBalance + totalForecastInflows - totalForecastOutflows;

    res.json({
      period: { month: currentMonth, year: currentYear },
      currentBalance,
      inflows: {
        realized: totalRealizedInflows,
        forecast: totalForecastInflows,
        total: totalRealizedInflows + totalForecastInflows,
      },
      outflows: {
        realized: totalRealizedOutflows,
        forecast: totalForecastOutflows,
        total: totalRealizedOutflows + totalForecastOutflows,
      },
      netCashFlow,
      forecastBalance,
    });
  } catch (error) {
    console.error('Error calculating cash flow summary:', error);
    res.status(500).json({ error: 'Erro ao calcular resumo' });
  }
}

// Criar movimento manual
export async function createCashFlowMovement(req: Request, res: Response) {
  try {
    const validatedData = createCashFlowSchema.parse(req.body);

    const movement = await prisma.cashFlow.create({
      data: {
        ...validatedData,
        date: new Date(validatedData.date),
      },
    });

    res.status(201).json(movement);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error('Error creating cash flow movement:', error);
    res.status(500).json({ error: 'Erro ao criar movimento' });
  }
}

// Atualizar movimento manual
export async function updateCashFlowMovement(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const validatedData = updateCashFlowSchema.parse(req.body);

    const updateData: any = { ...validatedData };
    if (validatedData.date) {
      updateData.date = new Date(validatedData.date);
    }

    const movement = await prisma.cashFlow.update({
      where: { id },
      data: updateData,
    });

    res.json(movement);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    if ((error as any).code === 'P2025') {
      return res.status(404).json({ error: 'Movimento não encontrado' });
    }
    console.error('Error updating cash flow movement:', error);
    res.status(500).json({ error: 'Erro ao atualizar movimento' });
  }
}

// Eliminar movimento manual
export async function deleteCashFlowMovement(req: Request, res: Response) {
  try {
    const { id } = req.params;

    await prisma.cashFlow.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    if ((error as any).code === 'P2025') {
      return res.status(404).json({ error: 'Movimento não encontrado' });
    }
    console.error('Error deleting cash flow movement:', error);
    res.status(500).json({ error: 'Erro ao eliminar movimento' });
  }
}

// Gráfico de Fluxo de Caixa
export async function getCashFlowChart(req: Request, res: Response) {
  try {
    const { period = 'month', year } = req.query;
    const currentYear = year ? parseInt(year as string) : new Date().getFullYear();

    let data: any[] = [];

    if (period === 'month') {
      // Dados mensais do ano
      for (let month = 1; month <= 12; month++) {
        const startDate = new Date(currentYear, month - 1, 1);
        const endDate = new Date(currentYear, month, 0, 23, 59, 59);

        const [inflows, outflows] = await Promise.all([
          prisma.payment.aggregate({
            where: { paidAt: { gte: startDate, lte: endDate }, status: 'paid' },
            _sum: { amount: true },
          }),
          prisma.expense.aggregate({
            where: { paidAt: { gte: startDate, lte: endDate }, status: 'paid' },
            _sum: { amount: true },
          }),
        ]);

        const inflowAmount = inflows._sum.amount || 0;
        const outflowAmount = outflows._sum.amount || 0;

        data.push({
          period: `${currentYear}-${String(month).padStart(2, '0')}`,
          inflows: inflowAmount,
          outflows: outflowAmount,
          balance: inflowAmount - outflowAmount,
        });
      }
    }

    res.json(data);
  } catch (error) {
    console.error('Error generating cash flow chart:', error);
    res.status(500).json({ error: 'Erro ao gerar gráfico' });
  }
}
