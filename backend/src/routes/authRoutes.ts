import { Router } from 'express';
import {
  registerClient,
  loginClient,
  loginAdmin,
  getClientGDPRData,
  deleteClientAccount,
  refreshAccessToken,
} from '../controllers/authController.js';
import { authenticateClient, authenticateAdmin } from '../middleware/auth.js';

const router = Router();

// Rotas públicas
router.post('/auth/register', registerClient);
router.post('/auth/login/client', loginClient);
router.post('/auth/login/admin', loginAdmin);
router.post('/auth/refresh', refreshAccessToken);

// Rotas protegidas - Cliente
router.get('/auth/gdpr/:clientId', authenticateClient, getClientGDPRData);
router.delete('/auth/account/:clientId', authenticateClient, deleteClientAccount);

export default router;
