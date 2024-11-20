/* eslint-disable @typescript-eslint/no-explicit-any */
import { pick } from 'lodash'
import { io, userSockets } from '~/app'
import { STATUS } from '~/constants/httpStatus'
import { orderStatus } from '~/enums/orderStatus.enum'
import { OrderModel, ProductModel, TableModel } from '~/models'
import { ErrorHandler } from '~/utils/response'

export const orderStatusName = {
  IN_PROGRESS: 'Đang xử lý',
  COOKING: 'Đang nấu',
  REJECTED: 'Từ chối',
  SERVED: 'Đã phục vụ',
  PAID: 'Đã thanh toán'
} as const

type OrderStatus = keyof typeof orderStatusName

const addOrder = async (orderRequest: OrderRequest) => {
  try {
    const { table_number, customer_name, customer_id, products } = orderRequest

    if (!table_number) {
      throw new ErrorHandler(STATUS.NOT_ACCEPTABLE, 'Chưa chọn bàn để đặt hàng')
    }

    const table = await TableModel.findOne({ table_number }).lean()
    if (!table) {
      throw new ErrorHandler(STATUS.NOT_ACCEPTABLE, 'Không tồn tại bàn này')
    }

    if (!customer_name) {
      throw new ErrorHandler(STATUS.NOT_ACCEPTABLE, 'Chưa có tên khách hàng')
    }

    if (!products || products.length === 0) {
      throw new ErrorHandler(STATUS.NOT_ACCEPTABLE, 'Chưa chọn sản phẩm để đặt hàng')
    }

    for (const product of products) {
      if (product.buy_count === 0 || !product.id) continue

      const newOrder = new OrderModel({
        table_number,
        customer_name,
        customer_id,
        product: product.id,
        buy_count: product.buy_count,
        status: product.status ?? orderStatus.IN_PROGRESS
      })

      await newOrder.save()
    }

    io.emit('addOrder', {
      message: 'Có một đơn hàng đã được đặt'
    })

    return { message: 'Đặt hàng thành công' }
  } catch (error) {
    console.error(error)
    throw error
  }
}

const getUserOrder = async (customer_id: string, customer_name: string, table_number: number) => {
  try {
    let existOrders = await OrderModel.find({
      customer_id,
      customer_name,
      table_number
    }).populate('product')
    if (!existOrders) existOrders = []
    const response = {
      message: 'Lấy đơn hàng thành công',
      data: existOrders
    }
    return response
  } catch (error) {
    console.log(error)
    throw error
  }
}

const getStatisticsTable = async () => {
  try {
    const res: never[] = []
    const tables = await TableModel.find().lean()
    for (const table of tables) {
      const cntInprogressOrder = await OrderModel.find({
        table_number: table.table_number,
        status: orderStatus.IN_PROGRESS
      })
        .countDocuments()
        .lean()

      const cntCookingOrder = await OrderModel.find({
        table_number: table.table_number,
        status: orderStatus.COOKING
      })
        .countDocuments()
        .lean()

      const cntRejectedOrder = await OrderModel.find({
        table_number: table.table_number,
        status: orderStatus.REJECTED
      })
        .countDocuments()
        .lean()

      const cntServedOrder = await OrderModel.find({
        table_number: table.table_number,
        status: orderStatus.SERVED
      })
        .countDocuments()
        .lean()

      const cntPaidOrder = await OrderModel.find({
        table_number: table.table_number,
        status: orderStatus.SERVED
      })
        .countDocuments()
        .lean()
      const tableRes = {
        tableNumber: table.table_number,
        cntInprogressOrder,
        cntCookingOrder,
        cntRejectedOrder,
        cntServedOrder,
        cntPaidOrder
      }
      res.push(tableRes as never)
    }
    const response = {
      message: 'Lấy thông kê các bàn thành công',
      data: res
    }
    return response
  } catch (error) {
    console.log(error)
    throw error
  }
}

