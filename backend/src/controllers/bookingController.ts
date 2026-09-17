import { Response, NextFunction } from 'express';
import { BookingService } from '../services/bookingService';
import { AuthenticatedRequest } from '../types';

export const bookingController = {
  getAllBookings(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
    try {
      const bookings = BookingService.getAllBookings(req.user);
      res.status(200).json({
        success: true,
        count: bookings.length,
        data: bookings,
      });
    } catch (error) {
      next(error);
    }
  },

  getBookingById(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
    try {
      const booking = BookingService.getBookingById(req.params.id, req.user);
      res.status(200).json({
        success: true,
        data: booking,
      });
    } catch (error) {
      next(error);
    }
  },

  createBooking(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Authentication required.' });
        return;
      }

      const booking = BookingService.createBooking(req.body, req.user);
      res.status(201).json({
        success: true,
        message: 'Booking created successfully.',
        data: booking,
      });
    } catch (error) {
      next(error);
    }
  },

  cancelBooking(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Authentication required.' });
        return;
      }

      const booking = BookingService.cancelBooking(req.params.id, req.user);
      res.status(200).json({
        success: true,
        message: `Booking '${req.params.id}' cancelled successfully.`,
        data: booking,
      });
    } catch (error) {
      next(error);
    }
  },
};
