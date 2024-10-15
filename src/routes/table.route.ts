import express from 'express';
import {
  getAllTables,
  getTableById,
  addTable,
  updateTable,
  deleteTable
} from '../controllers/table.controller';
import { wrapAsync } from '~/utils/response';

const router = express.Router();

router.get('/', wrapAsync(getAllTables));
router.get('/:id', wrapAsync(getTableById));
router.post('/add', wrapAsync(addTable));
router.put('/:id', wrapAsync(updateTable));
router.delete('/:id', wrapAsync(deleteTable));

export default router;
