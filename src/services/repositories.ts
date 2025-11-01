/**
 * Repository implementations for Auth system
 */

import type { StoredSession, StoredUser } from '../features/Auth/types';
import {
  BaseRepository,
  DATABASE_CONFIG,
  databaseConnection,
  DatabaseError,
  DatabaseErrorCode,
} from './Database';

// User repository for managing user data
export class UserRepository extends BaseRepository<StoredUser> {
  constructor() {
    super(DATABASE_CONFIG.STORES.USERS, databaseConnection);
  }

  /**
   * Find user by email address
   */
  async findByEmail(email: string): Promise<StoredUser | null> {
    try {
      const store = await this.getStore('readonly');
      const index = store.index('email');

      return new Promise((resolve, reject) => {
        const request = index.get(email);

        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => reject(this.handleError('FindByEmail', request.error));
      });
    } catch (error) {
      throw this.handleError('FindByEmail', error);
    }
  }

  /**
   * Check if email already exists
   */
  async emailExists(email: string): Promise<boolean> {
    const user = await this.findByEmail(email);
    return user !== null;
  }

  /**
   * Get all users with a specific role
   */
  async findByRole(role: string): Promise<StoredUser[]> {
    try {
      const store = await this.getStore('readonly');
      const index = store.index('role');

      return new Promise((resolve, reject) => {
        const request = index.getAll(role);

        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => reject(this.handleError('FindByRole', request.error));
      });
    } catch (error) {
      throw this.handleError('FindByRole', error);
    }
  }

  /**
   * Count total users in the system
   */
  async count(): Promise<number> {
    try {
      const store = await this.getStore('readonly');

      return new Promise((resolve, reject) => {
        const request = store.count();

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(this.handleError('Count', request.error));
      });
    } catch (error) {
      throw this.handleError('Count', error);
    }
  }
}

// Session repository for managing user sessions
export class SessionRepository extends BaseRepository<StoredSession> {
  constructor() {
    super(DATABASE_CONFIG.STORES.SESSIONS, databaseConnection);
  }

  /**
   * Find sessions by user ID
   */
  async findByUserId(userId: string): Promise<StoredSession[]> {
    try {
      const store = await this.getStore('readonly');
      const index = store.index('userId');

      return new Promise((resolve, reject) => {
        const request = index.getAll(userId);

        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => reject(this.handleError('FindByUserId', request.error));
      });
    } catch (error) {
      throw this.handleError('FindByUserId', error);
    }
  }

  /**
   * Find valid session by token
   */
  async findValidSession(token: string): Promise<StoredSession | null> {
    try {
      const session = await this.findById(token);

      if (!session) {
        return null;
      }

      // Check if session is expired
      const now = new Date().getTime();
      const expiresAt = new Date(session.expiresAt).getTime();

      if (now > expiresAt) {
        // Clean up expired session
        await this.delete(token);
        return null;
      }

      return session;
    } catch (error) {
      throw this.handleError('FindValidSession', error);
    }
  }

  /**
   * Clean up expired sessions
   */
  async cleanupExpiredSessions(): Promise<number> {
    try {
      const store = await this.getStore('readwrite');
      const index = store.index('expiresAt');
      const now = new Date().toISOString();

      return new Promise((resolve, reject) => {
        let deletedCount = 0;
        const range = IDBKeyRange.upperBound(now);
        const request = index.openCursor(range);

        request.onsuccess = (event) => {
          const cursor = (event.target as IDBRequest).result;
          if (cursor) {
            cursor.delete();
            deletedCount++;
            cursor.continue();
          } else {
            resolve(deletedCount);
          }
        };

        request.onerror = () => reject(this.handleError('CleanupExpiredSessions', request.error));
      });
    } catch (error) {
      throw this.handleError('CleanupExpiredSessions', error);
    }
  }

  /**
   * Invalidate all sessions for a user
   */
  async invalidateUserSessions(userId: string): Promise<void> {
    try {
      const sessions = await this.findByUserId(userId);

      for (const session of sessions) {
        await this.delete(session.token);
      }
    } catch (error) {
      throw this.handleError('InvalidateUserSessions', error);
    }
  }
}

// News cache repository for caching external API data
export interface CachedNewsItem {
  readonly id: string;
  readonly title: string;
  readonly content: string;
  readonly sourceUrl: string;
  readonly imageUrl?: string;
  readonly publishedAt: string;
  readonly cachedAt: string;
  readonly expiresAt: string;
}

export class NewsCacheRepository extends BaseRepository<CachedNewsItem> {
  constructor() {
    super(DATABASE_CONFIG.STORES.NEWS_CACHE, databaseConnection);
  }

  /**
   * Get cached item by key
   */
  async get(key: string): Promise<CachedNewsItem | null> {
    try {
      return await this.findById(key);
    } catch (error) {
      throw this.handleError('Get', error);
    }
  }

  /**
   * Set cached item
   */
  async set(key: string, item: CachedNewsItem): Promise<void> {
    try {
      const existing = await this.findById(key);
      if (existing) {
        await this.update(key, item);
      } else {
        await this.create({ ...item, id: key });
      }
    } catch (error) {
      throw this.handleError('Set', error);
    }
  }

