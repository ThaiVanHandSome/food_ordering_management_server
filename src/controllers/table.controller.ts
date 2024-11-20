import { Request, Response } from 'express'
import tableService from '~/services/table.service'
import { responseSuccess } from '~/utils/response'

export const addTable = async (req: Request, res: Response) => {
  try {
    const table: TableRequest = req.body
    const result = await tableService.addTable(table)
    return responseSuccess(res, result)
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const checkAvailableTable = async (req: Request, res: Response) => {
  try {
    const { table_number, token } = req.query
    const result = await tableService.checkAvailableTable(parseInt(table_number as string), token as string)
    return responseSuccess(res, result)
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const getAllTables = async (req: Request, res: Response) => {
  try {
    const query: TableQuery = req.query as unknown as TableQuery
    console.log(req.query)
    const result = await tableService.getAllTables(query)
    return responseSuccess(res, result)
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const updateTable = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const body: TableRequest = req.body
    const result = await tableService.updateTable(id, body)
    return responseSuccess(res, result)
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const deleteTable = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const result = await tableService.deleteTable(id)
    return responseSuccess(res, result)
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const leaveTable = async (req: Request, res: Response) => {
  try {
    const { table_number } = req.query
    const result = await tableService.leaveTable(parseInt(table_number as string))
    return responseSuccess(res, result)
  } catch (error) {
    console.log(error)
    throw error
  }
}
