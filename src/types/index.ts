/**
 * EventHub Shared TypeScript Types
 */

export type EventCategory =
  | 'All'
  | 'Technology'
  | 'Music'
  | 'Sports'
  | 'Education'
  | 'Business'
  | 'Entertainment';

export type UserRole = 'attendee' | 'organizer';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  faculty?: string;
  avatarUrl?: string;
  bio?: string;
}

export type User = UserProfile;

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
  faculty?: string;
}

export interface AuthResponse {
  user: UserProfile;
  token?: string;
}

export interface EventItem {
  id: string;
  title: string;
  description: string;
  category: EventCategory | string;
  date: string;
  time: string;
  location: string;
  price: number;
  image: string;
  organizerName: string;
  organizerId?: string;
  availableSeats: number;
  totalSeats: number;
  featured?: boolean;
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
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  ticketsCount: number;
  totalAmount: number;
  status: 'confirmed' | 'cancelled' | 'completed' | 'pending';
  isUpcoming: boolean;
  checkedIn?: boolean;
}

export interface OrganizerStats {
  totalEvents: number;
  totalBookings: number;
  activeEvents: number;
  totalRevenue: number;
}
