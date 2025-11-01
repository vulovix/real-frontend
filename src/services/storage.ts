/**
 * Storage service for persisting data in localStorage
 */
class StorageService {
  private prefix = 'redux-app-';

  /**
   * Save data to localStorage
   */
  save<T>(key: string, data: T): void {
    try {
      const serializedData = JSON.stringify(data);
      localStorage.setItem(this.prefix + key, serializedData);
    } catch {
      // Silently fail if localStorage is not available
    }
  }

  /**
   * Load data from localStorage
   */
  load<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(this.prefix + key);
      if (item === null) {
        return defaultValue;
      }
      return JSON.parse(item) as T;
    } catch {
      return defaultValue;
    }
  }

  /**
   * Remove data from localStorage
   */
  remove(key: string): void {
    try {
      localStorage.removeItem(this.prefix + key);
    } catch {
      // Silently fail if localStorage is not available
    }
  }

  /**
   * Clear all app data from localStorage
   */
  clear(): void {
    try {
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.prefix)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((key) => localStorage.removeItem(key));
    } catch {
      // Silently fail if localStorage is not available
    }
  }

  /**
   * Check if localStorage is available
   */
  isAvailable(): boolean {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }
}

// Create and export a singleton instance
export const storageService = new StorageService();
