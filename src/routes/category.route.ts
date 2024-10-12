import express from 'express';
import {
  getAllCategories,
  getCategoryById,
  addCategory,
  updateCategory
} from '../controllers/category.controller';
import { wrapAsync } from '~/utils/response'

const router = express.Router();

router.get('/', wrapAsync(getAllCategories));
router.get('/:id', wrapAsync(getCategoryById));
router.post('/add', wrapAsync(addCategory));
router.put('/:id', wrapAsync(updateCategory));

export default router;