import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const updateSettingsSchema = z.object({
  companyName: z.string().optional(),
  companyEmail: z.string().email().optional().or(z.literal('')),
  companyPhone: z.string().optional(),
  companyAddress: z.string().optional(),
  companyNif: z.string().optional(),
  companyWebsite: z.string().optional(),
  companyLogo: z.string().optional(),
  currency: z.string().optional(),
  initialBalance: z.number().optional(),
  initialBalanceDate: z.string().optional(),
  fiscalYear: z.number().optional(),
  dateFormat: z.string().optional(),
  firstDayOfWeek: z.number().min(0).max(6).optional(),
});

const createCategorySchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  type: z.enum(['expense', 'revenue', 'agenda', 'goal']),
  color: z.string().optional(),
  order: z.number().default(0),
});

export async function getSettings(req: Request, res: Response) {
  try {
    let settings = await prisma.settings.findFirst();
    
    if (!settings) {
      settings = await prisma.settings.create({
        data: {},
      });
    }

    res.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Erro ao buscar configurações' });
  }
}

export async function updateSettings(req: Request, res: Response) {
  try {
    const validatedData = updateSettingsSchema.parse(req.body);

    let settings = await prisma.settings.findFirst();

    const updateData: any = { ...validatedData };
    if (validatedData.initialBalanceDate) {
      updateData.initialBalanceDate = new Date(validatedData.initialBalanceDate);
    }

    if (settings) {
      settings = await prisma.settings.update({
        where: { id: settings.id },
        data: updateData,
      });
    } else {
      settings = await prisma.settings.create({
        data: updateData,
      });
    }

    res.json(settings);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error('Error updating settings:', error);
    res.status(500).json({ error: 'Erro ao atualizar configurações' });
  }
}

export async function getCategories(req: Request, res: Response) {
  try {
    const { type } = req.query;

    const where: any = {};
    if (type) where.type = type;

    const categories = await prisma.category.findMany({
      where,
      orderBy: [{ order: 'asc' }, { name: 'asc' }],
    });

    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Erro ao buscar categorias' });
  }
}

export async function createCategory(req: Request, res: Response) {
  try {
    const validatedData = createCategorySchema.parse(req.body);

    const category = await prisma.category.create({
      data: validatedData,
    });

    res.status(201).json(category);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    if ((error as any).code === 'P2002') {
      return res.status(400).json({ error: 'Categoria já existe' });
    }
    console.error('Error creating category:', error);
    res.status(500).json({ error: 'Erro ao criar categoria' });
  }
}

export async function updateCategory(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const validatedData = createCategorySchema.partial().parse(req.body);

    const category = await prisma.category.update({
      where: { id },
      data: validatedData,
    });

    res.json(category);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    if ((error as any).code === 'P2025') {
      return res.status(404).json({ error: 'Categoria não encontrada' });
    }
    console.error('Error updating category:', error);
    res.status(500).json({ error: 'Erro ao atualizar categoria' });
  }
}

export async function toggleCategory(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const category = await prisma.category.findUnique({ where: { id } });
    if (!category) {
      return res.status(404).json({ error: 'Categoria não encontrada' });
    }

    const updated = await prisma.category.update({
      where: { id },
      data: { active: !category.active },
    });

    res.json(updated);
  } catch (error) {
    console.error('Error toggling category:', error);
    res.status(500).json({ error: 'Erro ao alterar estado' });
  }
}

export async function deleteCategory(req: Request, res: Response) {
  try {
    const { id } = req.params;

    await prisma.category.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    if ((error as any).code === 'P2025') {
      return res.status(404).json({ error: 'Categoria não encontrada' });
    }
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'Erro ao eliminar categoria' });
  }
}
