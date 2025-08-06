import { Router } from 'express';
import authRoutes from './authRoute';
import ordersRoutes from './ordersRoute';
import productsRoutes from './productsRoute';

const router = Router();

router.use('/auth', authRoutes);
router.use('/orders', ordersRoutes);
router.use('/products', productsRoutes);

export default router;
