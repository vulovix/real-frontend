/**
 * Database Services Index
 * Centralized exports for all database-related services
 */

export * from './DatabaseConfig';
export * from './DatabaseError';
export * from './DatabaseConnection';
export * from './BaseRepository';

// Re-export for backward compatibility
export { databaseConnection as databaseService } from './DatabaseConnection';
export { DATABASE_CONFIG as DB_CONFIG } from './DatabaseConfig';
