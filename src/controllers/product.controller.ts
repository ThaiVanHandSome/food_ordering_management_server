import { Request, Response } from 'express'
import productService from '~/services/product.service'
import { responseSuccess } from '~/utils/response'

export const addProduct = async (req: Request, res: Response) => {
  try {
    const product: ProductRequest = req.body
    const result = await productService.addProduct(product)
    return responseSuccess(res, result)
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const body = req.body
    const result = await productService.updateProduct(id, body)
    return responseSuccess(res, result)
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const getProducts = async (req: Request, res: Response) => {
  try {
    const productQuery: any = req.query
    const result = await productService.getProducts(productQuery)
    return responseSuccess(res, result)
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const increaseView = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const result = await productService.increaseView(id)
    return responseSuccess(res, result)
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const result = await productService.deleteProduct(id)
    return responseSuccess(res, result)
  } catch (error) {
    console.log(error)
    throw error
  }
}