const getStatisticsOrder = async (query: StatisticOrderQuery) => {
  try {
    // eslint-disable-next-line prefer-const
    let { page = 1, limit = 6, customer_name, table_number, status, startDate, endDate } = query
    page = Number(page)
    limit = Number(limit)
    table_number = parseInt(table_number as string)
    let condition: any = {}
    if (customer_name) {
      condition = {
        ...condition,
        customer_name
      }
    }
    if (table_number) {
      condition = {
        ...condition,
        table_number
      }
    }
    if (startDate || endDate) {
      condition.createdAt = {}
      if (startDate) {
        const start = new Date(startDate)
        start.setHours(0, 0, 0, 0)
        condition.createdAt.$gte = start
      }
      if (endDate) {
        const end = new Date(endDate)
        end.setHours(23, 59, 59, 999)
        condition.createdAt.$lte = end
      }
    }
    const res = {
      tables: [],
      orders: [],
      cntInprogressOrder: 0,
      cntCookingOrder: 0,
      cntRejectedOrder: 0,
      cntServedOrder: 0,
      cntPaidOrder: 0
    }

    const [cntInprogressOrder, cntCookingOrder, cntRejectedOrder, cntServedOrder, cntPaidOrder] = await Promise.all([
      OrderModel.find({ status: orderStatus.IN_PROGRESS, ...condition })
        .countDocuments()
        .lean(),
      OrderModel.find({ status: orderStatus.COOKING, ...condition })
        .countDocuments()
        .lean(),
      OrderModel.find({ status: orderStatus.REJECTED, ...condition })
        .countDocuments()
        .lean(),
      OrderModel.find({ status: orderStatus.SERVED, ...condition })
        .countDocuments()
        .lean(),
      OrderModel.find({ status: orderStatus.PAID, ...condition })
        .countDocuments()
        .lean()
    ])

    res.cntInprogressOrder = cntInprogressOrder
    res.cntCookingOrder = cntCookingOrder
    res.cntRejectedOrder = cntRejectedOrder
    res.cntServedOrder = cntServedOrder
    res.cntPaidOrder = cntPaidOrder

    if (status) {
      condition = {
        ...condition,
        status
      }
    }
    const orders = await OrderModel.find(condition)
      .populate('product')
      .populate('assignee')
      .sort({ createdAt: -1 })
      .skip(page * limit - limit)
      .limit(limit)
    const totalProducts = await OrderModel.find(condition).countDocuments().lean()
    const page_size = Math.ceil(totalProducts / limit) || 1
    res.orders = orders as never
    const response = {
      message: 'Lọc đơn hàng thành công',
      data: {
        content: res,
        pagination: {
          page,
          limit,
          pageSize: page_size,
          total: totalProducts
        }
      }
    }
    return response
  } catch (error) {
    console.log(error)
    throw error
  }
}

