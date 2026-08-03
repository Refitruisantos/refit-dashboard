import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const createEventSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  category: z.string().min(1, 'Categoria é obrigatória'),
  description: z.string().optional(),
  startDate: z.string(),
  endDate: z.string().optional(),
  startTime: z.string().optional(),
  location: z.string().optional(),
  responsible: z.string().optional(),
  participants: z.string().optional(),
  budgetPlanned: z.number().optional(),
  budgetActual: z.number().optional(),
  status: z.enum(['idea', 'planned', 'confirmed', 'completed', 'cancelled']).default('idea'),
  notes: z.string().optional(),
});

const updateEventSchema = createEventSchema.partial();

export async function getAllEvents(req: Request, res: Response) {
  try {
    const { startDate, endDate, category, status } = req.query;

    const where: any = {};
    
    if (startDate && endDate) {
      where.startDate = {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string),
      };
    }

    if (category) {
      where.category = category;
    }

    if (status) {
      where.status = status;
    }

    const events = await prisma.event.findMany({
      where,
      orderBy: {
        startDate: 'asc',
      },
    });

    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Erro ao buscar eventos' });
  }
}

export async function getEventById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const event = await prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      return res.status(404).json({ error: 'Evento não encontrado' });
    }

    res.json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ error: 'Erro ao buscar evento' });
  }
}

export async function createEvent(req: Request, res: Response) {
  try {
    const validatedData = createEventSchema.parse(req.body);

    const event = await prisma.event.create({
      data: {
        ...validatedData,
        startDate: new Date(validatedData.startDate),
        endDate: validatedData.endDate ? new Date(validatedData.endDate) : undefined,
      },
    });

    res.status(201).json(event);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Dados inválidos', details: error.errors });
    }

    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Erro ao criar evento' });
  }
}

export async function updateEvent(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const validatedData = updateEventSchema.parse(req.body);

    const dataToUpdate: any = { ...validatedData };
    if (validatedData.startDate) {
      dataToUpdate.startDate = new Date(validatedData.startDate);
    }
    if (validatedData.endDate) {
      dataToUpdate.endDate = new Date(validatedData.endDate);
    }

    const event = await prisma.event.update({
      where: { id },
      data: dataToUpdate,
    });

    res.json(event);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Dados inválidos', details: error.errors });
    }

    if ((error as any).code === 'P2025') {
      return res.status(404).json({ error: 'Evento não encontrado' });
    }

    console.error('Error updating event:', error);
    res.status(500).json({ error: 'Erro ao atualizar evento' });
  }
}

export async function deleteEvent(req: Request, res: Response) {
  try {
    const { id } = req.params;

    await prisma.event.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    if ((error as any).code === 'P2025') {
      return res.status(404).json({ error: 'Evento não encontrado' });
    }

    console.error('Error deleting event:', error);
    res.status(500).json({ error: 'Erro ao eliminar evento' });
  }
}

export async function duplicateEvent(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const originalEvent = await prisma.event.findUnique({
      where: { id },
    });

    if (!originalEvent) {
      return res.status(404).json({ error: 'Evento não encontrado' });
    }

    const { id: _, createdAt, updatedAt, ...eventData } = originalEvent;

    const duplicatedEvent = await prisma.event.create({
      data: {
        ...eventData,
        name: `${eventData.name} (Cópia)`,
        status: 'idea',
      },
    });

    res.status(201).json(duplicatedEvent);
  } catch (error) {
    console.error('Error duplicating event:', error);
    res.status(500).json({ error: 'Erro ao duplicar evento' });
  }
}
