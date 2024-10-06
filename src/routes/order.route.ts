import express from 'express'
import {
  addOrder,
  deleteOrder,
  findCustomer,
  getStatisticsOrder,
  getStatisticsTable,
  getUserOrder,
  updateOrder
} from '~/controllers/order.controller'
import { wrapAsync } from '~/utils/response'

const router = express.Router()

router.post('/add', wrapAsync(addOrder))
router.get('/', wrapAsync(getUserOrder))
router.get('/statistics', wrapAsync(getStatisticsOrder))
router.get('/statistics-table', wrapAsync(getStatisticsTable))
router.put('/', wrapAsync(updateOrder))
router.delete('/:id', wrapAsync(deleteOrder))
router.get('/customer', wrapAsync(findCustomer))

export default router
