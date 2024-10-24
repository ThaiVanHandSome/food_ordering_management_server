import { Request, Response } from 'express'
import userService from '~/services/user.service'
import { responseError, responseSuccess } from '~/utils/response'

export const createUser = async (req: Request, res: Response) => {
  try {
    const user: UserRequest = req.body
    const result = await userService.createUser(user)
    return responseSuccess(res, result)
  } catch (error) {
    return responseError(res, error)
  }
}

export const getUsers = async (req: Request, res: Response) => {
  try {
    const {email, role } = req.body
    const result = await userService.getUsers(email, role)
    return responseSuccess(res, result)
  } catch (error) {
    return responseError(res, error)
  }
}

export const updateUser = async (req: Request, res: Response) => {
  try {
    const accessToken = req.body
    const form : UserRequest = req.body;
    const result = await userService.updateUser(accessToken, form)
    return responseSuccess(res, result)
  } catch (error) {
    return responseError(res, error)
  }
}

export const updateUserById = async (req: Request, res: Response) => {
  try {
    const {id} = req.params
    const form : UserRequest = req.body;
    const result = await userService.updateUser(id, form)
    return responseSuccess(res, result)
  } catch (error) {
    return responseError(res, error)
  }
}

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const {id} = req.params
    const result = await userService.deleteUser(id)
    return responseSuccess(res, result)
  } catch (error) {
    return responseError(res, error)
  }
}
