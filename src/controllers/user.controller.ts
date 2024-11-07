import { Request, Response } from 'express'
import userService from '~/services/user.service'
import { responseSuccess } from '~/utils/response'

export const createUser = async (req: Request, res: Response) => {
  try {
    const user: UserRequest = req.body
    const result = await userService.createUser(user)
    return responseSuccess(res, result)
  } catch (error) {
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