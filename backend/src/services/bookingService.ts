import { BookingItem, SafeUser } from '../types';
import { INITIAL_BOOKINGS } from '../data/mockData';
import { EventService } from './eventService';

let bookings: BookingItem[] = [...INITIAL_BOOKINGS];

export interface CreateBookingDTO {
  eventId: string;
  ticketsCount: number;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
}

export const BookingService = {
  getAllBookings(user?: SafeUser): BookingItem[] {
    if (!user) return [...bookings];
    if (user.role === 'organizer') {
      // Organizers see all bookings across their events or system
      return [...bookings];
    }
    // Students only see their own bookings
    return bookings.filter((b) => b.userId === user.id || b.customerEmail.toLowerCase() === user.email.toLowerCase());
  },

  getBookingById(id: string, user?: SafeUser): BookingItem {
    const found = bookings.find((b) => b.id === id || b.bookingRef === id);
    if (!found) {
      throw { status: 404, message: `Booking '${id}' not found.` };
    }

    if (user && user.role !== 'organizer' && found.userId !== user.id && found.customerEmail.toLowerCase() !== user.email.toLowerCase()) {
      throw { status: 403, message: 'You are not authorized to view this booking.' };
    }

    return found;
  },

  createBooking(dto: CreateBookingDTO, user: SafeUser): BookingItem {
    const event = EventService.getEventById(dto.eventId);

    if (dto.ticketsCount <= 0) {
      throw { status: 400, message: 'Ticket count must be greater than 0.' };
    }

    if (dto.ticketsCount > 5) {
      throw { status: 400, message: 'Maximum 5 tickets allowed per reservation.' };
    }

    if (event.availableSeats < dto.ticketsCount) {
      throw {
        status: 400,
        message: `Not enough available seats. Only ${event.availableSeats} seat(s) remaining.`,
      };
    }

    // Deduct seats
    EventService.adjustSeats(event.id, -dto.ticketsCount);

    const randomRef = `EH-BK-${Math.floor(1000 + Math.random() * 9000)}`;
    const totalAmount = event.price * dto.ticketsCount;

    const newBooking: BookingItem = {
      id: `bk-${Date.now().toString().slice(-5)}`,
      bookingRef: randomRef,
      eventId: event.id,
      eventTitle: event.title,
      eventCategory: event.category,
      eventImage: event.image,
      eventLocation: event.location,
      eventDate: event.date,
      eventTime: event.time,
      bookingDate: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      userId: user.id,
      customerName: dto.customerName?.trim() || user.name,
      customerEmail: dto.customerEmail?.trim() || user.email,
      customerPhone: dto.customerPhone?.trim() || user.phone,
      ticketsCount: dto.ticketsCount,
      totalAmount,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    bookings = [newBooking, ...bookings];
    return newBooking;
  },

  cancelBooking(id: string, user?: SafeUser): BookingItem {
    const index = bookings.findIndex((b) => b.id === id || b.bookingRef === id);
    if (index === -1) {
      throw { status: 404, message: `Booking '${id}' not found.` };
    }

    const booking = bookings[index];

    if (user && user.role !== 'organizer' && booking.userId !== user.id && booking.customerEmail.toLowerCase() !== user.email.toLowerCase()) {
      throw { status: 403, message: 'You are not authorized to cancel this booking.' };
    }

    if (booking.status === 'cancelled') {
      throw { status: 400, message: 'This booking is already cancelled.' };
    }

    // Restore seats to the event
    EventService.adjustSeats(booking.eventId, booking.ticketsCount);

    bookings[index] = {
      ...booking,
      status: 'cancelled',
    };

    return bookings[index];
  },
};
