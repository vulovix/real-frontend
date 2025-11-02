/**
 * News Cache Repository Types and Implementation
 * Manages cached news data in IndexedDB
 */

import { BaseRepository, DATABASE_CONFIG, databaseConnection } from '../Database';

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