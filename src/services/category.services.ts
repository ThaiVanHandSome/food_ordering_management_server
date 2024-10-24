import { CategoryModel } from '../models/category.model';
import { ErrorHandler } from '../utils/response';
import { STATUS } from '~/constants/httpStatus';

export const getAllCategories = async () => {
  try {
    const categories = await CategoryModel.find();
    return { message: 'Lấy tất cả danh mục thành công', data: categories };
  } catch (error) {
    throw error
  }
};

export const getCategoryById = async (categoryId: string) => {
  const category = await CategoryModel.findById(categoryId);
  if (!category) {
    throw new ErrorHandler(STATUS.NOT_FOUND, 'Danh mục không tồn tại');
  }
  return { message: 'Lấy danh mục thành công', data: category };
};

export const addCategory = async (name: string) => {
  const newCategory = new CategoryModel({ name });
  const savedCategory = await newCategory.save();
  return { message: 'Tạo danh mục thành công', data: savedCategory };
};

export const updateCategory = async (categoryId: string, name: string) => {
  const updatedCategory = await CategoryModel.findByIdAndUpdate(categoryId, { name }, { new: true });
  if (!updatedCategory) {
    throw new ErrorHandler(STATUS.NOT_FOUND, 'Danh mục không tồn tại');
  }
  return { message: 'Chỉnh sửa danh mục thành công', data: updatedCategory };
};

export default { getAllCategories, getCategoryById, addCategory, updateCategory };
