import { Router } from 'express';
import {
  getAllGoals,
  getGoalsSummary,
  createGoal,
  updateGoal,
  deleteGoal,
  markGoalAsCompleted,
} from '../controllers/goalController.js';

const router = Router();

router.get('/', getAllGoals);
router.get('/summary', getGoalsSummary);
router.post('/', createGoal);
router.put('/:id', updateGoal);
router.delete('/:id', deleteGoal);
router.patch('/:id/complete', markGoalAsCompleted);

export default router;
