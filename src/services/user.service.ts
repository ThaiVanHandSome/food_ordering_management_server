import { UserModel } from '~/models'
import bcrypt from 'bcrypt'
import { ErrorHandler} from '~/utils/response'
import { STATUS } from '~/constants/httpStatus'
import { omit } from 'lodash'

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
    let { page = 1, limit = 6, email } = query
    page = Number(page)
    limit = Number(limit)
    let condition: any = {}
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
    console.log(id)
    const existUser = await UserModel.findById(id).lean()
    if (!existUser) {
      throw new ErrorHandler(STATUS.NOT_FOUND, 'User không tồn tại')
    }
    // const existUserByEmail = await UserModel.findOne({ email: body.email })
    // if (existUserByEmail) {
    //   throw new ErrorHandler(STATUS.NOT_FOUND, {
    //     message: 'User đã tồn tại'
    //   })
    // }
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
    const updatedUser = await UserModel.findByIdAndUpdate(id, {
      $set: newBody
    })
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


// const deleteUser = async (userId: string) => {
//   try {
//     const user = await UserModel.findById(userId)
//     if (!user) {
//       throw new ErrorHandler(STATUS.NOT_FOUND, 'Không tìm thấy người dùng')
//     }
//     await UserModel.deleteOne({
//       _id: userId
//     })
//     const response = {
//       message: 'Xóa user thành công'
//     }
//     return response
//   } catch (error) {
//     console.log(error)
//     throw error;
//   }

// }
export default { createUser, getAllUser, updateUser}
