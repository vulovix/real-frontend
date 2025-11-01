/**
 * Database Connection Service
 * Handles IndexedDB connection and initialization
 */

import { DATABASE_CONFIG, STORE_SCHEMAS } from './DatabaseConfig';
import { DatabaseError, DatabaseErrorCode, DatabaseErrorHandler } from './DatabaseError';

export class DatabaseConnection {
  private static instance: DatabaseConnection | null = null;
  private database: IDBDatabase | null = null;
  private initializationPromise: Promise<IDBDatabase> | null = null;

  private constructor() {}

  static getInstance(): DatabaseConnection {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = new DatabaseConnection();
    }
    return DatabaseConnection.instance;
  }

  /**
   * Initialize database connection
   */
  async initialize(): Promise<IDBDatabase> {
    if (this.database) {
      return this.database;
    }

    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    this.initializationPromise = this.createConnection();
    try {
      this.database = await this.initializationPromise;
      return this.database;
    } catch (error) {
      this.initializationPromise = null;
      throw error;
    }
  }

  /**
   * Create database connection
   */
  private createConnection(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      if (!('indexedDB' in window)) {
        reject(
          new DatabaseError(
            DatabaseErrorCode.CONNECTION_FAILED,
            'IndexedDB is not supported in this browser'
          )
        );
        return;
      }

      const request = indexedDB.open(DATABASE_CONFIG.NAME, DATABASE_CONFIG.VERSION);

      request.onerror = () => {
        reject(DatabaseErrorHandler.handleError('DatabaseConnection', request.error));
      };

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        this.createStores(db);
      };
    });
  }

  /**
   * Create database stores and indexes
   */
  private createStores(db: IDBDatabase): void {
    Object.entries(STORE_SCHEMAS).forEach(([storeName, schema]) => {
      // Delete existing store if it exists (for upgrades)
      if (db.objectStoreNames.contains(storeName)) {
        db.deleteObjectStore(storeName);
      }

      // Create store
      const store = db.createObjectStore(storeName, {
        keyPath: schema.keyPath,
      });

      // Create indexes
      schema.indexes.forEach(({ name, keyPath, unique }) => {
        store.createIndex(name, keyPath, { unique });
      });
    });
  }

  /**
   * Get database instance
   */
  async getDatabase(): Promise<IDBDatabase> {
    if (!this.database) {
      return this.initialize();
    }
    return this.database;
  }

  /**
   * Close database connection
   */
  close(): void {
    if (this.database) {
      this.database.close();
      this.database = null;
      this.initializationPromise = null;
    }
  }

  /**
   * Delete database
   */
  static async deleteDatabase(): Promise<void> {
    return new Promise((resolve, reject) => {
      const deleteRequest = indexedDB.deleteDatabase(DATABASE_CONFIG.NAME);

      deleteRequest.onerror = () => {
        reject(DatabaseErrorHandler.handleError('DeleteDatabase', deleteRequest.error));
      };

      deleteRequest.onsuccess = () => {
        resolve();
      };
    });
  }
}

// Export singleton instance
export const databaseConnection = DatabaseConnection.getInstance();
