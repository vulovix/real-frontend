/**
 * User Preferences Repository Types and Implementation
 * Manages user preferences and settings in IndexedDB
 */

import { BaseRepository, DATABASE_CONFIG, DatabaseError, DatabaseErrorCode, databaseConnection } from '../Database';

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