import { TokenModel, UserModel } from '~/models'
import bcrypt from 'bcrypt'
import { verifyToken } from '~/utils/jwt'
import { ErrorHandler} from '~/utils/response'
import { STATUS } from '~/constants/httpStatus'
import { omit } from 'lodash'

const createUser = async (userData: UserRequest) => {
  try {
    const { email, password } = userData
    const existUser = await UserModel.findOne({ email })

    if (existUser) {
      throw new ErrorHandler(STATUS.UNPROCESSABLE_ENTITY, {
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

const addUser = async (userData: UserRequest) => {
  try {
    const { email, password } = userData
    const existUser = await UserModel.findOne({ email })

    if (existUser) {
      throw new ErrorHandler(STATUS.UNPROCESSABLE_ENTITY, {
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

const getUsers = async (email: string, role: string) => {
  try {
    const users = await UserModel.find({email, role})
    .select({ password: 0, __v: 0 })
    .lean()
    const response = { 
      message: 'Lấy tất cả người dùng thành công',
      data: users,
    }
    return response;
  } catch (error)
  {
    console.log(error);
    throw error;
  }
}

const updateUser = async (accessToken: string, userReq: UserRequest) => {
  try {
    const existAccessToken = await TokenModel.findOne({token : accessToken})
    if (!existAccessToken) {
      throw new ErrorHandler(STATUS.NOT_FOUND, 'Token không tồn tại')
    }
    const decoded = (await verifyToken(accessToken)) as PayloadToken
    const user = await UserModel.findOne({
      email: decoded.email
    })
    if (!user) {
      throw new ErrorHandler(STATUS.NOT_FOUND, 'Không tìm thấy User')
    }
    const { _id: userId } = user;
    const {avatar, name, password, role} = userReq
    const updateData: any = {}
    if (avatar) {
      updateData.avatar = avatar
    }
    if (name) {
      updateData.name = name
    }
    if (password) {
      updateData.password = password
    }
    if (role) {
      updateData.role = role
    }
    const updatedData = await UserModel.findByIdAndUpdate(
      userId, 
      {$set : updateData},
      {
        new: true,
        runValidators: true
      }
    )
    .select({ password: 0, __v: 0 })
    .lean()
    const response = {
      message: 'Cập nhật user thành công',
      data: updatedData
    }
    return response
  }catch (error) {
    console.log(error)
    throw error
  }

}

const updateUserById = async (userId: string, user : UserRequest) => {
  try {
    const {avatar, name, password, role} = user
    const existUser = await UserModel.findById(userId).lean()
    if (!existUser) {
      throw new ErrorHandler(STATUS.NOT_FOUND, 'User không tồn tại')
    }
    const updateData: any = {}
    if (avatar) {
      updateData.avatar = avatar
    }
    if (name) {
      updateData.name = name
    }
    if (password) {
      updateData.password = password
    }
    if (role) {
      updateData.role = role
    }
    const updatedData = await UserModel.findByIdAndUpdate(
      userId, 
      {$set : updateData},
      {
        new: true,
        runValidators: true
      }
    )
    .select({ password: 0, __v: 0 })
    .lean()
    const response = {
      message: 'Cập nhật user thành công',
      data: updatedData
    }
    return response
  } catch(error) {
    console.log(error)
    throw error;
  }
}

const deleteUser = async (userId: string) => {
  try {
    const userDB = await UserModel.findById(userId).lean()
    if (!userDB) {
      throw new ErrorHandler(STATUS.NOT_FOUND, 'Không tìm thấy người dùng')
    }
    await UserModel.deleteOne({
      _id: userId
    })
    const response = {
      message: 'Xóa user thành công'
    }
    return response
  } catch (error) {
    console.log(error)
    throw error;
  }

}
export default { createUser, getUsers, updateUser, updateUserById, deleteUser }