  /**
   * Get valid cached news (not expired)
   */
  async getValidCache(): Promise<CachedNewsItem[]> {
    try {
      const allItems = await this.findAll();
      const now = new Date().getTime();

      return allItems.filter((item) => {
        const expiresAt = new Date(item.expiresAt).getTime();
        return now < expiresAt;
      });
    } catch (error) {
      throw this.handleError('GetValidCache', error);
    }
  }

  /**
   * Clean up expired cache entries
   */
  async cleanupExpiredCache(): Promise<number> {
    try {
      const store = await this.getStore('readwrite');
      const index = store.index('cachedAt');
      const now = new Date().toISOString();

      return new Promise((resolve, reject) => {
        let deletedCount = 0;
        const request = index.openCursor();

        request.onsuccess = (event) => {
          const cursor = (event.target as IDBRequest).result;
          if (cursor) {
            const item = cursor.value as CachedNewsItem;
            const expiresAt = new Date(item.expiresAt).getTime();
            const nowTime = new Date(now).getTime();

            if (nowTime > expiresAt) {
              cursor.delete();
              deletedCount++;
            }
            cursor.continue();
          } else {
            resolve(deletedCount);
          }
        };

        request.onerror = () => reject(this.handleError('CleanupExpiredCache', request.error));
      });
    } catch (error) {
      throw this.handleError('CleanupExpiredCache', error);
    }
  }
}

// User preferences repository
export interface UserPreferences {
  readonly id: string; // This will be the userId
  readonly userId: string;
  readonly theme: 'light' | 'dark' | 'auto';
  readonly language: string;
  readonly notifications: {
    readonly email: boolean;
    readonly push: boolean;
    readonly inApp: boolean;
  };
  readonly privacy: {
    readonly profileVisible: boolean;
    readonly analyticsEnabled: boolean;
  };
  readonly updatedAt: string;
}

export class UserPreferencesRepository extends BaseRepository<UserPreferences> {
  constructor() {
    super(DATABASE_CONFIG.STORES.USER_PREFERENCES, databaseConnection);
  }

  /**
   * Get preferences for a user (with defaults if not found)
   */
  async getPreferencesWithDefaults(userId: string): Promise<UserPreferences> {
    try {
      const existing = await this.findById(userId);

      if (existing) {
        return existing;
      }

      // Return default preferences
      const defaults: UserPreferences = {
        id: userId,
        userId,
        theme: 'auto',
        language: 'en',
        notifications: {
          email: true,
          push: false,
          inApp: true,
        },
        privacy: {
          profileVisible: true,
          analyticsEnabled: true,
        },
        updatedAt: new Date().toISOString(),
      };

      // Save defaults to database
      await this.create(defaults);
      return defaults;
    } catch (error) {
      throw this.handleError('GetPreferencesWithDefaults', error);
    }
  }

  /**
   * Get news preferences for a user
   */
  async getNewsPreferences(userId: string): Promise<any | null> {
    try {
      // For this demo, we'll store news preferences separately as JSON
      // In a real app, you'd extend UserPreferences interface
      const store = await this.getStore('readonly');
      const request = store.get(`news_${userId}`);

      return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () =>
          reject(
            new DatabaseError(DatabaseErrorCode.UNKNOWN_ERROR, 'Failed to get news preferences')
          );
      });
    } catch (error) {
      throw this.handleError('GetNewsPreferences', error);
    }
  }

  /**
   * Set news preferences for a user
   */
  async setNewsPreferences(userId: string, preferences: any): Promise<void> {
    try {
      const store = await this.getStore('readwrite');
      const request = store.put(preferences, `news_${userId}`);

      return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve();
        request.onerror = () =>
          reject(
            new DatabaseError(DatabaseErrorCode.UNKNOWN_ERROR, 'Failed to set news preferences')
          );
      });
    } catch (error) {
      throw this.handleError('SetNewsPreferences', error);
    }
  }
}

// Repository factory for dependency injection
export class RepositoryFactory {
  private static userRepository: UserRepository | null = null;
  private static sessionRepository: SessionRepository | null = null;
  private static newsCacheRepository: NewsCacheRepository | null = null;
  private static userPreferencesRepository: UserPreferencesRepository | null = null;

  static async getUserRepository(): Promise<UserRepository> {
    if (!this.userRepository) {
      await databaseConnection.initialize();
      this.userRepository = new UserRepository();
    }
    return this.userRepository;
  }

  static async getSessionRepository(): Promise<SessionRepository> {
    if (!this.sessionRepository) {
      await databaseConnection.initialize();
      this.sessionRepository = new SessionRepository();
    }
    return this.sessionRepository;
  }

  static async getNewsCacheRepository(): Promise<NewsCacheRepository> {
    if (!this.newsCacheRepository) {
      await databaseConnection.initialize();
      this.newsCacheRepository = new NewsCacheRepository();
    }
    return this.newsCacheRepository;
  }

  static async getUserPreferencesRepository(): Promise<UserPreferencesRepository> {
    if (!this.userPreferencesRepository) {
      await databaseConnection.initialize();
      this.userPreferencesRepository = new UserPreferencesRepository();
    }
    return this.userPreferencesRepository;
  }
}
