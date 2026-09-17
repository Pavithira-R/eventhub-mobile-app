import { EventItem, EventCategory } from '../types';
import { INITIAL_EVENTS } from '../data/mockData';

// In-memory store for reactive mockup behavior
let eventsStore: EventItem[] = [...INITIAL_EVENTS];

export const EventService = {
  /**
   * Get all events, with optional search and category filters
   */
  async getEvents(query = '', category: EventCategory | 'All' = 'All'): Promise<EventItem[]> {
    let results = [...eventsStore];

    if (category && category !== 'All') {
      results = results.filter(
        (e) => e.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (query && query.trim().length > 0) {
      const q = query.trim().toLowerCase();
      results = results.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.location.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q)
      );
    }

    return results;
  },

  /**
   * Get featured events for discovery hero carousel
   */
  async getFeaturedEvents(): Promise<EventItem[]> {
    return eventsStore.filter((e) => e.featured);
  },

  /**
   * Find single event by its ID
   */
  async getEventById(id: string): Promise<EventItem | undefined> {
    return eventsStore.find((e) => e.id === id);
  },

  /**
   * Add a new event (for organizer workflow)
   */
  async createEvent(data: Omit<EventItem, 'id'>): Promise<EventItem> {
    const newEvent: EventItem = {
      ...data,
      id: `evt-${Date.now().toString().slice(-4)}`,
    };
    eventsStore = [newEvent, ...eventsStore];
    return newEvent;
  },

  /**
   * Update an existing event
   */
  async updateEvent(id: string, updates: Partial<EventItem>): Promise<EventItem | null> {
    const index = eventsStore.findIndex((e) => e.id === id);
    if (index === -1) return null;

    eventsStore[index] = { ...eventsStore[index], ...updates };
    return eventsStore[index];
  },

  /**
   * Delete an event from store
   */
  async deleteEvent(id: string): Promise<boolean> {
    const initialLen = eventsStore.length;
    eventsStore = eventsStore.filter((e) => e.id !== id);
    return eventsStore.length < initialLen;
  },

  /**
   * Get organizer events list
   */
  async getOrganizerEvents(): Promise<EventItem[]> {
    return [...eventsStore];
  },
};
