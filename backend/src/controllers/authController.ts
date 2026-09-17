import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';
import { AuthenticatedRequest } from '../types';

export const authController = {
  register(req: Request, res: Response, next: NextFunction): void {
    try {
      const result = AuthService.register(req.body);
      res.status(201).json({
        success: true,
        message: 'Account registered successfully.',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  login(req: Request, res: Response, next: NextFunction): void {
    try {
      const result = AuthService.login(req.body);
      res.status(200).json({
        success: true,
        message: 'Signed in successfully.',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  getProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Authentication required.' });
        return;
      }
      res.status(200).json({
        success: true,
        data: req.user,
      });
    } catch (error) {
      next(error);
    }
  },

  updateProfile(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Authentication required.' });
        return;
      }
      const updated = AuthService.updateProfile(req.user.id, req.body);
      res.status(200).json({
        success: true,
        message: 'Profile updated successfully.',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  },
};
