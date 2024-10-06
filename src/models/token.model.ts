import mongoose, { Schema } from 'mongoose'
import { tokenTypes } from '~/enums/token.enum'

const tokenSchema = new Schema(
  {
    token: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true
    },
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'users',
      required: true
    },
    type: {
      type: String,
      required: true,
      enum: [tokenTypes.REFRESH, tokenTypes.RESET_PASSWORD, tokenTypes.VERIFY_EMAIL],
      default: tokenTypes.REFRESH
    }
  },
  {
    timestamps: true
  }
)

export const TokenModel = mongoose.model('tokens', tokenSchema)
