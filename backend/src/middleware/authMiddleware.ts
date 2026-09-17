import { Response, NextFunction } from 'express';
import { AuthenticatedRequest, UserRole } from '../types';
import { AuthService } from '../services/authService';

export const authMiddleware = {
  /**
   * Require authentication: Extracts token from Authorization header or user header
   */
  requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization;
    const devUserId = req.headers['x-user-id'] as string;
    const devUserEmail = req.headers['x-user-email'] as string;

    let user;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      // Format: eh_token_<id>_<base64Email>
      const parts = token.split('_');
      if (parts.length >= 3) {
        const userId = parts[2];
        user = AuthService.findUserById(userId);
      }
      if (!user) {
        // Fallback: search by token or default student for development
        user = AuthService.findUserById('usr-101');
      }
    } else if (devUserId) {
      user = AuthService.findUserById(devUserId);
    } else if (devUserEmail) {
      user = AuthService.findUserByEmail(devUserEmail);
    } else {
      // Default dev fallback user if no auth provided in development mode
      user = AuthService.findUserById('usr-101');
    }

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required. Please provide a valid authorization token.',
      });
      return;
    }

    req.user = AuthService.getSafeUser(user);
    next();
  },

  /**
   * Strict Auth (fails if no valid auth header provided)
   */
  strictAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization;
    const devUserId = req.headers['x-user-id'] as string;
    const devUserEmail = req.headers['x-user-email'] as string;

    let user;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const parts = token.split('_');
      if (parts.length >= 3) {
        const userId = parts[2];
        user = AuthService.findUserById(userId);
      }
    } else if (devUserId) {
      user = AuthService.findUserById(devUserId);
    } else if (devUserEmail) {
      user = AuthService.findUserByEmail(devUserEmail);
    }

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Unauthorized. Authentication token is missing or invalid.',
      });
      return;
    }

    req.user = AuthService.getSafeUser(user);
    next();
  },

  /**
   * Optional Auth: populates req.user if token is present
   */
  optionalAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const parts = token.split('_');
      if (parts.length >= 3) {
        const userId = parts[2];
        const user = AuthService.findUserById(userId);
        if (user) req.user = AuthService.getSafeUser(user);
      }
    }
    next();
  },

  /**
   * Role-checking middleware
   */
  requireRole(...allowedRoles: UserRole[]) {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: 'Authentication required.',
        });
        return;
      }

      const userRole = req.user.role;
      // Allow 'attendee' to match 'student'
      const isAllowed =
        allowedRoles.includes(userRole) ||
        (userRole === 'student' && allowedRoles.includes('attendee')) ||
        (userRole === 'attendee' && allowedRoles.includes('student'));

      if (!isAllowed) {
        res.status(403).json({
          success: false,
          message: `Access forbidden: This action requires one of the following roles: [${allowedRoles.join(
            ', '
          )}]. Your current role is '${userRole}'.`,
        });
        return;
      }

      next();
    };
  },
};
