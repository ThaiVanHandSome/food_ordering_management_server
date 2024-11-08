import { STATUS } from '~/constants/httpStatus'
import { tableStatus } from '~/enums/tableStatus.enum'
import { TableModel } from '~/models'
import { ErrorHandler } from '~/utils/response'

const addTable = async (table: TableRequest) => {
  try {
    const { table_number } = table
    const existTable = await TableModel.findOne({ table_number })
    if (!existTable) {
      const newTable = await TableModel.create(table)
      const response = {
        message: 'Tạo bàn thành công',
        data: newTable
      }
      return response
    }
    throw new ErrorHandler(STATUS.NOT_ACCEPTABLE, 'Bàn đã tồn tại')
  } catch (error) {
    console.log(error)
    throw error
  }
}

const checkAvailableTable = async (table_number: number, token: string) => {
  try {
    const existTable = await TableModel.findOne({
      table_number,
      token
    }).lean()
    if (!existTable) {
      throw new ErrorHandler(STATUS.NOT_FOUND, 'Bàn không tồn tại')
    }
    if (existTable.current === existTable.capacity) {
      throw new ErrorHandler(STATUS.NOT_ACCEPTABLE, 'Bàn hiện tại đã đầy')
    }
    if (existTable.status === tableStatus.BOOKED) {
      throw new ErrorHandler(STATUS.NOT_ACCEPTABLE, 'Bàn đã được đặt trước')
    }
    await TableModel.findOneAndUpdate(
      {
        table_number,
        token
      },
      {
        $inc: { current: 1 }
      },
      {
        new: true
      }
    )
    const response = {
      message: 'Đăng nhập bàn thành công'
    }
    return response
  } catch (error) {
    console.log(error)
    throw error
  }
}

const getAllTables = async () => {
  try {
    const tables = await TableModel.find().lean()
    const response = {
      message: 'Lấy tất cả bàn ăn thành công',
      data: tables
    }
    return response
  } catch (error) {
    console.log(error)
    throw error
  }
}

const updateTable = async (id_table: string, body: TableRequest) => {
  try {
    const { table_number, capacity, status, token } = body
    const existTable = await TableModel.findById(id_table).lean()
    if (!existTable) {
      throw new ErrorHandler(STATUS.NOT_FOUND, 'Bàn không tồn tại')
    }
    if (existTable.table_number !== table_number) {
      const existTableByTableNumber = await TableModel.findOne({
        table_number
      })
      if (existTableByTableNumber) {
        throw new ErrorHandler(STATUS.NOT_ACCEPTABLE, 'Bàn đã tồn tại')
      }
    }
    const updateData: any = {}
    if (table_number) {
      updateData.table_number = table_number
    }
    if (capacity) {
      updateData.capacity = capacity
    }
    if (status) {
      updateData.status = status
    }
    if (token) {
      updateData.token = token
    }
    const updatedData = await TableModel.findByIdAndUpdate(
      id_table,
      {
        $set: updateData
      },
      {
        new: true,
        runValidators: true
      }
    )
    const response = {
      message: 'Cập nhật bàn ăn thành công',
      data: updatedData
    }
    return response
  } catch (error) {
    console.log(error)
    throw error
  }
}

const deleteTable = async (id_table: string) => {
  try {
    if (!id_table) {
      throw new ErrorHandler(STATUS.NOT_ACCEPTABLE, 'Chưa cung cấp id của bàn')
    }
    const existTable = await TableModel.findById(id_table)
    if (!existTable) {
      throw new ErrorHandler(STATUS.NOT_FOUND, 'Bàn không tồn tại')
    }
    await TableModel.deleteOne({
      _id: id_table
    })
    const response = {
      message: 'Xóa bàn thành công'
    }
    return response
  } catch (error) {
    console.log(error)
    throw error
  }
}

export default { addTable, checkAvailableTable, getAllTables, updateTable, deleteTable }
