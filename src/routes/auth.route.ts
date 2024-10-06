import express from 'express'
import { login, refreshToken } from '~/controllers/auth.controller'
import authMiddleware from '~/middlewares/auth.middleware'
import { wrapAsync } from '~/utils/response'

const router = express.Router()

router.post('/login', authMiddleware.authUserRules(), wrapAsync(login))
router.post('/refresh-token', wrapAsync(refreshToken))

export default router
