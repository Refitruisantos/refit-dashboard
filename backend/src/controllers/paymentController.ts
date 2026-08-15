import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const createPaymentSchema = z.object({
  clientId: z.string().min(1, 'Cliente é obrigatório'),
  serviceId: z.string().optional(),
  amount: z.number().positive('Valor deve ser positivo'),
  period: z.string().optional(),
  dueDate: z.string().optional(),
  paidAt: z.string().optional(),
  method: z.enum(['mbway', 'transfer', 'cash', 'card', 'other']).optional(),
  status: z.enum(['paid', 'pending', 'overdue', 'cancelled']).default('pending'),
  notes: z.string().optional(),
});

const updatePaymentSchema = createPaymentSchema.partial().omit({ clientId: true });

export async function getAllPayments(req: Request, res: Response) {
  try {
    const { clientId, status, startDate, endDate } = req.query;

    const where: any = {};

    if (clientId) {
      where.clientId = clientId;
    }

    if (status) {
      where.status = status;
    }

    if (startDate || endDate) {
      where.dueDate = {};
      if (startDate) where.dueDate.gte = new Date(startDate as string);
      if (endDate) where.dueDate.lte = new Date(endDate as string);
    }

    const payments = await prisma.payment.findMany({
      where,
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        service: {
          select: {
            id: true,
            name: true,
            price: true,
          },
        },
      },
      orderBy: {
        dueDate: 'desc',
      },
    });

    res.json(payments);
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ error: 'Erro ao buscar pagamentos' });
  }
}

export async function getPaymentById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const payment = await prisma.payment.findUnique({
      where: { id },
      include: {
        client: true,
      },
    });

    if (!payment) {
      return res.status(404).json({ error: 'Pagamento não encontrado' });
    }

    res.json(payment);
  } catch (error) {
    console.error('Error fetching payment:', error);
    res.status(500).json({ error: 'Erro ao buscar pagamento' });
  }
}

export async function createPayment(req: Request, res: Response) {
  try {
    const validatedData = createPaymentSchema.parse(req.body);

    // Calcular dueDate automaticamente se não for fornecido (dia 8 do mês)
    let dueDate = validatedData.dueDate;
    if (!dueDate && validatedData.period) {
      const [year, month] = validatedData.period.split('-').map(Number);
      dueDate = `${year}-${String(month).padStart(2, '0')}-08`;
    }

    const payment = await prisma.payment.create({
      data: {
        ...validatedData,
        dueDate: dueDate ? new Date(dueDate) : new Date(),
      },
      include: {
        client: true,
      },
    });

    res.status(201).json(payment);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Dados inválidos', details: error.errors });
    }

    console.error('Error creating payment:', error);
    res.status(500).json({ error: 'Erro ao criar pagamento' });
  }
}

export async function updatePayment(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const validatedData = updatePaymentSchema.parse(req.body);

    const payment = await prisma.payment.update({
      where: { id },
      data: {
        ...validatedData,
        dueDate: validatedData.dueDate ? new Date(validatedData.dueDate) : undefined,
      },
      include: {
        client: true,
      },
    });

    res.json(payment);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Dados inválidos', details: error.errors });
    }

    if ((error as any).code === 'P2025') {
      return res.status(404).json({ error: 'Pagamento não encontrado' });
    }

    console.error('Error updating payment:', error);
    res.status(500).json({ error: 'Erro ao atualizar pagamento' });
  }
}

export async function deletePayment(req: Request, res: Response) {
  try {
    const { id } = req.params;

    await prisma.payment.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    if ((error as any).code === 'P2025') {
      return res.status(404).json({ error: 'Pagamento não encontrado' });
    }

    console.error('Error deleting payment:', error);
    res.status(500).json({ error: 'Erro ao eliminar pagamento' });
  }
}

export async function markPaymentAsPaid(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { method, paidAt } = req.body;

    const payment = await prisma.payment.update({
      where: { id },
      data: {
        status: 'paid',
        paidAt: paidAt ? new Date(paidAt) : new Date(),
        method: method || 'cash',
      },
      include: {
        client: true,
      },
    });

    res.json(payment);
  } catch (error) {
    if ((error as any).code === 'P2025') {
      return res.status(404).json({ error: 'Pagamento não encontrado' });
    }

    console.error('Error marking payment as paid:', error);
    res.status(500).json({ error: 'Erro ao marcar pagamento como pago' });
  }
}

export async function getPaymentsSummary(req: Request, res: Response) {
  try {
    const { month, year } = req.query;

    const startDate = month && year 
      ? new Date(parseInt(year as string), parseInt(month as string) - 1, 1)
      : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0, 23, 59, 59);

    const where = {
      dueDate: {
        gte: startDate,
        lte: endDate,
      },
    };

    const [totalReceived, totalPending, totalOverdue, countReceived, countPending] = await Promise.all([
      prisma.payment.aggregate({
        where: { ...where, status: 'paid' },
        _sum: { amount: true },
      }),
      prisma.payment.aggregate({
        where: { ...where, status: 'pending' },
        _sum: { amount: true },
      }),
      prisma.payment.aggregate({
        where: { ...where, status: 'overdue' },
        _sum: { amount: true },
      }),
      prisma.payment.count({
        where: { ...where, status: 'paid' },
      }),
      prisma.payment.count({
        where: { ...where, status: 'pending' },
      }),
    ]);

    res.json({
      totalReceived: totalReceived._sum.amount || 0,
      totalPending: totalPending._sum.amount || 0,
      totalOverdue: totalOverdue._sum.amount || 0,
      countReceived,
      countPending,
    });
  } catch (error) {
    console.error('Error fetching payments summary:', error);
    res.status(500).json({ error: 'Erro ao buscar resumo de pagamentos' });
  }
}
