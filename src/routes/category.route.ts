import express from 'express'
import { createCategory, deleteCategory, getAllCategories, updateCategory } from '~/controllers/category.controller'
import authMiddleware from '~/middlewares/auth.middleware'
import { wrapAsync } from '~/utils/response'

const router = express.Router()

router.get('/', wrapAsync(getAllCategories))
router.post('/', authMiddleware.verifyAccessToken, authMiddleware.verifyAdmin, wrapAsync(createCategory))
router.patch('/:id', authMiddleware.verifyAccessToken, authMiddleware.verifyAdmin, wrapAsync(updateCategory))
router.delete('/:id', authMiddleware.verifyAccessToken, authMiddleware.verifyAdmin, wrapAsync(deleteCategory))

export default router
