import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const createAppointmentSchema = z.object({
  clientId: z.string().min(1, 'Cliente é obrigatório'),
  serviceId: z.string().min(1, 'Serviço é obrigatório'),
  trainerId: z.string().optional(),
  date: z.string(),
  startTime: z.string(),
  duration: z.number().int().positive(),
  status: z.enum(['scheduled', 'confirmed', 'completed', 'cancelled', 'no-show']).default('scheduled'),
  notes: z.string().optional(),
});

const updateAppointmentSchema = createAppointmentSchema.partial();

export async function getAllAppointments(req: Request, res: Response) {
  try {
    const { startDate, endDate, clientId, status } = req.query;

    const where: any = {};
    
    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate as string),
        lte: new Date(endDate as string),
      };
    }

    if (clientId) {
      where.clientId = clientId;
    }

    if (status) {
      where.status = status;
    }

    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        service: {
          select: {
            id: true,
            name: true,
            duration: true,
            price: true,
          },
        },
      },
      orderBy: [
        { date: 'asc' },
        { startTime: 'asc' },
      ],
    });

    res.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({ error: 'Erro ao buscar marcações' });
  }
}

export async function getAppointmentById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const appointment = await prisma.appointment.findUnique({
      where: { id },
      include: {
        client: true,
        service: true,
      },
    });

    if (!appointment) {
      return res.status(404).json({ error: 'Marcação não encontrada' });
    }

    res.json(appointment);
  } catch (error) {
    console.error('Error fetching appointment:', error);
    res.status(500).json({ error: 'Erro ao buscar marcação' });
  }
}

export async function createAppointment(req: Request, res: Response) {
  try {
    const validatedData = createAppointmentSchema.parse(req.body);

    const appointment = await prisma.appointment.create({
      data: {
        ...validatedData,
        date: new Date(validatedData.date),
      },
      include: {
        client: true,
        service: true,
      },
    });

    res.status(201).json(appointment);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Dados inválidos', details: error.errors });
    }

    console.error('Error creating appointment:', error);
    res.status(500).json({ error: 'Erro ao criar marcação' });
  }
}

export async function updateAppointment(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const validatedData = updateAppointmentSchema.parse(req.body);

    const dataToUpdate: any = { ...validatedData };
    if (validatedData.date) {
      dataToUpdate.date = new Date(validatedData.date);
    }

    const appointment = await prisma.appointment.update({
      where: { id },
      data: dataToUpdate,
      include: {
        client: true,
        service: true,
      },
    });

    res.json(appointment);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Dados inválidos', details: error.errors });
    }

    if ((error as any).code === 'P2025') {
      return res.status(404).json({ error: 'Marcação não encontrada' });
    }

    console.error('Error updating appointment:', error);
    res.status(500).json({ error: 'Erro ao atualizar marcação' });
  }
}

export async function deleteAppointment(req: Request, res: Response) {
  try {
    const { id } = req.params;

    await prisma.appointment.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    if ((error as any).code === 'P2025') {
      return res.status(404).json({ error: 'Marcação não encontrada' });
    }

    console.error('Error deleting appointment:', error);
    res.status(500).json({ error: 'Erro ao eliminar marcação' });
  }
}

export async function updateAppointmentStatus(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['scheduled', 'confirmed', 'completed', 'cancelled', 'no-show'].includes(status)) {
      return res.status(400).json({ error: 'Status inválido' });
    }

    const appointment = await prisma.appointment.update({
      where: { id },
      data: { status },
      include: {
        client: true,
        service: true,
      },
    });

    res.json(appointment);
  } catch (error) {
    if ((error as any).code === 'P2025') {
      return res.status(404).json({ error: 'Marcação não encontrada' });
    }

    console.error('Error updating appointment status:', error);
    res.status(500).json({ error: 'Erro ao atualizar status' });
  }
}
