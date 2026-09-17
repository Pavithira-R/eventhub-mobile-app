import { Router } from 'express';
import { eventController } from '../controllers/eventController';
import { authMiddleware } from '../middleware/authMiddleware';
import { validationMiddleware } from '../middleware/validationMiddleware';

const router = Router();

// Public routes for event browsing
router.get('/', eventController.getAllEvents);
router.get('/:id', eventController.getEventById);

// Organizer protected routes
router.post(
  '/',
  authMiddleware.requireAuth,
  authMiddleware.requireRole('organizer'),
  validationMiddleware.validateEvent,
  eventController.createEvent
);

router.put(
  '/:id',
  authMiddleware.requireAuth,
  authMiddleware.requireRole('organizer'),
  eventController.updateEvent
);

router.delete(
  '/:id',
  authMiddleware.requireAuth,
  authMiddleware.requireRole('organizer'),
  eventController.deleteEvent
);

export default router;
