/**
 * Main Authentication Service
 * Handles user authentication, session management, and user operations
 */

import { RepositoryFactory } from '../../../services/Repository/RepositoryFactory';
import {
  AuthErrorCode,
  AuthResponse,
  LoginCredentials,
  SignupData,
  StoredSession,
  StoredUser,
  User,
  UserRole,
} from '../types';
import { AuthenticationError } from './AuthenticationError';
import { CryptoUtils } from './CryptoUtils';
import { SessionUtils } from './SessionUtils';
import { ValidationUtils } from './ValidationUtils';

export class AuthService {
  private static instance: AuthService | null = null;

  private constructor() {}

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Initialize demo users for testing
   */
  private async initializeDemoUsers(): Promise<void> {
    const userRepo = await RepositoryFactory.getUserRepository();

    try {
      // Always try to create demo users - if they exist, the DB will handle it
      const adminPassword = await CryptoUtils.hashPasswordSecure('Admin123');
      const userPassword = await CryptoUtils.hashPasswordSecure('Password123');

      const adminUser: StoredUser = {
        id: 'admin-demo-user',
        name: 'Demo Admin',
        email: 'admin@newsapp.com',
        role: UserRole.ADMIN,
        passwordHash: adminPassword.hash,
        salt: adminPassword.salt,
        createdAt: new Date().toISOString(),
        lastLoginAt: undefined,
      };

      const demoUser: StoredUser = {
        id: 'demo-user',
        name: 'Demo User',
        email: 'user@newsapp.com',
        role: UserRole.USER,
        passwordHash: userPassword.hash,
        salt: userPassword.salt,
        createdAt: new Date().toISOString(),
        lastLoginAt: undefined,
      };

      // Try to create both users - ignore errors if they already exist
      try {
        await userRepo.create(adminUser);
      } catch (error) {
        // User might already exist, ignore
      }

      try {
        await userRepo.create(demoUser);
      } catch (error) {
        // User might already exist, ignore
      }
    } catch (error) {
      // Initialization failed, but don't prevent login attempt
    }
  }

