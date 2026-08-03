import { Router } from 'express';
import {
  getAllCashFlowMovements,
  getCashFlowSummary,
  createCashFlowMovement,
  updateCashFlowMovement,
  deleteCashFlowMovement,
  getCashFlowChart,
} from '../controllers/cashFlowController.js';

const router = Router();

router.get('/', getAllCashFlowMovements);
router.get('/summary', getCashFlowSummary);
router.get('/chart', getCashFlowChart);
router.post('/', createCashFlowMovement);
router.put('/:id', updateCashFlowMovement);
router.delete('/:id', deleteCashFlowMovement);

export default router;
