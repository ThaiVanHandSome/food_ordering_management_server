import mongoose, { Schema } from 'mongoose'
import { orderStatus } from '~/enums/orderStatus.enum'

const orderSchema = new Schema(
  {
    table_number: {
      type: Number,
      required: true,
      min: [1, 'Table number must be greater than 0']
    },
    customer_name: {
      type: String,
      required: true,
      trim: true,
      minLength: 1,
      maxLength: 20
    },
    customer_id: {
      type: String,
      required: true,
      trim: true,
      minLength: 1,
      maxLength: 1000
    },
    assignee: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'users'
    },
    product: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'products',
      required: true
    },
    buy_count: {
      type: Number,
      require: true,
      min: [1, 'Buy count must be greater than 0']
    },
    status: {
      type: String,
      required: true,
      enum: [orderStatus.IN_PROGRESS, orderStatus.COOKING, orderStatus.REJECTED, orderStatus.SERVED, orderStatus.PAID]
    }
  },
  {
    timestamps: true
  }
)

export const OrderModel = mongoose.model('orders', orderSchema)
