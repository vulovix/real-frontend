/**
 * Repository Factory
 * Provides singleton access to all repositories with dependency injection
 */

import { databaseConnection } from '../Database';
import { NewsCacheRepository } from './NewsCacheRepository';
import { SessionRepository } from './SessionRepository';
import { UserPreferencesRepository } from './UserPreferencesRepository';
import { UserRepository } from './UserRepository';

export class RepositoryFactory {
  private static userRepository: UserRepository | null = null;
  private static sessionRepository: SessionRepository | null = null;
  private static newsCacheRepository: NewsCacheRepository | null = null;
  private static userPreferencesRepository: UserPreferencesRepository | null = null;

  static async getUserRepository(): Promise<UserRepository> {
    if (!this.userRepository) {
      await databaseConnection.initialize();
      this.userRepository = new UserRepository();
    }
    return this.userRepository;
  }

  static async getSessionRepository(): Promise<SessionRepository> {
    if (!this.sessionRepository) {
      await databaseConnection.initialize();
      this.sessionRepository = new SessionRepository();
    }
    return this.sessionRepository;
  }

  static async getNewsCacheRepository(): Promise<NewsCacheRepository> {
    if (!this.newsCacheRepository) {
      await databaseConnection.initialize();
      this.newsCacheRepository = new NewsCacheRepository();
    }
    return this.newsCacheRepository;
  }

  static async getUserPreferencesRepository(): Promise<UserPreferencesRepository> {
    if (!this.userPreferencesRepository) {
      await databaseConnection.initialize();
      this.userPreferencesRepository = new UserPreferencesRepository();
    }
    return this.userPreferencesRepository;
  }
}