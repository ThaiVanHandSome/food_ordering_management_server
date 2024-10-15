import { Request, Response } from 'express'
import { responseSuccess, ErrorHandler } from '../utils/response'
import { ProductModel } from '../models/product.model'
import { STATUS } from '../constants/httpStatus'
import { HOST } from '../utils/helper'
import { ROUTE_IMAGE } from '../constants/config'
import { ORDER, SORT_BY } from '../constants/product'

  export const handleImageProduct = (product : Product) => {
    if (product.image !== undefined && product.image !== '') {
      product.image = HOST + `/${ROUTE_IMAGE}/` + product.image
    }
    return product
  }

const getProducts = async (req: Request, res: Response) => {
  let {
    page = 1,
    limit = 30,
    category_id,
    sort_by,
    order,
    price_max,
    price_min,
    name,
  } = req.query as {
    [key: string]: string | number
  }

  page = Number(page)
  limit = Number(limit)
  let condition: any = {}
  if (category_id) {
    condition.category_id = category_id
  }
  if (price_max) {
    condition.price = {
      $lte: price_max,
    }
  }
  if (price_min) {
    condition.price = condition.price
      ? { ...condition.price, $gte: price_min }
      : { $gte: price_min }
  }
  if (!ORDER.includes(order as string)) {
    order = ORDER[0]
  }
  if (!SORT_BY.includes(sort_by as string)) {
    sort_by = SORT_BY[0]
  }
  if (name) {
    condition.name = {
      $regex: name,
      $options: 'i',
    }
  }

  let [products, totalProducts]: [products: any, totalProducts: any] =
    await Promise.all([
      ProductModel.find(condition)
        .populate({
          path: 'category',
        })
        //.sort({ [sort_by]: order === 'desc' ? -1 : 1 })
        .sort({ [sort_by]: order === 'desc' ? -1 : 1 } as Record<string, any>)
        .skip(page * limit - limit)
        .limit(limit)
        .select({ __v: 0, description: 0 })
        .lean(),
      ProductModel.find(condition).countDocuments().lean(),
    ])
  products = products.map((product : Product) => handleImageProduct(product))

  const page_size = Math.ceil(totalProducts / limit) || 1
  const response = {
    message: 'Lấy các sản phẩm thành công',
    data: {
      products,
      pagination: {
        page,
        totalProducts,
        page_size,
      },
    },
  }
  return responseSuccess(res, response)
}

const getAllProducts = async (req: Request, res: Response) => {
  let { category } = req.query
  let condition = {}
  if (category) {
    condition = { category: category }
  }
  let products: any = await ProductModel.find(condition)
    .populate({ path: 'category' })
    .sort({ createdAt: -1 })
    .select({ __v: 0, description: 0 })
    .lean()
  const response = {
    message: 'Lấy tất cả sản phẩm thành công',
    data: products,
  }
  return responseSuccess(res, response)
}

const getProductById = async (req: Request, res: Response) => {
  let condition = { _id: req.params.product_id }
  const productDB: any = await ProductModel.findOneAndUpdate(
    condition,
    { $inc: { view: 1 } },
    { new: true }
  )
    .populate('category')
    .select({ __v: 0 })
    .lean()
  if (productDB) {
    const response = {
      message: 'Lấy sản phẩm thành công',
      data: productDB,
    }
    return responseSuccess(res, response)
  } else {
    throw new ErrorHandler(STATUS.NOT_FOUND, 'Sản phẩm không tồn tại')
  }
}



const ProductController = {
  getProducts,
  getProductById,
}

export default ProductController