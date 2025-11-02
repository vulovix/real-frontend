/**
 * Session management utilities
 */

import { AUTH_CONSTANTS } from '../types';

export class SessionUtils {
  static generateSessionToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
  }

  static calculateExpirationDate(rememberMe: boolean = false): string {
    const now = new Date();
    const duration = rememberMe
      ? AUTH_CONSTANTS.SESSION_DURATION.REMEMBER_ME
      : AUTH_CONSTANTS.SESSION_DURATION.DEFAULT;

    return new Date(now.getTime() + duration).toISOString();
  }

  static isSessionExpired(expiresAt: string): boolean {
    return new Date().getTime() > new Date(expiresAt).getTime();
  }
}
