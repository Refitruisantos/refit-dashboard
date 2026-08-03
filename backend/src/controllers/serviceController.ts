import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const createServiceSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().optional(),
  price: z.number().positive('Preço deve ser positivo'),
  duration: z.number().positive('Duração deve ser positiva'),
  active: z.boolean().default(true),
});

const updateServiceSchema = createServiceSchema.partial();

export async function getAllServices(req: Request, res: Response) {
  try {
    const { active } = req.query;

    const where: any = {};
    
    if (active !== undefined) {
      where.active = active === 'true';
    }

    const services = await prisma.service.findMany({
      where,
      orderBy: {
        name: 'asc',
      },
    });

    res.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ error: 'Erro ao buscar serviços' });
  }
}

export async function getServiceById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const service = await prisma.service.findUnique({
      where: { id },
    });

    if (!service) {
      return res.status(404).json({ error: 'Serviço não encontrado' });
    }

    res.json(service);
  } catch (error) {
    console.error('Error fetching service:', error);
    res.status(500).json({ error: 'Erro ao buscar serviço' });
  }
}

export async function createService(req: Request, res: Response) {
  try {
    const validatedData = createServiceSchema.parse(req.body);

    const existingService = await prisma.service.findUnique({
      where: { name: validatedData.name },
    });

    if (existingService) {
      return res.status(409).json({ error: 'Já existe um serviço com este nome' });
    }

    const service = await prisma.service.create({
      data: validatedData,
    });

    res.status(201).json(service);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Dados inválidos', details: error.errors });
    }

    console.error('Error creating service:', error);
    res.status(500).json({ error: 'Erro ao criar serviço' });
  }
}

export async function updateService(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const validatedData = updateServiceSchema.parse(req.body);

    const service = await prisma.service.update({
      where: { id },
      data: validatedData,
    });

    res.json(service);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Dados inválidos', details: error.errors });
    }

    if ((error as any).code === 'P2025') {
      return res.status(404).json({ error: 'Serviço não encontrado' });
    }

    console.error('Error updating service:', error);
    res.status(500).json({ error: 'Erro ao atualizar serviço' });
  }
}

export async function deleteService(req: Request, res: Response) {
  try {
    const { id } = req.params;

    await prisma.service.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    if ((error as any).code === 'P2025') {
      return res.status(404).json({ error: 'Serviço não encontrado' });
    }

    console.error('Error deleting service:', error);
    res.status(500).json({ error: 'Erro ao eliminar serviço' });
  }
}

export async function toggleServiceStatus(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const service = await prisma.service.findUnique({
      where: { id },
    });

    if (!service) {
      return res.status(404).json({ error: 'Serviço não encontrado' });
    }

    const updated = await prisma.service.update({
      where: { id },
      data: { active: !service.active },
    });

    res.json(updated);
  } catch (error) {
    console.error('Error toggling service status:', error);
    res.status(500).json({ error: 'Erro ao alterar status do serviço' });
  }
}
