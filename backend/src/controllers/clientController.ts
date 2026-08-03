import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Validation schemas
const createClientSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('Email inválido'),
  phone: z.string().optional(),
  birthDate: z.string().optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
  status: z.enum(['active', 'inactive']).default('active'),
  serviceId: z.string().optional(),
  weeklyFrequency: z.number().int().min(1).max(7).optional(),
});

const updateClientSchema = createClientSchema.partial();

// GET /api/clients - List all clients
export async function getAllClients(req: Request, res: Response) {
  try {
    const { search, status } = req.query;

    const where: any = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { email: { contains: search as string, mode: 'insensitive' } },
      ];
    }

    if (status) {
      where.status = status;
    }

    const clients = await prisma.client.findMany({
      where,
      include: {
        subscriptions: {
          include: {
            service: true,
          },
          where: {
            status: 'active',
          },
        },
        payments: {
          orderBy: {
            dueDate: 'desc',
          },
          take: 5,
        },
        assessments: {
          orderBy: {
            date: 'desc',
          },
          take: 5,
        },
        clientGoals: {
          orderBy: {
            deadline: 'asc',
          },
        },
        _count: {
          select: {
            payments: true,
            attendances: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    res.json(clients);
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({ error: 'Erro ao buscar clientes' });
  }
}

// GET /api/clients/:id - Get single client
export async function getClientById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const client = await prisma.client.findUnique({
      where: { id },
      include: {
        subscriptions: {
          include: {
            service: true,
          },
        },
        payments: {
          orderBy: {
            dueDate: 'desc',
          },
        },
        assessments: {
          orderBy: {
            date: 'desc',
          },
        },
        clientGoals: {
          orderBy: {
            deadline: 'asc',
          },
        },
        attendances: {
          orderBy: {
            date: 'desc',
          },
          take: 10,
          include: {
            service: true,
          },
        },
      },
    });

    if (!client) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }

    res.json(client);
  } catch (error) {
    console.error('Error fetching client:', error);
    res.status(500).json({ error: 'Erro ao buscar cliente' });
  }
}

// POST /api/clients - Create new client
export async function createClient(req: Request, res: Response) {
  try {
    const validatedData = createClientSchema.parse(req.body);
    const { serviceId, weeklyFrequency, ...clientData } = validatedData;

    // Criar cliente
    const client = await prisma.client.create({
      data: {
        ...clientData,
        birthDate: clientData.birthDate ? new Date(clientData.birthDate) : undefined,
      },
    });

    // Se foi selecionado um serviço, criar subscrição
    if (serviceId && weeklyFrequency) {
      const service = await prisma.service.findUnique({
        where: { id: serviceId },
      });

      if (service) {
        // Calcular preço baseado na frequência semanal
        const monthlyPrice = service.price * weeklyFrequency * 4; // 4 semanas por mês

        await prisma.subscription.create({
          data: {
            clientId: client.id,
            serviceId: service.id,
            startDate: new Date(),
            price: monthlyPrice,
            status: 'active',
          },
        });
      }
    }

    // Buscar cliente com todas as relações
    const clientWithRelations = await prisma.client.findUnique({
      where: { id: client.id },
      include: {
        subscriptions: {
          include: {
            service: true,
          },
        },
        payments: true,
        assessments: true,
        clientGoals: true,
      },
    });

    res.status(201).json(clientWithRelations);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Dados inválidos', details: error.errors });
    }
    
    if ((error as any).code === 'P2002') {
      return res.status(409).json({ error: 'Email já está em uso' });
    }

    console.error('Error creating client:', error);
    res.status(500).json({ error: 'Erro ao criar cliente' });
  }
}

// PUT /api/clients/:id - Update client
export async function updateClient(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const validatedData = updateClientSchema.parse(req.body);

    const client = await prisma.client.update({
      where: { id },
      data: {
        ...validatedData,
        birthDate: validatedData.birthDate ? new Date(validatedData.birthDate) : undefined,
      },
      include: {
        subscriptions: {
          include: {
            service: true,
          },
        },
        payments: true,
        assessments: true,
        clientGoals: true,
      },
    });

    res.json(client);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Dados inválidos', details: error.errors });
    }

    if ((error as any).code === 'P2025') {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }

    if ((error as any).code === 'P2002') {
      return res.status(409).json({ error: 'Email já está em uso' });
    }

    console.error('Error updating client:', error);
    res.status(500).json({ error: 'Erro ao atualizar cliente' });
  }
}

// DELETE /api/clients/:id - Delete client
export async function deleteClient(req: Request, res: Response) {
  try {
    const { id } = req.params;

    await prisma.client.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    if ((error as any).code === 'P2025') {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }

    console.error('Error deleting client:', error);
    res.status(500).json({ error: 'Erro ao eliminar cliente' });
  }
}

// PATCH /api/clients/:id/status - Toggle client status
export async function toggleClientStatus(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const client = await prisma.client.findUnique({
      where: { id },
      select: { status: true },
    });

    if (!client) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }

    const updatedClient = await prisma.client.update({
      where: { id },
      data: {
        status: client.status === 'active' ? 'inactive' : 'active',
      },
    });

    res.json(updatedClient);
  } catch (error) {
    console.error('Error toggling client status:', error);
    res.status(500).json({ error: 'Erro ao alterar status do cliente' });
  }
}
