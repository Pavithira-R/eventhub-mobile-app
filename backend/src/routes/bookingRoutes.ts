import { Router } from 'express';
import { bookingController } from '../controllers/bookingController';
import { authMiddleware } from '../middleware/authMiddleware';
import { validationMiddleware } from '../middleware/validationMiddleware';

const router = Router();

router.get('/', authMiddleware.requireAuth, bookingController.getAllBookings);
router.get('/:id', authMiddleware.requireAuth, bookingController.getBookingById);
router.post(
  '/',
  authMiddleware.requireAuth,
  validationMiddleware.validateBooking,
  bookingController.createBooking
);
router.delete('/:id', authMiddleware.requireAuth, bookingController.cancelBooking);

export default router;
