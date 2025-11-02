/**
 * Repositories Export
 * Centralized exports for all repository classes and types
 */

// Repository implementations
export { UserRepository } from './UserRepository';
export { SessionRepository } from './SessionRepository';
export { NewsCacheRepository, type CachedNewsItem } from './NewsCacheRepository';
export { UserPreferencesRepository, type UserPreferences } from './UserPreferencesRepository';
export { RepositoryFactory } from './RepositoryFactory';