import mongoose, { Schema } from 'mongoose'
import { tableStatus } from '~/enums/tableStatus.enum'

const tableSchema = new Schema(
  {
    table_number: {
      type: Number,
      unique: true,
      required: true,
      min: [1, 'Table number must be greater than 0']
    },
    capacity: {
      type: Number,
      required: true,
      default: 1,
      min: [1, 'Capacity must be greater than 0']
    },
    current: {
      type: Number,
      required: true,
      default: 0,
      min: [0, 'Current must be greater or equal than 0']
    },
    status: {
      type: String,
      required: true,
      enum: [tableStatus.BOOKED, tableStatus.NOT_BOOKED],
      default: tableStatus.NOT_BOOKED
    },
    token: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
      minLength: 1
    }
  },
  {
    timestamps: true
  }
)

export const TableModel = mongoose.model('tables', tableSchema)
