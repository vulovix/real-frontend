/**
 * Session Repository
 * Manages user sessions in IndexedDB
 */

import type { StoredSession } from '../../features/Auth/types';
import { BaseRepository, DATABASE_CONFIG, databaseConnection } from '../Database';

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