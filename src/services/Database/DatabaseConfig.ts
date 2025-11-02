/**
 * Database Configuration
 * Centralized database constants and configuration
 */

export const DATABASE_CONFIG = {
  NAME: 'NewsAppDatabase',
  VERSION: 2, // Incremented for new store
  STORES: {
    USERS: 'users',
    SESSIONS: 'sessions',
    NEWS_CACHE: 'news_cache',
    USER_PREFERENCES: 'user_preferences',
    USER_NEWS_ARTICLES: 'user_news_articles',
  },
} as const;

export const STORE_SCHEMAS = {
  [DATABASE_CONFIG.STORES.USERS]: {
    keyPath: 'id',
    indexes: [
      { name: 'email', keyPath: 'email', unique: true },
      { name: 'role', keyPath: 'role', unique: false },
    ],
  },
  [DATABASE_CONFIG.STORES.SESSIONS]: {
    keyPath: 'id',
    indexes: [
      { name: 'userId', keyPath: 'userId', unique: false },
      { name: 'expiresAt', keyPath: 'expiresAt', unique: false },
    ],
  },
  [DATABASE_CONFIG.STORES.NEWS_CACHE]: {
    keyPath: 'id',
    indexes: [
      { name: 'cachedAt', keyPath: 'cachedAt', unique: false },
      { name: 'expiresAt', keyPath: 'expiresAt', unique: false },
    ],
  },
  [DATABASE_CONFIG.STORES.USER_PREFERENCES]: {
    keyPath: 'id',
    indexes: [],
  },
  [DATABASE_CONFIG.STORES.USER_NEWS_ARTICLES]: {
    keyPath: 'id',
    indexes: [
      { name: 'authorId', keyPath: 'authorId', unique: false },
      { name: 'category', keyPath: 'category', unique: false },
      { name: 'isPublished', keyPath: 'isPublished', unique: false },
      { name: 'createdAt', keyPath: 'createdAt', unique: false },
      { name: 'updatedAt', keyPath: 'updatedAt', unique: false },
    ],
  },
} as const;
