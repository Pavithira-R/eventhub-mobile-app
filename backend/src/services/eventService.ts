import { EventItem, SafeUser } from '../types';
import { INITIAL_EVENTS } from '../data/mockData';

let events: EventItem[] = [...INITIAL_EVENTS];

export interface CreateEventDTO {
  title: string;
  description: string;
  category: string;
  date: string;
  time: string;
  location: string;
  price?: number;
  image?: string;
  totalSeats: number;
  availableSeats?: number;
  featured?: boolean;
}

export const EventService = {
  getAllEvents(search?: string, category?: string): EventItem[] {
    let list = [...events];

    if (category && category.toLowerCase() !== 'all') {
      list = list.filter((e) => e.category.toLowerCase() === category.toLowerCase());
    }

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.location.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          e.organizerName.toLowerCase().includes(q)
      );
    }

    return list;
  },

  getEventById(id: string): EventItem {
    const found = events.find((e) => e.id === id);
    if (!found) {
      throw { status: 404, message: `Event with ID '${id}' not found.` };
    }
    return found;
  },

  createEvent(dto: CreateEventDTO, organizer: SafeUser): EventItem {
    const newEvent: EventItem = {
      id: `evt-${Date.now().toString().slice(-5)}`,
      title: dto.title.trim(),
      description: dto.description.trim(),
      category: dto.category.trim(),
      date: dto.date.trim(),
      time: dto.time.trim(),
      location: dto.location.trim(),
      price: typeof dto.price === 'number' ? dto.price : 0,
      image:
        dto.image ||
        'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
      organizerName: organizer.name,
      organizerId: organizer.id,
      totalSeats: dto.totalSeats,
      availableSeats: typeof dto.availableSeats === 'number' ? dto.availableSeats : dto.totalSeats,
      featured: !!dto.featured,
      createdAt: new Date().toISOString(),
    };

    events = [newEvent, ...events];
    return newEvent;
  },

  updateEvent(id: string, updates: Partial<CreateEventDTO>, organizer: SafeUser): EventItem {
    const index = events.findIndex((e) => e.id === id);
    if (index === -1) {
      throw { status: 404, message: `Event with ID '${id}' not found.` };
    }

    // Check organizer authorization (allow if organizerId matches or admin)
    if (events[index].organizerId && events[index].organizerId !== organizer.id && organizer.role !== 'organizer') {
      throw { status: 403, message: 'You are not authorized to update this event.' };
    }

    events[index] = {
      ...events[index],
      ...updates,
      price: typeof updates.price === 'number' ? updates.price : events[index].price,
      totalSeats: typeof updates.totalSeats === 'number' ? updates.totalSeats : events[index].totalSeats,
      availableSeats: typeof updates.availableSeats === 'number' ? updates.availableSeats : events[index].availableSeats,
    };

    return events[index];
  },

  deleteEvent(id: string, organizer: SafeUser): boolean {
    const index = events.findIndex((e) => e.id === id);
    if (index === -1) {
      throw { status: 404, message: `Event with ID '${id}' not found.` };
    }

    if (events[index].organizerId && events[index].organizerId !== organizer.id && organizer.role !== 'organizer') {
      throw { status: 403, message: 'You are not authorized to delete this event.' };
    }

    events.splice(index, 1);
    return true;
  },

  adjustSeats(id: string, countChange: number): void {
    const index = events.findIndex((e) => e.id === id);
    if (index !== -1) {
      events[index].availableSeats = Math.max(
        0,
        Math.min(events[index].totalSeats, events[index].availableSeats + countChange)
      );
    }
  },
};
