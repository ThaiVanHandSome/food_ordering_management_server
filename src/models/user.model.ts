import mongoose, { Schema } from 'mongoose'
import { ROLE } from '~/enums/role.enum'

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minLength: 3,
      maxLength: 20
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minLength: 6,
      private: true
    },
    avatar: {
      type: String,
      required: true,
      trim: true,
      minLength: 1,
      maxLength: 1000
    },
    role: {
      type: String,
      required: true,
      enum: [ROLE.EMPLOYEE, ROLE.ADMIN],
      default: ROLE.EMPLOYEE
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true
    }
  },
  {
    timestamps: true
  }
)

export const UserModel = mongoose.model('users', userSchema)
