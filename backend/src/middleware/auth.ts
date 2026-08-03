import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'refit-secret-key-change-in-production';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: 'admin' | 'client';
  };
}

export function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Token inválido' });
  }
}

export function authenticateAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  authenticateToken(req, res, () => {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ error: 'Acesso negado. Apenas administradores.' });
    }
    next();
  });
}

export function authenticateClient(req: AuthRequest, res: Response, next: NextFunction) {
  authenticateToken(req, res, () => {
    if (req.user?.role !== 'client') {
      return res.status(403).json({ error: 'Acesso negado. Apenas clientes.' });
    }
    next();
  });
}

export function generateToken(user: { id: string; email: string; role: 'admin' | 'client' }) {
  return jwt.sign(user, JWT_SECRET, { expiresIn: '15m' }); // Token de acesso: 15 minutos
}

export function generateRefreshToken(user: { id: string; email: string; role: 'admin' | 'client' }) {
  return jwt.sign(user, JWT_SECRET, { expiresIn: '7d' }); // Refresh token: 7 dias
}

export function verifyRefreshToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: 'admin' | 'client' };
  } catch {
    return null;
  }
}
