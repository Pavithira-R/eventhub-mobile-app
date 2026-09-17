/**
 * EventHub Shared TypeScript Types
 */

export interface EventItem {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  time: string;
  location: string;
  price: number;
  image?: string;
  organizerName: string;
  availableSeats: number;
}

export interface BookingItem {
  id: string;
  eventId: string;
  eventTitle: string;
  bookingDate: string;
  eventDate: string;
  ticketsCount: number;
  totalAmount: number;
  status: 'confirmed' | 'cancelled' | 'pending';
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'attendee' | 'organizer';
  avatarUrl?: string;
}
