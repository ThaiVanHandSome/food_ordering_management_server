import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { ErrorHandler } from '~/utils/response'
import { STATUS } from '~/constants/httpStatus'
import { Request } from 'express'
dotenv.config()

export const signToken = (payload: string | object | Buffer, token_life: number | string) => {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, process.env.SECRET_KEY as string, { expiresIn: token_life }, (error, token) => {
      if (error) reject(error)
      resolve(token)
    })
  })
}

export const verifyToken = (token: string) => {
  return new Promise<string | object>((resolve, reject) => {
    jwt.verify(token, process.env.SECRET_KEY as string, (error, decoded) => {
      if (error) {
        if (error.name === 'TokenExpiredError') {
          reject(
            new ErrorHandler(STATUS.UNAUTHORIZED, {
              message: 'Token hết hạn',
              name: 'EXPIRED_TOKEN'
            })
          )
        } else {
          reject(
            new ErrorHandler(STATUS.UNAUTHORIZED, {
              message: 'Token không đúng'
            })
          )
        }
      }
      resolve(decoded as object)
    })
  })
}

export const getAccessTokenFromHeader = (req: Request) => {
  const authHeader = req.headers['authorization']
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7, authHeader.length)
  }
  return null
}
