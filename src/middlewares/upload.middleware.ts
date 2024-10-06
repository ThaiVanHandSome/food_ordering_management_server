import multer, { Multer } from 'multer'
import dotenv from 'dotenv'
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary'
import { Request, Response, NextFunction } from 'express'

dotenv.config()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

interface CloudinaryFile extends Express.Multer.File {
  buffer: Buffer
}

const storage = multer.memoryStorage()
export const upload: Multer = multer({ storage: storage })

export const uploadImageToCloudinary = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const file: CloudinaryFile = req.file as CloudinaryFile
    if (!file) return next()
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'image',
        folder: 'food_ordering'
      },
      (err: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
        if (err) {
          console.error('Cloudinary upload error:', err)
          return next(err)
        }
        if (!result) {
          console.error('Cloudinary upload error: Result is undefined')
          return next(new Error('Cloudinary upload result is undefined'))
        }
        req.body.cloudinaryUrl = result.secure_url
        next()
      }
    )
    uploadStream.end(file.buffer)
  } catch (error) {
    console.error('Error in uploadToCloudinary middleware:', error)
    next(error)
  }
}
