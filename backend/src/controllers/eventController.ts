import { Request, Response, NextFunction } from 'express';
import { EventService } from '../services/eventService';
import { AuthenticatedRequest } from '../types';

export const eventController = {
  getAllEvents(req: Request, res: Response, next: NextFunction): void {
    try {
      const search = req.query.search as string | undefined;
      const category = req.query.category as string | undefined;

      const events = EventService.getAllEvents(search, category);
      res.status(200).json({
        success: true,
        count: events.length,
        data: events,
      });
    } catch (error) {
      next(error);
    }
  },

  getEventById(req: Request, res: Response, next: NextFunction): void {
    try {
      const event = EventService.getEventById(req.params.id);
      res.status(200).json({
        success: true,
        data: event,
      });
    } catch (error) {
      next(error);
    }
  },

  createEvent(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Authentication required.' });
        return;
      }

      const newEvent = EventService.createEvent(req.body, req.user);
      res.status(201).json({
        success: true,
        message: 'Event created successfully.',
        data: newEvent,
      });
    } catch (error) {
      next(error);
    }
  },

  updateEvent(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Authentication required.' });
        return;
      }

      const updated = EventService.updateEvent(req.params.id, req.body, req.user);
      res.status(200).json({
        success: true,
        message: 'Event updated successfully.',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  },

  deleteEvent(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Authentication required.' });
        return;
      }

      EventService.deleteEvent(req.params.id, req.user);
      res.status(200).json({
        success: true,
        message: `Event '${req.params.id}' deleted successfully.`,
      });
    } catch (error) {
      next(error);
    }
  },
};
