import { TableModel } from '../models/table.model';
import { ErrorHandler } from '../utils/response';
import { STATUS } from '~/constants/httpStatus';
import { v4 as uuidv4 } from 'uuid';

// Get all tables
export const getAllTables = async () => {
  try {
    const tables = await TableModel.find();
    return { message: 'Lấy tất cả bàn ăn thành công', data: tables };
  } catch (error) {
    throw error;
  }
};

// Get table by ID
export const getTableById = async (tableId: string) => {
  const table = await TableModel.findById(tableId);
  if (!table) {
    throw new ErrorHandler(STATUS.NOT_FOUND, 'Bàn ăn không tồn tại');
  }
  return { message: 'Lấy bàn ăn thành công', data: table };
};

// Add a new table
export const addTable = async (table_number: number, capacity: number, status: string) => {
  // Check if table number already exists
  const existingTable = await TableModel.findOne({ table_number });
  if (existingTable) {
    throw new ErrorHandler(STATUS.BAD_REQUEST, 'Số bàn đã tồn tại');
  }

  // Generate UUID token
  const token = uuidv4().replace(/-/g, '').slice(0, 30);

  const newTable = new TableModel({ table_number, capacity, status, token });
  const savedTable = await newTable.save();
  return { message: 'Thêm bàn ăn thành công', data: savedTable };
};

// Update table
export const updateTable = async (tableId: string, table_number: number, capacity: number, status: string) => {
  // Check if table number already exists and belongs to a different table
  const existingTable = await TableModel.findOne({ table_number, _id: { $ne: tableId } });
  if (existingTable) {
    throw new ErrorHandler(STATUS.BAD_REQUEST, 'Số bàn đã tồn tại');
  }

  const updatedTable = await TableModel.findByIdAndUpdate(
    tableId,
    { table_number, capacity, status },
    { new: true }
  );
  
  if (!updatedTable) {
    throw new ErrorHandler(STATUS.NOT_FOUND, 'Bàn ăn không tồn tại');
  }
  
  return { message: 'Cập nhật bàn ăn thành công', data: updatedTable };
};

// Delete table
export const deleteTable = async (tableId: string) => {
  const table = await TableModel.findByIdAndDelete(tableId);
  if (!table) {
    throw new ErrorHandler(STATUS.NOT_FOUND, 'Bàn ăn không tồn tại');
  }
  return { message: 'Xóa bàn ăn thành công', data: table };
};

export default { getAllTables, getTableById, addTable, updateTable, deleteTable };
