import { Router } from 'express';
import { login, logout, getMe, register, updateMe } from '../controllers/auth.controller';
import { requireAuth, optionalAuth } from '../middleware/auth';
import { authLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/logout', logout);
router.get('/me', optionalAuth, getMe);
router.put('/me', requireAuth, updateMe);

export default router;
