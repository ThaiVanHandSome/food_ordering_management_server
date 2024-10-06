import { Request, Response } from 'express'
import authService from '~/services/auth.service'
import { responseSuccess } from '~/utils/response'

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
