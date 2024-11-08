import { Request, Response } from 'express'
import orderService from '~/services/order.service'
import { responseSuccess } from '~/utils/response'

export const addOrder = async (req: Request, res: Response) => {
  try {
    const orderRequest: OrderRequest = req.body
    const result = await orderService.addOrder(orderRequest)
    return responseSuccess(res, result)
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const getUserOrder = async (req: Request, res: Response) => {
  try {
    const { customer_id, customer_name, table_number } = req.query
    const result = await orderService.getUserOrder(
      customer_id as string,
      customer_name as string,
      parseInt(table_number as string)
    )
    return responseSuccess(res, result)
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const getStatisticsOrder = async (req: Request, res: Response) => {
  try {
    const query: StatisticOrderQuery = req.query as unknown as StatisticOrderQuery
    const result = await orderService.getStatisticsOrder(query)
    return responseSuccess(res, result)
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const getStatisticsTable = async (req: Request, res: Response) => {
  try {
    const result = await orderService.getStatisticsTable()
    return responseSuccess(res, result)
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const updateOrder = async (req: Request, res: Response) => {
  try {
    const query: OrderUpdateQuery = req.body
    const { id } = req.params
    const result = await orderService.updateOrder(id, query)
    return responseSuccess(res, result)
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const result = await orderService.deleteOrder(id)
    return responseSuccess(res, result)
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const findCustomer = async (req: Request, res: Response) => {
  try {
    const { customer_id } = req.query
    const result = await orderService.findCustomer(customer_id as string)
    return responseSuccess(res, result)
  } catch (error) {
    console.log(error)
    throw error
  }
}
