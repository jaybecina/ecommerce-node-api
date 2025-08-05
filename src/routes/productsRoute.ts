import { Router } from 'express';
import {
  listProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productsController';
import { uploadProductImage } from '../controllers/imageUploadController';
import { validateData } from '../middlewares/validationMiddleware';
import { uploadMiddleware, uploadToR2 } from '../middlewares/uploadMiddleware';
import { createProductSchema, updateProductSchema } from '../db/productsSchema';
import { verifySellerOrAdmin, verifyToken } from '../middlewares/authMiddleware';
import { apiLimiter } from '../middlewares/rateLimiter';

const router = Router();

router.use(verifyToken);
router.use(apiLimiter);

router.get('/', listProducts);
router.get('/:id', getProductById);
// Separate image upload endpoint
// Routes that require seller or admin role
router.post('/upload-image', verifySellerOrAdmin, uploadMiddleware, uploadToR2, uploadProductImage);

// Product CRUD operations - restricted to sellers and admins
router.post('/', verifySellerOrAdmin, validateData(createProductSchema), createProduct);
router.put('/:id', verifySellerOrAdmin, validateData(updateProductSchema), updateProduct);
router.delete('/:id', verifySellerOrAdmin, deleteProduct);

export default router;
