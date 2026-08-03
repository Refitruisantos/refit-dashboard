import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { generateToken, generateRefreshToken, verifyRefreshToken } from '../middleware/auth.js';

const prisma = new PrismaClient();

// Schemas de validação
const registerClientSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  phone: z.string().optional(),
  birthDate: z.string().optional(),
  address: z.string().optional(),
  // GDPR: Consentimentos obrigatórios
  gdprConsent: z.object({
    dataProcessing: z.boolean().refine(val => val === true, {
      message: 'Consentimento para processamento de dados é obrigatório'
    }),
    marketing: z.boolean().optional(),
    dataSharing: z.boolean().optional(),
  }),
});

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
});

// Registro de novo cliente (para app mobile)
export async function registerClient(req: Request, res: Response) {
  try {
    const data = registerClientSchema.parse(req.body);

    // Verificar se email já existe
    const existingClient = await prisma.client.findUnique({
      where: { email: data.email },
    });

    if (existingClient) {
      return res.status(400).json({ error: 'Email já registado' });
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Criar cliente
    const client = await prisma.client.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        birthDate: data.birthDate ? new Date(data.birthDate) : null,
        address: data.address,
        status: 'active',
        notes: JSON.stringify({
          gdprConsent: {
            dataProcessing: data.gdprConsent.dataProcessing,
            marketing: data.gdprConsent.marketing || false,
            dataSharing: data.gdprConsent.dataSharing || false,
            consentDate: new Date().toISOString(),
          },
          password: hashedPassword, // Armazenado em notes por enquanto
        }),
      },
    });

    // Gerar tokens JWT
    const token = generateToken({
      id: client.id,
      email: client.email,
      role: 'client',
    });

    const refreshToken = generateRefreshToken({
      id: client.id,
      email: client.email,
      role: 'client',
    });

    res.status(201).json({
      message: 'Cliente registado com sucesso',
      token,
      refreshToken,
      client: {
        id: client.id,
        name: client.name,
        email: client.email,
        phone: client.phone,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error('Register error:', error);
    res.status(500).json({ error: 'Erro ao registar cliente' });
  }
}

// Login de cliente (para app mobile)
export async function loginClient(req: Request, res: Response) {
  try {
    const data = loginSchema.parse(req.body);

    // Buscar cliente
    const client = await prisma.client.findUnique({
      where: { email: data.email },
    });

    if (!client) {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }

    // Verificar senha
    let storedPassword = '';
    try {
      const notes = JSON.parse(client.notes || '{}');
      storedPassword = notes.password || '';
    } catch {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }

    const isPasswordValid = await bcrypt.compare(data.password, storedPassword);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }

    // Gerar tokens JWT
    const token = generateToken({
      id: client.id,
      email: client.email,
      role: 'client',
    });

    const refreshToken = generateRefreshToken({
      id: client.id,
      email: client.email,
      role: 'client',
    });

    res.json({
      message: 'Login efetuado com sucesso',
      token,
      refreshToken,
      client: {
        id: client.id,
        name: client.name,
        email: client.email,
        phone: client.phone,
        status: client.status,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error('Login error:', error);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
}

// Login de admin (para dashboard web)
export async function loginAdmin(req: Request, res: Response) {
  try {
    const data = loginSchema.parse(req.body);

    // Buscar usuário admin
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }

    // Gerar token JWT
    const token = generateToken({
      id: user.id,
      email: user.email,
      role: 'admin',
    });

    res.json({
      message: 'Login efetuado com sucesso',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    console.error('Admin login error:', error);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
}

// Obter dados GDPR do cliente (direito de acesso)
export async function getClientGDPRData(req: Request, res: Response) {
  try {
    const { clientId } = req.params;

    const client = await prisma.client.findUnique({
      where: { id: clientId },
      include: {
        subscriptions: true,
        payments: true,
        appointments: true,
        attendances: true,
        assessments: true,
        clientGoals: true,
      },
    });

    if (!client) {
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }

    // Retornar todos os dados do cliente (GDPR - direito de acesso)
    res.json({
      personalData: {
        name: client.name,
        email: client.email,
        phone: client.phone,
        birthDate: client.birthDate,
        address: client.address,
        joinedAt: client.joinedAt,
      },
      subscriptions: client.subscriptions,
      payments: client.payments,
      appointments: client.appointments,
      attendances: client.attendances,
      assessments: client.assessments,
      goals: client.clientGoals,
      gdprConsent: JSON.parse(client.notes || '{}').gdprConsent,
    });
  } catch (error) {
    console.error('GDPR data error:', error);
    res.status(500).json({ error: 'Erro ao obter dados' });
  }
}

// Eliminar conta do cliente (GDPR - direito ao esquecimento)
export async function deleteClientAccount(req: Request, res: Response) {
  try {
    const { clientId } = req.params;
    const { confirmation } = req.body;

    if (confirmation !== 'DELETE') {
      return res.status(400).json({ error: 'Confirmação inválida' });
    }

    // Anonimizar dados em vez de eliminar (manter histórico financeiro)
    await prisma.client.update({
      where: { id: clientId },
      data: {
        name: `Cliente Eliminado ${clientId.slice(0, 8)}`,
        email: `deleted_${clientId}@refit.local`,
        phone: null,
        birthDate: null,
        address: null,
        status: 'inactive',
        notes: JSON.stringify({
          deleted: true,
          deletedAt: new Date().toISOString(),
        }),
      },
    });

    res.json({ message: 'Conta eliminada com sucesso' });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ error: 'Erro ao eliminar conta' });
  }
}

// Renovar token de acesso usando refresh token
export async function refreshAccessToken(req: Request, res: Response) {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token não fornecido' });
    }

    // Verificar refresh token
    const decoded = verifyRefreshToken(refreshToken);

    if (!decoded) {
      return res.status(403).json({ error: 'Refresh token inválido ou expirado' });
    }

    // Gerar novo token de acesso
    const newToken = generateToken({
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    });

    res.json({
      message: 'Token renovado com sucesso',
      token: newToken,
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({ error: 'Erro ao renovar token' });
  }
}
