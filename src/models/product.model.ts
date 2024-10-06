import mongoose, { Schema } from 'mongoose'
import { productStatus } from '~/enums/productStatus.enum'

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minLength: 1,
      maxLength: 1000
    },
    price: {
      type: Number,
      required: true,
      min: [1, 'Price must be greater than 0']
    },
    sold: {
      type: Number,
      required: true,
      min: [0, 'Sold must be greater or equal than 0'],
      default: 0
    },
    view: {
      type: Number,
      required: true,
      min: [0, 'View must be greater or equal than 0'],
      default: 0
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minLength: 1,
      maxLength: 1000
    },
    status: {
      type: String,
      required: true,
      enum: [productStatus.AVAILABLE, productStatus.UNAVAILABLE],
      default: productStatus.AVAILABLE
    },
    image: {
      type: String,
      required: true,
      trim: true,
      minLength: 1,
      maxLength: 1000
    },
    category: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'categories'
    }
  },
  {
    timestamps: true
  }
)

export const ProductModel = mongoose.model('products', productSchema)
