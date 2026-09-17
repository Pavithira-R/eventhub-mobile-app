import { Request } from 'express';

export type UserRole = 'student' | 'organizer' | 'attendee';

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  phone?: string;
  role: UserRole;
  faculty?: string;
  bio?: string;
  avatarUrl?: string;
  createdAt: string;
}

export type SafeUser = Omit<User, 'passwordHash'>;

export interface EventItem {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  time: string;
  location: string;
  price: number;
  image: string;
  organizerName: string;
  organizerId: string;
  availableSeats: number;
  totalSeats: number;
  featured?: boolean;
  createdAt: string;
}

export interface BookingItem {
  id: string;
  bookingRef: string;
  eventId: string;
  eventTitle: string;
  eventCategory?: string;
  eventImage?: string;
  eventLocation?: string;
  eventDate: string;
  eventTime?: string;
  bookingDate: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  ticketsCount: number;
  totalAmount: number;
  status: 'confirmed' | 'cancelled';
  createdAt: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: string[];
  count?: number;
}

export interface AuthenticatedRequest extends Request {
  user?: SafeUser;
}
