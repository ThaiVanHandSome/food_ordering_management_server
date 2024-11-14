import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import userService from '~/services/user.service'
import { getAccessTokenFromHeader } from '~/utils/jwt'
import { responseSuccess } from '~/utils/response'

export const createUser = async (req: Request, res: Response) => {
  try {
    const user: UserRequest = req.body
    const result = await userService.createUser(user)
    return responseSuccess(res, result)
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const getUsers = async (req: Request, res: Response) => {
  try {
    const query = req.query
    const result = await userService.getAllUser(query as unknown as UserQuery)
    return responseSuccess(res, result)
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const body = req.body
    const result = await userService.updateUser(id, body)
    return responseSuccess(res, result)
  } catch (error) {
    console.log(error)
    throw error
  }
}

// export const deleteUser = async (req: Request, res: Response) => {
//   try {
//     const {id} = req.params
//     const result = await userService.deleteUser(id)
//     return responseSuccess(res, result)
//   } catch (error) {
//     return responseError(res, error)
//   }
// }

export const getMe = async (req: Request, res: Response) => {
  try {
    const accessToken = getAccessTokenFromHeader(req)
    const decoded: { email: string } = jwt.decode(accessToken as string) as { email: string }
    const result = await userService.getMe(decoded?.email)
    return responseSuccess(res, result)
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const updateMe = async (req: Request, res: Response) => {
  try {
    const accessToken = getAccessTokenFromHeader(req)
    const decoded: { email: string } = jwt.decode(accessToken as string) as { email: string }
    const body: UpdateMe = req.body
    const result = await userService.updateMe(decoded.email, body)
    return responseSuccess(res, result)
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const updateMyPassword = async (req: Request, res: Response) => {
  try {
    const accessToken = getAccessTokenFromHeader(req)
    const decoded: { email: string } = jwt.decode(accessToken as string) as { email: string }
    const body: ChangePassword = req.body
    const result = await userService.updateMyPassword(decoded.email, body)
    return responseSuccess(res, result)
  } catch (error) {
    console.log(error)
    throw error
  }
}
