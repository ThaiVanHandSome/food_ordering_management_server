import { Request, Response } from 'express'
import categoryService from '~/services/category.service'
import { responseSuccess } from '~/utils/response'

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const params = req.query
    const result = await categoryService.getAllCategories(params)
    return responseSuccess(res, result)
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const createCategory = async (req: Request, res: Response) => {
  try {
    const body: { name: string } = req.body
    const result = await categoryService.createCategory(body)
    return responseSuccess(res, result)
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const body: { name: string } = req.body
    const result = await categoryService.updateCategory(id, body)
    return responseSuccess(res, result)
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const result = await categoryService.deleteCategory(id)
    return responseSuccess(res, result)
  } catch (error) {
    console.log(error)
    throw error
  }
}
