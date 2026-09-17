import { BookingItem, OrganizerStats } from '../types';
import { INITIAL_BOOKINGS, MOCK_ATTENDEE_LIST } from '../data/mockData';

let bookingsStore: BookingItem[] = [...INITIAL_BOOKINGS];
let attendeeStore = [...MOCK_ATTENDEE_LIST];

export const BookingService = {
  /**
   * Get all user bookings
   */
  async getBookings(): Promise<BookingItem[]> {
    return [...bookingsStore];
  },

  /**
   * Get upcoming active bookings
   */
  async getUpcomingBookings(): Promise<BookingItem[]> {
    return bookingsStore.filter((b) => b.isUpcoming && b.status !== 'cancelled');
  },

  /**
   * Get past or cancelled bookings
   */
  async getPreviousBookings(): Promise<BookingItem[]> {
    return bookingsStore.filter((b) => !b.isUpcoming || b.status === 'cancelled');
  },

  /**
   * Create a new booking
   */
  async createBooking(
    data: Omit<BookingItem, 'id' | 'bookingRef' | 'bookingDate' | 'status' | 'isUpcoming'>
  ): Promise<BookingItem> {
    const randomRef = `EH-BK-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBooking: BookingItem = {
      ...data,
      id: `bk-${Date.now().toString().slice(-4)}`,
      bookingRef: randomRef,
      bookingDate: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      status: 'confirmed',
      isUpcoming: true,
      checkedIn: false,
    };

    bookingsStore = [newBooking, ...bookingsStore];

    // Also add to attendee store for organizer view
    attendeeStore = [
      {
        bookingRef: randomRef,
        name: data.customerName,
        email: data.customerEmail,
        phone: data.customerPhone || '+94 77 000 0000',
        tickets: data.ticketsCount,
        status: 'confirmed' as const,
        checkedIn: false,
        registeredAt: 'Just now',
      },
      ...attendeeStore,
    ];

    return newBooking;
  },

  /**
   * Cancel an existing booking
   */
  async cancelBooking(bookingId: string): Promise<boolean> {
    const index = bookingsStore.findIndex((b) => b.id === bookingId);
    if (index === -1) return false;

    bookingsStore[index] = {
      ...bookingsStore[index],
      status: 'cancelled',
      isUpcoming: false,
    };
    return true;
  },

  /**
   * Get attendee roster for organizer view
   */
  async getEventAttendees() {
    return [...attendeeStore];
  },

  /**
   * Calculate summary metrics for organizer dashboard
   */
  async getOrganizerStats(): Promise<OrganizerStats> {
    return {
      totalEvents: 6,
      totalBookings: bookingsStore.length + 180,
      activeEvents: 4,
      totalRevenue: 24500,
    };
  },
};
