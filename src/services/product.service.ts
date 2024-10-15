import { ProductModel } from "~/models";
import { ErrorHandler } from '../utils/response';
import { STATUS } from '~/constants/httpStatus';
import { HOST } from '../utils/helper'
import { FOLDERS, FOLDER_UPLOAD, ROUTE_IMAGE } from '../constants/config'
import fs from 'fs'
import { omitBy } from "lodash";

export const handleImageProduct = (product : any) => {
  if (product.image !== undefined && product.image !== '') {
    product.image = HOST + `/${ROUTE_IMAGE}/` + product.image
  }
  return product
}

const removeImageProduct = (image: string | undefined) => {
  if (image !== undefined && image !== '') {
    fs.unlink(`${FOLDER_UPLOAD}/${FOLDERS.PRODUCT}/${image}`, (err) => {
      if (err) console.error(err)
    })
  }
}

const getProductById = async (productId: string) => {
  try {
    let product = await ProductModel.findById(productId);
    if (!product) {
      throw new ErrorHandler(STATUS.NOT_FOUND, 'Sản phẩm không tồn tại');
    }
    product = handleImageProduct(product);
    return { message: 'Lấy sản phẩm thành công', data: product };
  } catch (error) {
    throw error;
  }
};

const getProducts = async (query : ProductsQuery) =>
  {
    const filters: any = {};
    const page = query.page !== undefined ? Number(query.page) : 1; // Nếu không có page, mặc định là 1
    const limit = query.limit !== undefined ? Number(query.limit) : 30; // Nếu không có limit, mặc định là 30
  
    // Điều kiện lọc theo category_id nếu có
    if (query.category_id) {
      filters.category_id = query.category_id;
    }
  
    // Điều kiện lọc theo khoảng giá nếu có
    if (query.price_min !== undefined || query.price_max !== undefined) {
      filters.price = {};
      if (query.price_min !== undefined) {
        filters.price.$gte = query.price_min;  // Giá >= price_min
      }
      if (query.price_max !== undefined) {
        filters.price.$lte = query.price_max;  // Giá <= price_max
      }
    }
  
    // Điều kiện sắp xếp (sort) theo trường và thứ tự chỉ định
    const sort: any = {};
    if (query.sort_by) {
      sort[query.sort_by] = query.order === 'desc' ? -1 : 1;
    }
  
    // Thực hiện truy vấn với các điều kiện lọc và sắp xếp
    //let products = await ProductModel.find(filters).sort(sort).lean();

    let [products, totalProducts]: [products: any, totalProducts: any] =
    await Promise.all([
      ProductModel.find(filters)
        .populate({
          path: 'category',
        })
        //.sort({ [sort_by]: order === 'desc' ? -1 : 1 })
        .sort(sort)
        .skip(page * limit - limit)
        .limit(limit)
        .select({ __v: 0, description: 0 })
        .lean(),
      ProductModel.find(filters).countDocuments().lean(),
    ])
  
    products = products.map((product : Product) => handleImageProduct(product))

    // Nếu không tìm thấy sản phẩm nào, ném lỗi
    if (products.length === 0) {
      throw new ErrorHandler(STATUS.NOT_FOUND, 'Không tìm thấy sản phẩm nào');
    }
  
    return { message: 'Lấy danh sách sản phẩm thành công', data: products };
  
  }

const addProduct = async (product : Product) =>{
  const newProduct = new ProductModel(product);
  const addedProduct = await newProduct.save();
  return {
    message: 'Tạo sản phẩm thành công',
    data: addedProduct
  }
}

const updateProduct = async (productId : string, product: Product) => {
  const {name, description, category, image, price, status, sold, view } = product;
  const newProduct = omitBy(
    {
      name,
      description,
      category,
      image,
      price,
      status,
      sold,
      view,
    },
    (value) => value === undefined || value === ''
  )
  const updatedProduct = await ProductModel.findByIdAndUpdate(productId, newProduct, { new: true });

  if (!updatedProduct) {
    throw new ErrorHandler(STATUS.NOT_FOUND, 'Sản phẩm không tồn tại');
  }
  return { message: 'Cập nhật sản phẩm thành công', data: updatedProduct };
};

const deleteProduct = async (productId: string) => {
  const product = await ProductModel.findByIdAndDelete(productId);
  if (product) {
    removeImageProduct(product.image)
    return { message: 'Xóa sản phẩm thành công', data: product };
  } else {
    throw new ErrorHandler(STATUS.NOT_FOUND, 'Sản phẩm không tồn tại');
  }
  
}



export default {getProductById, addProduct, updateProduct, getProducts, deleteProduct }
