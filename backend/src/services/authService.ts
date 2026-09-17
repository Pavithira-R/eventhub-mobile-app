import { User, SafeUser, UserRole } from '../types';
import { INITIAL_USERS } from '../data/mockData';

let users: User[] = [...INITIAL_USERS];

export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: UserRole;
  faculty?: string;
  bio?: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export const AuthService = {
  findUserByEmail(email: string): User | undefined {
    return users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
  },

  findUserById(id: string): User | undefined {
    return users.find((u) => u.id === id);
  },

  getSafeUser(user: User): SafeUser {
    const { passwordHash, ...safe } = user;
    return safe;
  },

  register(dto: RegisterDTO): { user: SafeUser; token: string } {
    const existing = this.findUserByEmail(dto.email);
    if (existing) {
      throw { status: 409, message: 'An account with this email address already exists.' };
    }

    const newUser: User = {
      id: `usr-${Date.now().toString().slice(-5)}`,
      name: dto.name.trim(),
      email: dto.email.trim().toLowerCase(),
      passwordHash: dto.password,
      phone: dto.phone?.trim() || '+94 77 000 0000',
      role: dto.role || 'student',
      faculty: dto.faculty || (dto.role === 'organizer' ? 'Student Society' : 'University of Kelaniya'),
      bio: dto.bio || (dto.role === 'organizer' ? 'Event organizer' : 'University student'),
      avatarUrl:
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    const token = `eh_token_${newUser.id}_${Buffer.from(newUser.email).toString('base64')}`;

    return {
      user: this.getSafeUser(newUser),
      token,
    };
  },

  login(dto: LoginDTO): { user: SafeUser; token: string } {
    const user = this.findUserByEmail(dto.email);
    if (!user) {
      throw { status: 401, message: 'Invalid email or password.' };
    }

    if (user.passwordHash !== dto.password) {
      throw { status: 401, message: 'Invalid email or password.' };
    }

    const token = `eh_token_${user.id}_${Buffer.from(user.email).toString('base64')}`;

    return {
      user: this.getSafeUser(user),
      token,
    };
  },

  updateProfile(userId: string, updates: Partial<Pick<User, 'name' | 'phone' | 'faculty' | 'bio' | 'email'>>): SafeUser {
    const userIndex = users.findIndex((u) => u.id === userId);
    if (userIndex === -1) {
      throw { status: 404, message: 'User not found.' };
    }

    if (updates.email && updates.email.toLowerCase() !== users[userIndex].email.toLowerCase()) {
      const emailTaken = this.findUserByEmail(updates.email);
      if (emailTaken && emailTaken.id !== userId) {
        throw { status: 409, message: 'This email address is already in use by another account.' };
      }
    }

    users[userIndex] = {
      ...users[userIndex],
      ...updates,
    };

    return this.getSafeUser(users[userIndex]);
  },
};
