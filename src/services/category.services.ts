import { CategoryModel } from '../models/category.model';

// Hàm lấy tất cả danh mục
export const getAllCategories = async () => {
  try {
    const categories = await CategoryModel.find();
    return categories;
  } catch (error) {
    throw error;
  }
};

// Hàm lấy danh mục theo ID
export const getCategoryById = async (categoryId: string) => {
  try {
    const category = await CategoryModel.findById(categoryId);
    return category;
  } catch (error) {
    throw error;
  }
};

// Hàm thêm danh mục mới
export const addCategory = async (name: string) => {
  try {
    const newCategory = new CategoryModel({ name });
    const savedCategory = await newCategory.save();
    return savedCategory;
  } catch (error) {
    throw error;
  }
};

// Hàm cập nhật danh mục theo ID
export const updateCategory = async (categoryId: string, name: string) => {
  try {
    const updatedCategory = await CategoryModel.findByIdAndUpdate(categoryId, { name }, { new: true });
    return updatedCategory;
  } catch (error) {
    throw error;
  }
};

export default { getAllCategories, getCategoryById, addCategory, updateCategory };