import { UserProfile } from '../types';
import { INITIAL_USER } from '../data/mockData';

let userProfileStore: UserProfile = { ...INITIAL_USER };

export const ProfileService = {
  async getProfile(): Promise<UserProfile> {
    return { ...userProfileStore };
  },

  async updateProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    userProfileStore = {
      ...userProfileStore,
      ...updates,
    };
    return { ...userProfileStore };
  },
};
