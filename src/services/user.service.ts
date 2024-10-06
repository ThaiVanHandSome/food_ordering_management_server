import { UserModel } from '~/models'
import bcrypt from 'bcrypt'
import { ErrorHandler, responseSuccess } from '~/utils/response'
import { STATUS } from '~/constants/httpStatus'
import { omit } from 'lodash'

const createUser = async (userData: UserRequest) => {
  try {
    const { email, password } = userData
    const existUser = await UserModel.findOne({ email })

    if (existUser) {
      throw new ErrorHandler(STATUS.NOT_FOUND, {
        message: 'User không tồn tại'
      })
    }

    const encryptPassword = bcrypt.hashSync(password, 12)
    const newUser = await UserModel.create({
      ...userData,
      password: encryptPassword,
      avatar: userData.cloudinaryUrl
    })

    const response = {
      message: 'Tạo user thành công',
      data: omit(newUser, ['password'])
    }

    return response
  } catch (err) {
    console.error(err)
    throw err
  }
}

export default { createUser }
