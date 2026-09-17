import { Router } from 'express';
import { authController } from '../controllers/authController';
import { authMiddleware } from '../middleware/authMiddleware';
import { validationMiddleware } from '../middleware/validationMiddleware';

const router = Router();

router.post('/register', validationMiddleware.validateRegister, authController.register);
router.post('/login', validationMiddleware.validateLogin, authController.login);
router.get('/profile', authMiddleware.requireAuth, authController.getProfile);
router.put('/profile', authMiddleware.requireAuth, authController.updateProfile);

export default router;
