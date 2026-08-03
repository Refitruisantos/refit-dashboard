import { Router } from 'express';
import {
  getAllExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
  markExpenseAsPaid,
  getExpensesSummary,
  duplicateExpense,
} from '../controllers/expenseController.js';

const router = Router();

router.get('/', getAllExpenses);
router.get('/summary', getExpensesSummary);
router.get('/:id', getExpenseById);
router.post('/', createExpense);
router.put('/:id', updateExpense);
router.delete('/:id', deleteExpense);
router.patch('/:id/mark-paid', markExpenseAsPaid);
router.post('/:id/duplicate', duplicateExpense);

export default router;
