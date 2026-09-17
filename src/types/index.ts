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

export interface EventItem {
  id: string;
  title: string;
  description: string;
  category: EventCategory | string;
  date: string; // e.g. "2026-10-25" or "Oct 25, 2026"
  time: string; // e.g. "09:00 AM"
  location: string;
  price: number; // 0 for Free
  image: string; // Image URL or local asset placeholder
  organizerName: string;
  organizerId?: string;
  availableSeats: number;
  totalSeats: number;
  featured?: boolean;
}

export interface BookingItem {
  id: string; // internal id
  bookingRef: string; // e.g. "EH-BK-7890"
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

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'attendee' | 'organizer';
  faculty?: string;
  avatarUrl?: string;
  bio?: string;
}

export interface OrganizerStats {
  totalEvents: number;
  totalBookings: number;
  activeEvents: number;
  totalRevenue: number;
}
