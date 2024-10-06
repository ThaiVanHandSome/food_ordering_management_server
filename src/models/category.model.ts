import mongoose, { Schema } from 'mongoose'

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minLength: 1,
      maxLength: 100
    }
  },
  {
    timestamps: true
  }
)

export const CategoryModel = mongoose.model('categories', categorySchema)