const updateOrder = async (order_id: string, query: OrderUpdateQuery) => {
  try {
    const { product_id, buy_count, status, assignee } = query
    if (!order_id) {
      throw new ErrorHandler(STATUS.NOT_ACCEPTABLE, 'Chưa cung cấp đơn hàng')
    }
    const existOrder = await OrderModel.findById(order_id).lean()
    if (!existOrder) {
      throw new ErrorHandler(STATUS.NOT_FOUND, 'Không tìm thấy đơn hàng')
    }
    if (existOrder.status !== orderStatus.IN_PROGRESS && !status) {
      throw new ErrorHandler(STATUS.NOT_ACCEPTABLE, 'Món ăn hiện đã được chuẩn bị, không thể thay đổi đơn hàng')
    }
    // const isPrevDone = await checkCustomerDone(existOrder.customer_id)
    const updateData: any = {}
    if (status) {
      updateData.status = status
    }
    if (product_id) {
      updateData.product = product_id
    }
    if (buy_count) {
      updateData.buy_count = buy_count
    }
    if (assignee) {
      updateData.assignee = assignee
    }
    const updatedData = await OrderModel.findByIdAndUpdate(
      order_id,
      {
        $set: updateData
      },
      {
        new: true,
        runValidators: true
      }
    ).lean()

    const prod = await ProductModel.findById(existOrder.product).lean()
    const newProd = await ProductModel.findById(updatedData?.product).lean()
    const userSocket = userSockets[existOrder.customer_id]
    if (userSocket) {
      let message = ''
      if (String(existOrder.product._id) !== product_id && !!product_id) {
        message += `Món ăn ${prod?.name} của bạn đã được thay đổi thành ${newProd?.name} - `
      }
      if (existOrder.buy_count !== buy_count && !!buy_count) {
        message += `Món ăn ${newProd?.name} của bạn đã được thay đổi số lượng thành ${buy_count} - `
      }
      if (existOrder.status !== status && !!status) {
        let tempMessage = `Món ăn ${newProd?.name} của bạn ${orderStatusName[status as OrderStatus]}`
        if (status === orderStatus.REJECTED) {
          tempMessage = `Món ăn ${newProd?.name} của bạn bị ${orderStatusName[status as OrderStatus]}`
        }
        message += tempMessage + ' - '
      }
      const newData = await OrderModel.find({ customer_id: existOrder.customer_id }).lean()
      userSocket.emit('orderUpdated', {
        message,
        data: newData
      })
    }

    if (status === orderStatus.PAID) {
      await ProductModel.findByIdAndUpdate(String(newProd?._id), {
        $inc: { sold: (updatedData as unknown as { buy_count: number }).buy_count }
      })
    } else {
      if ((existOrder as unknown as { status: string }).status === orderStatus.PAID) {
        await ProductModel.findByIdAndUpdate(String(newProd?._id), {
          $inc: { sold: -1 * (updatedData as unknown as { buy_count: number }).buy_count }
        })
      }
    }

    const response = {
      message: 'Cập nhật đơn hàng thành công',
      data: updatedData
    }
    return response
  } catch (error) {
    console.log(error)
    throw error
  }
}

const deleteOrder = async (order_id: string) => {
  try {
    if (!order_id) {
      throw new ErrorHandler(STATUS.NOT_ACCEPTABLE, 'Chưa cung cấp đơn hàng')
    }
    const existOrder = await OrderModel.findById(order_id).lean()
    if (!existOrder) {
      throw new ErrorHandler(STATUS.NOT_FOUND, 'Không tìm thấy đơn hàng')
    }
    await OrderModel.deleteOne({
      _id: order_id
    })

    const userSocket = userSockets[existOrder.customer_id]
    const prod = await ProductModel.findById(existOrder.product).lean()
    if (userSocket) {
      userSocket.emit('orderUpdated', {
        message: `Món ${prod?.name} đã bị xóa`
      })
    }

    const response = {
      message: 'Xóa đơn hàng thành công'
    }
    return response
  } catch (error) {
    console.log(error)
    throw error
  }
}

const findCustomer = async (customer_id: string) => {
  try {
    if (!customer_id) {
      throw new ErrorHandler(STATUS.NOT_FOUND, 'Chưa cung cấp id của khách hàng')
    }
    const existOrder = await OrderModel.findOne({ customer_id }).lean()
    if (!existOrder) {
      throw new ErrorHandler(STATUS.NOT_FOUND, 'Không tồn tại khách hàng với id đã cung cấp')
    }
    const data = pick(existOrder, ['customer_id', 'customer_name', 'table_number'])
    const response = {
      message: 'Lấy khách hàng thành công',
      data
    }
    return response
  } catch (error) {
    console.log(error)
    throw error
  }
}

export default {
  addOrder,
  getUserOrder,
  getStatisticsOrder,
  getStatisticsTable,
  updateOrder,
  deleteOrder,
  findCustomer
}
