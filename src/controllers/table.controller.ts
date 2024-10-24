import { Request, Response } from 'express';
import tableService from '~/services/table.services';
import { responseSuccess, responseError } from '~/utils/response';

export const getAllTables = async (req: Request, res: Response) => {
  try {
    const result = await tableService.getAllTables();
    return responseSuccess(res, result);
  } catch (error) {
    return responseError(res, error);
  }
};

export const getTableById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await tableService.getTableById(id);
    return responseSuccess(res, result);
  } catch (error) {
    return responseError(res, error);
  }
};

export const addTable = async (req: Request, res: Response) => {
  try {
    const { table_number, capacity, status } = req.body;
    const result = await tableService.addTable(table_number, capacity, status);
    return responseSuccess(res, result);
  } catch (error) {
    return responseError(res, error);
  }
};

export const updateTable = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { table_number, capacity, status } = req.body;
    const result = await tableService.updateTable(id, table_number, capacity, status);
    return responseSuccess(res, result);
  } catch (error) {
    return responseError(res, error);
  }
};

export const deleteTable = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await tableService.deleteTable(id);
    return responseSuccess(res, result);
  } catch (error) {
    return responseError(res, error);
  }
};
