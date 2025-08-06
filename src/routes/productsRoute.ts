import { Router } from 'express';
import {
  listProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productsController.js';
import { uploadProductImage } from '../controllers/imageUploadController.js';
import { validateData } from '../middlewares/validationMiddleware.js';
import { uploadMiddleware, uploadToR2 } from '../middlewares/uploadMiddleware.js';
import { createProductSchema, updateProductSchema } from '../db/productsSchema.js';
import { verifySellerOrAdmin, verifyToken } from '../middlewares/authMiddleware.js';
import { apiLimiter } from '../middlewares/rateLimiter.js';

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
