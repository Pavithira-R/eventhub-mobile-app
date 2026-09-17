import { UserProfile } from '../types';
import { AuthService } from './authService';

export const ProfileService = {
  async getProfile(): Promise<UserProfile> {
    const user = await AuthService.getCurrentUser();
    if (user) return user;
    return {
      id: 'usr-guest',
      name: 'Guest Student',
      email: 'guest@kln.ac.lk',
      phone: '+94 77 000 0000',
      role: 'attendee',
      faculty: 'University of Kelaniya',
    };
  },

  async updateProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    const current = await AuthService.getCurrentUser();
    return AuthService.updateProfile(current?.id || 'usr-101', updates);
  },
};
