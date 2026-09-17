import { Request, Response, NextFunction } from 'express';

export const validationMiddleware = {
  validateRegister(req: Request, res: Response, next: NextFunction): void {
    const { name, email, password, role } = req.body;
    const errors: string[] = [];

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      errors.push('Full name is required (minimum 2 characters).');
    }

    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errors.push('A valid email address is required.');
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      errors.push('Password must be at least 6 characters long.');
    }

    if (role && !['student', 'organizer', 'attendee'].includes(role)) {
      errors.push("Role must be 'student' or 'organizer'.");
    }

    if (errors.length > 0) {
      res.status(400).json({
        success: false,
        message: 'Validation failed.',
        errors,
      });
      return;
    }

    next();
  },

  validateLogin(req: Request, res: Response, next: NextFunction): void {
    const { email, password } = req.body;
    const errors: string[] = [];

    if (!email || typeof email !== 'string' || !email.trim()) {
      errors.push('Email is required.');
    }

    if (!password || typeof password !== 'string') {
      errors.push('Password is required.');
    }

    if (errors.length > 0) {
      res.status(400).json({
        success: false,
        message: 'Validation failed.',
        errors,
      });
      return;
    }

    next();
  },

  validateEvent(req: Request, res: Response, next: NextFunction): void {
    const { title, description, category, date, time, location, totalSeats, price } = req.body;
    const errors: string[] = [];

    if (!title || typeof title !== 'string' || !title.trim()) errors.push('Event title is required.');
    if (!description || typeof description !== 'string' || !description.trim()) errors.push('Event description is required.');
    if (!category || typeof category !== 'string' || !category.trim()) errors.push('Category is required.');
    if (!date || typeof date !== 'string' || !date.trim()) errors.push('Event date is required.');
    if (!time || typeof time !== 'string' || !time.trim()) errors.push('Event time is required.');
    if (!location || typeof location !== 'string' || !location.trim()) errors.push('Location is required.');

    if (typeof totalSeats !== 'number' || totalSeats <= 0 || !Number.isInteger(totalSeats)) {
      errors.push('Total seats must be a positive integer.');
    }

    if (price !== undefined && (typeof price !== 'number' || price < 0)) {
      errors.push('Price must be a non-negative number.');
    }

    if (errors.length > 0) {
      res.status(400).json({
        success: false,
        message: 'Validation failed.',
        errors,
      });
      return;
    }

    next();
  },

  validateBooking(req: Request, res: Response, next: NextFunction): void {
    const { eventId, ticketsCount } = req.body;
    const errors: string[] = [];

    if (!eventId || typeof eventId !== 'string') {
      errors.push('Valid eventId is required.');
    }

    if (typeof ticketsCount !== 'number' || ticketsCount <= 0 || !Number.isInteger(ticketsCount)) {
      errors.push('ticketsCount must be a positive integer between 1 and 5.');
    } else if (ticketsCount > 5) {
      errors.push('Maximum 5 tickets allowed per booking.');
    }

    if (errors.length > 0) {
      res.status(400).json({
        success: false,
        message: 'Validation failed.',
        errors,
      });
      return;
    }

    next();
  },
};
