import express from 'express'
import { createUser, deleteUser, getUsers, updateUser, updateUserById } from '~/controllers/user.controller'
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

router.get('/', wrapAsync(getUsers));
router.post('/', wrapAsync(createUser));
router.put('/add', wrapAsync(updateUser));
router.put('/:id', wrapAsync(updateUserById));
router.delete('/:id', wrapAsync(deleteUser));

export default router
