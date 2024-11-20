import { Request, Response } from 'express'
import authService from '~/services/auth.service'
import { getAccessTokenFromHeader } from '~/utils/jwt'
import { responseSuccess } from '~/utils/response'
import jwt from 'jsonwebtoken'

export const login = async (req: Request, res: Response) => {
  try {
    const loginData: Login = req.body
    const result = await authService.login(loginData)
    return responseSuccess(res, result)
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body
    const result = await authService.refreshToken(refreshToken)
    return responseSuccess(res, result)
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const logout = async (req: Request, res: Response) => {
  try {
    const accessToken = getAccessTokenFromHeader(req)
    const decoded: { email: string } = jwt.decode(accessToken as string) as { email: string }
    const result = await authService.logout(decoded.email)
    return responseSuccess(res, result)
  } catch (error) {
    console.log(error)
    throw error
  }
}
