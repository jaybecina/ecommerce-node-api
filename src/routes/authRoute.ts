// Auth routes
import { Router } from 'express';
import { validateData } from '../middlewares/validationMiddleware';
import { login, register } from '../controllers/authController';
import { loginSchema, createUserSchema } from '../db/usersSchema';
import { authLimiter } from '../middlewares/rateLimiter';

const router = Router();

router.post('/login', authLimiter, validateData(loginSchema), login);
router.post('/register', authLimiter, validateData(createUserSchema), register);

export default router;
