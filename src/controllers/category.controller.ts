import { Request, Response } from 'express';
import categoryService from '~/services/category.services';
import { responseSuccess, responseError } from '~/utils/response';

export const addCategory = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const result = await categoryService.addCategory(name);

    return responseSuccess(res, result);
  } catch (error) {
    console.log(error);
    return responseError(res, error);
  }
};

export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await categoryService.getCategoryById(id);
    return responseSuccess(res, result);
  } catch (error) {
    console.log(error);
    return responseError(res, error);
  }
};

export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const result = await categoryService.getAllCategories();
    return responseSuccess(res, result);
  } catch (error) {
    console.log(error);
    return responseError(res, error);
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const result = await categoryService.updateCategory(id, name);


    return responseSuccess(res, result);
  } catch (error) {
    console.log(error);
    return responseError(res, error);
  }
};


