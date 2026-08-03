import { Router } from 'express';
import {
  getManagementReport,
  getRevenueReport,
  getExpensesReport,
  getClientsReport,
  getServicesReport,
} from '../controllers/reportController.js';

const router = Router();

router.get('/management', getManagementReport);
router.get('/revenue', getRevenueReport);
router.get('/expenses', getExpensesReport);
router.get('/clients', getClientsReport);
router.get('/services', getServicesReport);

export default router;
