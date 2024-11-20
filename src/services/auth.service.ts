import { STATUS } from '~/constants/httpStatus'
import { TokenModel, UserModel } from '~/models'
import { compareValue } from '~/utils/crypt'
import { signToken, verifyToken } from '~/utils/jwt'
import { ErrorHandler } from '~/utils/response'
import dotenv from 'dotenv'
import { omit } from 'lodash'
import { tokenTypes } from '~/enums/token.enum'
dotenv.config()

const login = async (loginData: Login) => {
  try {
    const { email, password } = loginData
    const existUser = await UserModel.findOne({ email }).lean()
    if (!existUser) {
      throw new ErrorHandler(STATUS.UNPROCESSABLE_ENTITY, {
        email: 'Email không tồn tại trong hệ thống'
      })
    }
    if (!existUser.isActive) {
      throw new ErrorHandler(
        STATUS.NOT_ACCEPTABLE,
        'Tài khoản đã bị khóa. Xin vui lòng liên hệ quản trị viên để được mở lại tài khoản'
      )
    }
    const match = compareValue(password, existUser.password)
    if (!match) {
      throw new ErrorHandler(STATUS.UNPROCESSABLE_ENTITY, {
        password: 'Password không chính xác'
      })
    }
    const payloadToken: PayloadToken = {
      email,
      role: existUser.role
    }

    await TokenModel.deleteMany({
      user: existUser._id
    })

    const accessToken = await signToken(payloadToken, process.env.EXPIRE_ACCESS_TOKEN as string)
    const refreshToken = await signToken(payloadToken, process.env.EXPIRE_REFRESH_TOKEN as string)
    await new TokenModel({
      token: refreshToken,
      user: existUser._id,
      type: tokenTypes.REFRESH
    }).save()

    const response = {
      message: 'Đăng nhập thành công',
      data: {
        accessToken,
        refreshToken,
        user: omit(existUser, ['password'])
      }
    }
    return response
  } catch (error) {
    console.log(error)
    throw error
  }
}

const refreshToken = async (refreshToken: string) => {
  try {
    const existRefreshToken = await TokenModel.findOne({
      token: refreshToken
    })
    if (!existRefreshToken) {
      throw new ErrorHandler(STATUS.UNAUTHORIZED, 'Token không tồn tại')
    }
    const decoded = (await verifyToken(refreshToken)) as PayloadToken
    const user = await UserModel.findOne({
      email: decoded.email
    })
    if (user) {
      const payload: PayloadToken = {
        email: user.email,
        role: user.role
      }
      const newAccessToken = await signToken(payload, process.env.EXPIRE_ACCESS_TOKEN as string)
      const response = {
        message: 'Refresh token thành công',
        data: {
          accessToken: newAccessToken
        }
      }
      return response
    }
    throw new ErrorHandler(STATUS.UNAUTHORIZED, 'Refresh Token không tồn tại')
  } catch (error) {
    console.log(error)
    throw error
  }
}

const logout = async (email: string) => {
  try {
    const existUser = await UserModel.findOne({ email }).lean()
    if (!existUser) {
      throw new ErrorHandler(STATUS.NOT_FOUND, 'Không tìm thấy người dùng')
    }
    await TokenModel.deleteOne({
      user: existUser._id
    })
    const response = {
      message: 'Đăng xuất thành công'
    }
    return response
  } catch (error) {
    console.log(error)
    throw error
  }
}

export default { login, refreshToken, logout }