  /**
   * Simulate network delay for realistic UX
   */
  private async simulateNetworkDelay(): Promise<void> {
    const delay = Math.random() * 800 + 400; // 400-1200ms
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  /**
   * Convert StoredUser to public User interface
   */
  private mapToPublicUser(storedUser: StoredUser): User {
    const { passwordHash, salt, ...publicUser } = storedUser;
    return publicUser;
  }

  /**
   * Create session for user
   */
  private async createSession(
    user: StoredUser,
    rememberMe: boolean = false
  ): Promise<StoredSession> {
    const token = SessionUtils.generateSessionToken();
    const expiresAt = SessionUtils.calculateExpirationDate(rememberMe);

    const session: StoredSession = {
      id: token, // Use token as ID for IndexedDB
      userId: user.id,
      token,
      expiresAt,
      createdAt: new Date().toISOString(),
    };

    // Try to store in database, but continue if it fails (for virtual users)
    try {
      const sessionRepo = await RepositoryFactory.getSessionRepository();
      await sessionRepo.create(session);
    } catch (error) {
      // Session storage failed, but we can still return the session for in-memory use
    }

    return session;
  }

  /**
   * User signup
   */
  async signup(signupData: SignupData): Promise<AuthResponse> {
    await this.simulateNetworkDelay();

    // Validate input
    const validationErrors = ValidationUtils.validateSignupData(signupData);
    if (Object.keys(validationErrors).length > 0) {
      throw new AuthenticationError(AuthErrorCode.INVALID_EMAIL_FORMAT, 'Validation failed', {
        validationErrors,
      });
    }

    const userRepo = await RepositoryFactory.getUserRepository();

    // Check if email already exists
    const existingUser = await userRepo.findByEmail(signupData.email);
    if (existingUser) {
      throw new AuthenticationError(
        AuthErrorCode.EMAIL_ALREADY_EXISTS,
        'An account with this email already exists'
      );
    }

    // Determine user role (first user becomes admin)
    const userCount = await userRepo.count();
    const role = userCount === 0 ? UserRole.ADMIN : UserRole.USER;

    // Hash password
    const { hash, salt } = await CryptoUtils.hashPasswordSecure(signupData.password);

    // Create user
    const now = new Date().toISOString();
    const userId = crypto.randomUUID();

    const newUser: StoredUser = {
      id: userId,
      email: signupData.email.toLowerCase(),
      name: signupData.name.trim(),
      role,
      createdAt: now,
      lastLoginAt: now,
      passwordHash: hash,
      salt,
    };

    await userRepo.create(newUser);

    // Create session
    const session = await this.createSession(newUser, false);

    return {
      user: this.mapToPublicUser(newUser),
      sessionToken: session.token,
      expiresAt: session.expiresAt,
    };
  }

  /**
   * User login
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      await this.simulateNetworkDelay();

      // Initialize demo users if they don't exist
      await this.initializeDemoUsers();

      // Validate input
      const validationErrors = ValidationUtils.validateLoginCredentials(credentials);
      if (Object.keys(validationErrors).length > 0) {
        throw new AuthenticationError(AuthErrorCode.INVALID_CREDENTIALS, 'Invalid credentials', {
          validationErrors,
        });
      }

      const userRepo = await RepositoryFactory.getUserRepository();

      // Find user by email
      const user = await userRepo.findByEmail(credentials.email.toLowerCase());

      if (!user) {
        throw new AuthenticationError(AuthErrorCode.USER_NOT_FOUND, 'Invalid email or password');
      }

      // Verify password using stored hash and salt
      const isPasswordValid = await CryptoUtils.verifyPassword(
        credentials.password,
        user.passwordHash,
        user.salt
      );

      if (!isPasswordValid) {
        throw new AuthenticationError(
          AuthErrorCode.INVALID_CREDENTIALS,
          'Invalid email or password'
        );
      }

      // Update last login time
      const updatedUser = await userRepo.update(user.id, {
        lastLoginAt: new Date().toISOString(),
      });

      // Create session
      const session = await this.createSession(updatedUser, credentials.rememberMe || false);

      return {
        user: this.mapToPublicUser(updatedUser),
        sessionToken: session.token,
        expiresAt: session.expiresAt,
      };
    } catch (error) {
      // Log the error for debugging
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const errorDetails =
        error instanceof AuthenticationError ? error.details : { originalError: error };

      // Re-throw as AuthenticationError if it's not already one
      if (error instanceof AuthenticationError) {
        throw error;
      } else {
        throw new AuthenticationError(
          AuthErrorCode.UNKNOWN_ERROR,
          `Login failed: ${errorMessage}`,
          errorDetails
        );
      }
    }
  }

  /**
   * Load session from token
   */
  async loadSession(token: string): Promise<User | null> {
    try {
      const sessionRepo = await RepositoryFactory.getSessionRepository();
      const userRepo = await RepositoryFactory.getUserRepository();

      // Find valid session
      const session = await sessionRepo.findValidSession(token);
      if (!session) {
        return null;
      }

      // Get user
      const user = await userRepo.findById(session.userId);
      if (!user) {
        // Clean up orphaned session
        await sessionRepo.delete(token);
        return null;
      }

      return this.mapToPublicUser(user);
    } catch (error) {
      // Log error silently - session loading should fail gracefully
      return null;
    }
  }

  /**
   * Logout user
   */
  async logout(token: string): Promise<void> {
    await this.simulateNetworkDelay();

    try {
      const sessionRepo = await RepositoryFactory.getSessionRepository();
      await sessionRepo.delete(token);
    } catch (error) {
      // Don't throw - logout should always succeed from UI perspective
    }
  }

  /**
   * Validate session token
   */
  async validateSession(token: string): Promise<boolean> {
    try {
      const sessionRepo = await RepositoryFactory.getSessionRepository();
      const session = await sessionRepo.findValidSession(token);
      return session !== null;
    } catch (error) {
      return false;
    }
  }

  /**
   * Cleanup expired sessions (maintenance task)
   */
  async cleanupExpiredSessions(): Promise<number> {
    try {
      const sessionRepo = await RepositoryFactory.getSessionRepository();
      return await sessionRepo.cleanupExpiredSessions();
    } catch (error) {
      return 0;
    }
  }
}
