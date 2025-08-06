// Auth routes
import { Router } from 'express';
import { validateData } from '../middlewares/validationMiddleware.js';
import { login, register } from '../controllers/authController.js';
import { loginSchema, createUserSchema } from '../db/usersSchema.js';
import { authLimiter } from '../middlewares/rateLimiter.js';

const router = Router();

router.post('/login', authLimiter, validateData(loginSchema), login);
router.post('/register', authLimiter, validateData(createUserSchema), register);

export default router;
