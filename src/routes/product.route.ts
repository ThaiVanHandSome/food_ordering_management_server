import express from 'express'
import { addProduct, deleteProduct, getProducts, increaseView, updateProduct } from '~/controllers/product.controller'
import authMiddleware from '~/middlewares/auth.middleware'
import { upload, uploadImageToCloudinary } from '~/middlewares/upload.middleware'
import { wrapAsync } from '~/utils/response'

const router = express.Router()

router.post(
  '/',
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyAdmin,
  upload.single('image'),
  uploadImageToCloudinary,
  wrapAsync(addProduct)
)
router.patch(
  '/:id',
  authMiddleware.verifyAccessToken,
  authMiddleware.verifyAdmin,
  upload.single('image'),
  uploadImageToCloudinary,
  wrapAsync(updateProduct)
)
router.get('/', wrapAsync(getProducts))
router.patch('/:id/increase-view', wrapAsync(increaseView))
router.delete('/:id', authMiddleware.verifyAccessToken, authMiddleware.verifyAdmin, wrapAsync(deleteProduct))

export default router
