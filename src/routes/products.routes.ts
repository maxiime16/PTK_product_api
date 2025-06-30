import { Router } from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/products.controller.js';
import { authenticateToken } from '../lib/auth.js';
import { validateProduct } from '../lib/validateProduct.js';

const router = Router();

router.get('/', getAllProducts);
router.get('/:id', authenticateToken, getProductById);
router.post('/', authenticateToken, validateProduct, createProduct);
router.put('/:id', authenticateToken, validateProduct, updateProduct);
router.delete('/:id', authenticateToken, deleteProduct);

export default router;
