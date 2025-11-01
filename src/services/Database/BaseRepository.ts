/**
 * Base Repository
 * Generic repository interface and base implementation for database operations
 */

import { DatabaseConnection } from './DatabaseConnection';
import { DatabaseError, DatabaseErrorHandler } from './DatabaseError';

export interface IRepository<T, K = string> {
  create: (item: T) => Promise<K>;
  findById: (id: K) => Promise<T | null>;
  findAll: () => Promise<T[]>;
  update: (id: K, updates: Partial<T>) => Promise<T>;
  delete: (id: K) => Promise<void>;
  clear: () => Promise<void>;
}

export abstract class BaseRepository<T extends { id: string }> implements IRepository<T> {
  protected readonly storeName: string;
  protected readonly dbConnection: DatabaseConnection;

  constructor(storeName: string, dbConnection: DatabaseConnection) {
    this.storeName = storeName;
    this.dbConnection = dbConnection;
  }

  /**
   * Get object store with specified mode
   */
  protected async getStore(mode: IDBTransactionMode = 'readonly'): Promise<IDBObjectStore> {
    const database = await this.dbConnection.getDatabase();
    const transaction = database.transaction([this.storeName], mode);
    return transaction.objectStore(this.storeName);
  }

  /**
   * Handle repository errors
   */
  protected handleError(operation: string, error: unknown): DatabaseError {
    return DatabaseErrorHandler.handleError(`${this.constructor.name}.${operation}`, error);
  }

  /**
   * Create a new item
   */
  async create(item: T): Promise<string> {
    try {
      const store = await this.getStore('readwrite');

      return new Promise<string>((resolve, reject) => {
        const request = store.add(item);

        request.onsuccess = () => {
          resolve(item.id);
        };

        request.onerror = () => {
          reject(this.handleError('create', request.error));
        };
      });
    } catch (error) {
      throw this.handleError('create', error);
    }
  }

  /**
   * Find item by ID
   */
  async findById(id: string): Promise<T | null> {
    try {
      const store = await this.getStore('readonly');

      return new Promise<T | null>((resolve, reject) => {
        const request = store.get(id);

        request.onsuccess = () => {
          resolve(request.result || null);
        };

        request.onerror = () => {
          reject(this.handleError('findById', request.error));
        };
      });
    } catch (error) {
      throw this.handleError('findById', error);
    }
  }

  /**
   * Find all items
   */
  async findAll(): Promise<T[]> {
    try {
      const store = await this.getStore('readonly');

      return new Promise<T[]>((resolve, reject) => {
        const request = store.getAll();

        request.onsuccess = () => {
          resolve(request.result || []);
        };

        request.onerror = () => {
          reject(this.handleError('findAll', request.error));
        };
      });
    } catch (error) {
      throw this.handleError('findAll', error);
    }
  }

  /**
   * Update item
   */
  async update(id: string, updates: Partial<T>): Promise<T> {
    try {
      const existing = await this.findById(id);
      if (!existing) {
        throw new DatabaseError(
          DatabaseError.prototype.constructor.name as any,
          `Item with id ${id} not found`
        );
      }

      const updated = { ...existing, ...updates, id } as T;
      const store = await this.getStore('readwrite');

      return new Promise<T>((resolve, reject) => {
        const request = store.put(updated);

        request.onsuccess = () => {
          resolve(updated);
        };

        request.onerror = () => {
          reject(this.handleError('update', request.error));
        };
      });
    } catch (error) {
      throw this.handleError('update', error);
    }
  }

  /**
   * Delete item by ID
   */
  async delete(id: string): Promise<void> {
    try {
      const store = await this.getStore('readwrite');

      return new Promise<void>((resolve, reject) => {
        const request = store.delete(id);

        request.onsuccess = () => {
          resolve();
        };

        request.onerror = () => {
          reject(this.handleError('delete', request.error));
        };
      });
    } catch (error) {
      throw this.handleError('delete', error);
    }
  }

  /**
   * Clear all items from store
   */
  async clear(): Promise<void> {
    try {
      const store = await this.getStore('readwrite');

      return new Promise<void>((resolve, reject) => {
        const request = store.clear();

        request.onsuccess = () => {
          resolve();
        };

        request.onerror = () => {
          reject(this.handleError('clear', request.error));
        };
      });
    } catch (error) {
      throw this.handleError('clear', error);
    }
  }
}
