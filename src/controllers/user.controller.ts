import { Request, Response } from 'express'
import { STATUS } from '~/constants/httpStatus'
import userService from '~/services/user.service'

export const createUser = async (req: Request, res: Response) => {
  try {
    const user: UserRequest = req.body
    const result = await userService.createUser(user)
    return res.status(STATUS.OK).json(result)
  } catch (error) {
    console.log(error)
    throw error
  }
}
