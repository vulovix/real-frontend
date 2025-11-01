/**
 * AuthStorage Service
 * Handles authentication-related storage with proper session management
 */

export interface SessionData {
  token: string;
  userId: string;
  email: string;
  role: string;
  createdAt: string;
  expiresAt: string;
}

export interface AuthStorageConfig {
  sessionDuration: number; // in milliseconds
  storageKey: string;
}

export class AuthStorage {
  private static instance: AuthStorage | null = null;
  private readonly config: AuthStorageConfig;

  private constructor(config: AuthStorageConfig) {
    this.config = config;
  }

  static getInstance(config?: AuthStorageConfig): AuthStorage {
    if (!AuthStorage.instance) {
      const defaultConfig: AuthStorageConfig = {
        sessionDuration: 5 * 60 * 1000, // 5 minutes in milliseconds
        storageKey: 'newsapp_session',
      };
      AuthStorage.instance = new AuthStorage(config || defaultConfig);
    }
    return AuthStorage.instance;
  }

  /**
   * Save session data to localStorage
   */
  saveSession(sessionData: Omit<SessionData, 'createdAt' | 'expiresAt'>): void {
    try {
      const now = new Date();
      const expiresAt = new Date(now.getTime() + this.config.sessionDuration);

      const fullSessionData: SessionData = {
        ...sessionData,
        createdAt: now.toISOString(),
        expiresAt: expiresAt.toISOString(),
      };

      localStorage.setItem(this.config.storageKey, JSON.stringify(fullSessionData));
    } catch (error) {
      // Handle storage quota exceeded or other storage errors
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.warn('Failed to save session to localStorage:', error);
      }
    }
  }

  /**
   * Get session data from localStorage
   * Returns null if session doesn't exist or is expired
   */
  getSession(): SessionData | null {
    try {
      const sessionString = localStorage.getItem(this.config.storageKey);
      if (!sessionString) {
        return null;
      }

      const sessionData: SessionData = JSON.parse(sessionString);

      // Check if session is expired
      if (this.isSessionExpired(sessionData)) {
        this.clearSession();
        return null;
      }

      return sessionData;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.warn('Failed to get session from localStorage:', error);
      }
      return null;
    }
  }

  /**
   * Check if session is expired
   */
  isSessionExpired(sessionData?: SessionData | null): boolean {
    const session = sessionData || this.getSessionUnsafe();
    if (!session) {
      return true;
    }

    const now = new Date();
    const expiresAt = new Date(session.expiresAt);
    return now >= expiresAt;
  }

  /**
   * Get session without expiration check (for internal use)
   */
  private getSessionUnsafe(): SessionData | null {
    try {
      const sessionString = localStorage.getItem(this.config.storageKey);
      if (!sessionString) {
        return null;
      }
      return JSON.parse(sessionString);
    } catch (error) {
      return null;
    }
  }

  /**
   * Get remaining session time in milliseconds
   */
  getRemainingTime(): number {
    const session = this.getSessionUnsafe();
    if (!session) {
      return 0;
    }

    const now = new Date();
    const expiresAt = new Date(session.expiresAt);
    const remaining = expiresAt.getTime() - now.getTime();
    return Math.max(0, remaining);
  }

  /**
   * Check if session exists and is valid
   */
  hasValidSession(): boolean {
    const session = this.getSession();
    return session !== null;
  }

  /**
   * Clear session from localStorage
   */
  clearSession(): void {
    try {
      localStorage.removeItem(this.config.storageKey);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.warn('Failed to clear session from localStorage:', error);
      }
    }
  }

  /**
   * Update session token (but keep same expiration time - no regeneration)
   */
  updateToken(newToken: string): boolean {
    const session = this.getSessionUnsafe();
    if (!session || this.isSessionExpired(session)) {
      return false;
    }

    try {
      const updatedSession: SessionData = {
        ...session,
        token: newToken,
      };
      localStorage.setItem(this.config.storageKey, JSON.stringify(updatedSession));
      return true;
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.warn('Failed to update session token:', error);
      }
      return false;
    }
  }

  /**
   * Get session configuration
   */
  getConfig(): AuthStorageConfig {
    return { ...this.config };
  }
}

// Export singleton instance with default config
export const authStorage = AuthStorage.getInstance();
