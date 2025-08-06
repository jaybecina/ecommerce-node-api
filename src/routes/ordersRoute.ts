// Orders routes
import { Router } from 'express';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { validateData } from '../middlewares/validationMiddleware.js';
import { insertOrderWithItemsSchema, updateOrderSchema } from '../db/ordersSchema.js';
import { createOrder, listOrders, getOrder, updateOrder } from '../controllers/ordersController.js';
import { apiLimiter } from '../middlewares/rateLimiter.js';

const router = Router();

router.use(verifyToken);
router.use(apiLimiter);

router.post('/', validateData(insertOrderWithItemsSchema), createOrder);
router.get('/', listOrders);
router.get('/:id', getOrder);
router.put('/:id', validateData(updateOrderSchema), updateOrder);

export default router;
