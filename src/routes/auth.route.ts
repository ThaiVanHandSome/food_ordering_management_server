import express from 'express'
import { login, logout, refreshToken } from '~/controllers/auth.controller'
import authMiddleware from '~/middlewares/auth.middleware'
import { wrapAsync } from '~/utils/response'

const router = express.Router()

router.post('/login', wrapAsync(login))
router.post('/refresh-token', wrapAsync(refreshToken))
router.post('/logout', authMiddleware.verifyAccessToken, wrapAsync(logout))

export default router
