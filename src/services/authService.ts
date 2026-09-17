import { User, LoginCredentials, RegisterData } from '../types';

/**
 * Initial Mock Users Store
 */
const DEFAULT_USERS: Array<User & { passwordHash: string }> = [
  {
    id: 'usr-101',
    name: 'Pavithira Rajendran',
    email: 'student@kln.ac.lk',
    phone: '+94 77 123 4567',
    role: 'attendee',
    faculty: 'Faculty of Computing & Technology',
    bio: 'Software Engineering undergraduate passionate about mobile development.',
    avatarUrl:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    passwordHash: 'password123',
  },
  {
    id: 'org-101',
    name: 'CSSS Society Admin',
    email: 'organizer@kln.ac.lk',
    phone: '+94 71 987 6543',
    role: 'organizer',
    faculty: 'Computer Science Students Society',
    bio: 'Official organizer account for university hackathons, workshops, and tech events.',
    avatarUrl:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    passwordHash: 'organizer123',
  },
];

let usersRegistry = [...DEFAULT_USERS];
let sessionUser: User | null = { ...DEFAULT_USERS[0] }; // Start logged-in as default student or null

/**
 * Authentication Service Interface
 * Prepared for clean drop-in replacement with REST API endpoints in later phases.
 */
export const AuthService = {
  /**
   * Authenticate user with email and password
   */
  async login(credentials: LoginCredentials): Promise<User> {
    // Simulate brief network latency for realistic feel
    await new Promise((res) => setTimeout(res, 400));

    const normalizedEmail = credentials.email.trim().toLowerCase();
    const userRecord = usersRegistry.find(
      (u) => u.email.toLowerCase() === normalizedEmail
    );

    if (!userRecord) {
      throw new Error('No account found with this email address. Please register.');
    }

    if (userRecord.passwordHash !== credentials.password) {
      throw new Error('Incorrect password. Please verify and try again.');
    }

    const { passwordHash, ...safeUser } = userRecord;
    sessionUser = { ...safeUser };
    return safeUser;
  },

  /**
   * Register a new student or organizer account
   */
  async register(data: RegisterData): Promise<User> {
    await new Promise((res) => setTimeout(res, 400));

    const normalizedEmail = data.email.trim().toLowerCase();
    const existing = usersRegistry.find(
      (u) => u.email.toLowerCase() === normalizedEmail
    );

    if (existing) {
      throw new Error('An account with this email address already exists. Please sign in.');
    }

    const newUser: User = {
      id: `usr-${Date.now().toString().slice(-4)}`,
      name: data.name.trim(),
      email: normalizedEmail,
      phone: data.phone || '+94 77 000 0000',
      role: data.role,
      faculty: data.faculty || (data.role === 'organizer' ? 'Student Society' : 'University of Kelaniya'),
      bio: data.role === 'organizer' ? 'Event organizer at University of Kelaniya' : 'Student at University of Kelaniya',
      avatarUrl:
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
    };

    usersRegistry.push({
      ...newUser,
      passwordHash: data.password,
    });

    sessionUser = { ...newUser };
    return newUser;
  },

  /**
   * Logout current session
   */
  async logout(): Promise<void> {
    await new Promise((res) => setTimeout(res, 200));
    sessionUser = null;
  },

  /**
   * Retrieve currently authenticated user session
   */
  async getCurrentUser(): Promise<User | null> {
    return sessionUser ? { ...sessionUser } : null;
  },

  /**
   * Update authenticated user profile
   */
  async updateProfile(userId: string, updates: Partial<User>): Promise<User> {
    await new Promise((res) => setTimeout(res, 300));

    const index = usersRegistry.findIndex((u) => u.id === userId);
    if (index === -1 && !sessionUser) {
      throw new Error('User not found.');
    }

    if (index !== -1) {
      usersRegistry[index] = {
        ...usersRegistry[index],
        ...updates,
      };
    }

    if (sessionUser) {
      sessionUser = {
        ...sessionUser,
        ...updates,
      };
      return { ...sessionUser };
    }

    const updated = usersRegistry[index];
    const { passwordHash, ...safeUser } = updated;
    return safeUser;
  },
};
