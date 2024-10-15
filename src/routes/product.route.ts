import express from 'express';
import {
    getProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct,
} from '../controllers/product.controller';
import { wrapAsync } from '~/utils/response';

const router = express.Router();

router.get('/', wrapAsync(getProducts));
router.get('/:id', wrapAsync(getProductById));
router.post('/add', wrapAsync(addProduct));
router.put('/:id', wrapAsync(updateProduct));
router.delete('/:id', wrapAsync(deleteProduct));

export default router;