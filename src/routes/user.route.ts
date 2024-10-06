import express from 'express'
import { createUser } from '~/controllers/user.controller'
import authMiddleware from '~/middlewares/auth.middleware'
import { upload, uploadImageToCloudinary } from '~/middlewares/upload.middleware'
import { wrapAsync } from '~/utils/response'
const router = express.Router()

router.post(
  '/create',
  authMiddleware.authUserRules(),
  upload.single('avatar'),
  uploadImageToCloudinary,
  wrapAsync(createUser)
)

export default router
