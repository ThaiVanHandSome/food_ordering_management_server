import express from 'express'
import {
  addTable,
  checkAvailableTable,
  deleteTable,
  getAllTables,
  leaveTable,
  updateTable
} from '~/controllers/table.controller'
import authMiddleware from '~/middlewares/auth.middleware'
import { wrapAsync } from '~/utils/response'

const router = express.Router()

router.post('/', authMiddleware.verifyAccessToken, authMiddleware.verifyAdmin, wrapAsync(addTable))
router.post('/check-available-table', wrapAsync(checkAvailableTable))
router.get('/', authMiddleware.verifyAccessToken, authMiddleware.verifyAdmin, wrapAsync(getAllTables))
router.post('/leave', wrapAsync(leaveTable))
router.patch('/:id', authMiddleware.verifyAccessToken, authMiddleware.verifyAdmin, wrapAsync(updateTable))
router.delete('/:id', authMiddleware.verifyAccessToken, authMiddleware.verifyAdmin, wrapAsync(deleteTable))

export default router
