import { Router } from 'express';
import authRoutes from './authRoute.js';
import ordersRoutes from './ordersRoute.js';
import productsRoutes from './productsRoute.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/orders', ordersRoutes);
router.use('/products', productsRoutes);

export default router;
