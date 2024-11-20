import { UserModel } from '~/models'
import bcrypt from 'bcrypt'
import { ErrorHandler } from '~/utils/response'
import { STATUS } from '~/constants/httpStatus'
import { omit } from 'lodash'
import { compareValue } from '~/utils/crypt'

const createUser = async (userData: UserRequest) => {
  try {
    const { email, password } = userData
    const existUser = await UserModel.findOne({ email })

    if (existUser) {
      throw new ErrorHandler(STATUS.NOT_FOUND, {
        message: 'User đã tồn tại'
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

const getAllUser = async (query: UserQuery) => {
  try {
    // eslint-disable-next-line prefer-const
    let { page = 1, limit = 6, email } = query
    page = Number(page)
    limit = Number(limit)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const condition: any = {}
    if (email) {
      condition.email = email
    }
    const users = await UserModel.find(condition)
      .limit(limit)
      .skip(page * limit - limit)
    const totalUsers = await UserModel.find(condition).countDocuments().lean()
    const page_size = Math.ceil(totalUsers / limit) || 1
    const response = {
      message: 'Lấy tất cả nhân viên thành công',
      data: {
        content: users,
        pagination: {
          page,
          limit,
          pageSize: page_size,
          total: totalUsers
        }
      }
    }
    return response
  } catch (error) {
    console.log(error)
    throw error
  }
}

const updateUser = async (id: string, body: UserRequest) => {
  try {
    const existUser = await UserModel.findById(id).lean()
    if (!existUser) {
      throw new ErrorHandler(STATUS.NOT_FOUND, 'User không tồn tại')
    }
    let newBody = { ...body }
    if (body.cloudinaryUrl) {
      newBody = {
        ...body,
        avatar: body.cloudinaryUrl
      }
    }
    if (body.password) {
      const encryptPassword = bcrypt.hashSync(body.password, 12)
      newBody = {
        ...body,
        password: encryptPassword
      }
    }
    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      {
        $set: newBody
      },
      { new: true }
    )
    const response = {
      message: 'Cập nhật người dùng thành công',
      data: updatedUser
    }
    return response
  } catch (error) {
    console.log(error)
    throw error
  }
}

const getMe = async (email: string) => {
  try {
    const existUser = await UserModel.findOne({ email }).lean()
    if (!existUser) {
      throw new ErrorHandler(STATUS.NOT_FOUND, 'Không tìm thấy người dùng')
    }
    const response = {
      message: 'Lấy thông tin người dùng thành công',
      data: omit(existUser, ['password'])
    }
    return response
  } catch (error) {
    console.log(error)
    throw error
  }
}

const updateMe = async (email: string, body: UpdateMe) => {
  try {
    const existUser = await UserModel.findOne({ email }).lean()
    if (!existUser) {
      throw new ErrorHandler(STATUS.NOT_FOUND, 'Không tìm thấy người dùng')
    }
    let newBody = { ...body }
    if (body.cloudinaryUrl) {
      newBody = {
        ...newBody,
        avatar: body.cloudinaryUrl
      }
    }
    const newUser = await UserModel.findByIdAndUpdate(
      existUser._id,
      {
        $set: newBody
      },
      { new: true }
    ).lean()
    const response = {
      message: 'Cập nhật thông tin thành công',
      data: newUser
    }
    return response
  } catch (error) {
    console.log(error)
    throw error
  }
}

const updateMyPassword = async (email: string, body: ChangePassword) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = body
    const existUser = await UserModel.findOne({ email }).lean()
    if (!existUser) {
      throw new ErrorHandler(STATUS.NOT_FOUND, 'Không tìm thấy người dùng')
    }
    const match = compareValue(oldPassword, existUser.password)
    if (!match) {
      throw new ErrorHandler(STATUS.UNPROCESSABLE_ENTITY, {
        oldPassword: 'Password không chính xác'
      })
    }
    if (newPassword !== confirmPassword) {
      throw new ErrorHandler(STATUS.UNPROCESSABLE_ENTITY, {
        confirmPassword: 'Password không khớp'
      })
    }
    const encryptPassword = bcrypt.hashSync(newPassword, 12)
    const newUser = await UserModel.findByIdAndUpdate(existUser._id, {
      $set: {
        password: encryptPassword
      }
    })
    const response = {
      message: 'Đổi mật khẩu thành công',
      data: newUser
    }
    return response
  } catch (error) {
    console.log(error)
    throw error
  }
}

export default { createUser, getAllUser, updateUser, getMe, updateMe, updateMyPassword }
