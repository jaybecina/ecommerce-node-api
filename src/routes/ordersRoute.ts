// Orders routes
import { Router } from 'express';
import { verifyToken } from '../middlewares/authMiddleware';
import { validateData } from '../middlewares/validationMiddleware';
import { insertOrderWithItemsSchema, updateOrderSchema } from '../db/ordersSchema';
import { createOrder, listOrders, getOrder, updateOrder } from '../controllers/ordersController';
import { apiLimiter } from '../middlewares/rateLimiter';

const router = Router();

router.use(verifyToken);
router.use(apiLimiter);

router.post('/', validateData(insertOrderWithItemsSchema), createOrder);
router.get('/', listOrders);
router.get('/:id', getOrder);
router.put('/:id', validateData(updateOrderSchema), updateOrder);

export default router;
