/**
 * User Repository
 * Manages user data in IndexedDB
 */

import type { StoredUser } from '../../features/Auth/types';
import { BaseRepository, DATABASE_CONFIG, databaseConnection } from '../Database';

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