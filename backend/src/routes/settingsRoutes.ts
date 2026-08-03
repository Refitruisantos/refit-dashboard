import { Router } from 'express';
import {
  getSettings,
  updateSettings,
  getCategories,
  createCategory,
  updateCategory,
  toggleCategory,
  deleteCategory,
} from '../controllers/settingsController.js';

const router = Router();

router.get('/', getSettings);
router.put('/', updateSettings);

router.get('/categories', getCategories);
router.post('/categories', createCategory);
router.put('/categories/:id', updateCategory);
router.patch('/categories/:id/toggle', toggleCategory);
router.delete('/categories/:id', deleteCategory);

export default router;
