import { STATUS } from '~/constants/httpStatus'
import { CategoryModel, TableModel } from '~/models'
import { ErrorHandler } from '~/utils/response'

const getAllCategories = async (params: any) => {
  try {
    const { name } = params
    let query = {}
    if (name) {
      query = {
        ...query,
        name
      }
    }
    const categories = await CategoryModel.find(query).lean()
    const response = {
      message: 'Lấy tất cả danh mục thành công',
      data: categories
    }
    return response
  } catch (error) {
    console.log(error)
    throw error
  }
}

const createCategory = async (body: { name: string }) => {
  try {
    const { name } = body
    const existCategory = await CategoryModel.findOne({ name })

    if (existCategory) {
      throw new ErrorHandler(STATUS.NOT_ACCEPTABLE, 'Danh mục đã tồn tại')
    }
    const newCategory = new CategoryModel({
      name
    })
    await newCategory.save()
    const response = {
      message: 'Tạo danh mục thành công!',
      data: newCategory
    }
    return response
  } catch (error) {
    console.log(error)
    throw error
  }
}

const updateCategory = async (id: string, body: { name: string }) => {
  try {
    const { name } = body
    const existCategory = await CategoryModel.findById(id)
    if (!existCategory) {
      throw new ErrorHandler(STATUS.NOT_FOUND, 'Danh mục không tồn tại')
    }
    const existCategoryByName = await CategoryModel.findOne({ name })

    if (existCategoryByName) {
      throw new ErrorHandler(STATUS.NOT_ACCEPTABLE, 'Danh mục đã tồn tại')
    }
    const newCategory = await CategoryModel.findByIdAndUpdate(id, {
      $set: body
    })
    const response = {
      message: 'Cập nhật danh mục thành công',
      data: newCategory
    }
    return response
  } catch (error) {
    console.log(error)
    throw error
  }
}

const deleteCategory = async (id: string) => {
  try {
    const existCategory = await CategoryModel.findById(id)
    if (!existCategory) {
      throw new ErrorHandler(STATUS.NOT_FOUND, 'Danh mục không tồn tại')
    }
    await CategoryModel.deleteOne({ _id: id })
    const response = {
      message: 'Xóa danh mục thành công'
    }
    return response
  } catch (error) {
    console.log(error)
    throw error
  }
}

export default { getAllCategories, createCategory, updateCategory, deleteCategory }
