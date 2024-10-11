import { Request, Response } from 'express';
import * as categoryService from '../services/category.services';

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const categories = await categoryService.getAllCategories();
    return res.status(200).json({
      message: 'Lấy tất cả danh mục thành công',
      data: categories
    });
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getCategoryById = async (req: Request, res: Response) => {
  const categoryId = req.params.id;
  try {
    const category = await categoryService.getCategoryById(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Danh mục không tồn tại' });
    }
    return res.status(200).json({
      message: 'Lấy danh mục thành công',
      data: category
    });
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const addCategory = async (req: Request, res: Response) => {
  const { name } = req.body;
  try {
    const newCategory = await categoryService.addCategory(name);
    return res.status(201).json({
      message: 'Tạo danh mục thành công',
      data: newCategory
    });
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  const categoryId = req.params.id;
  const { name } = req.body;
  try {
    const updatedCategory = await categoryService.updateCategory(categoryId, name);
    if (!updatedCategory) {
      return res.status(404).json({ message: 'Danh mục không tồn tại' });
    }
    return res.status(200).json({
      message: 'Chỉnh sửa danh mục thành công',
      data: updatedCategory
    });
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};