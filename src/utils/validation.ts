/**
 * Client-Side Validation Utilities for EventHub Forms
 */

export const Validation = {
  validateEmail(email: string): string | null {
    if (!email || !email.trim()) {
      return 'Email address is required.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return 'Please enter a valid email address.';
    }
    return null;
  },

  validatePassword(password: string, minLength = 6): string | null {
    if (!password) {
      return 'Password is required.';
    }
    if (password.length < minLength) {
      return `Password must be at least ${minLength} characters.`;
    }
    return null;
  },

  validateConfirmPassword(password: string, confirmPassword: string): string | null {
    if (!confirmPassword) {
      return 'Please confirm your password.';
    }
    if (password !== confirmPassword) {
      return 'Passwords do not match.';
    }
    return null;
  },

  validateName(name: string): string | null {
    if (!name || !name.trim()) {
      return 'Full name is required.';
    }
    if (name.trim().length < 2) {
      return 'Name must be at least 2 characters.';
    }
    return null;
  },

  validatePhone(phone?: string): string | null {
    if (!phone || !phone.trim()) return null; // optional
    const phoneRegex = /^(\+?\d{1,4}[\s-]?)?\(?\d{1,4}\)?[\s-]?\d{1,4}[\s-]?\d{1,9}$/;
    if (!phoneRegex.test(phone.trim())) {
      return 'Please enter a valid phone number.';
    }
    return null;
  },
};
