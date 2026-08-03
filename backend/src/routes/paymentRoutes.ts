import { Router } from 'express';
import {
  getAllPayments,
  getPaymentById,
  createPayment,
  updatePayment,
  deletePayment,
  markPaymentAsPaid,
  getPaymentsSummary,
} from '../controllers/paymentController.js';

const router = Router();

router.get('/', getAllPayments);
router.get('/summary', getPaymentsSummary);
router.get('/:id', getPaymentById);
router.post('/', createPayment);
router.put('/:id', updatePayment);
router.delete('/:id', deletePayment);
router.patch('/:id/mark-paid', markPaymentAsPaid);

export default router;
