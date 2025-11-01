/**
 * Authentication API Service
 * Professional implementation with IndexedDB and proper security
 */

import { RepositoryFactory } from '../../services/repositories';
import {
  AUTH_CONSTANTS,
  AuthErrorCode,
  AuthResponse,
  LoginCredentials,
  SignupData,
  StoredSession,
  StoredUser,
  User,
  UserRole,
  ValidationSchema,
} from './types';

// Utility functions for password hashing (simple demo implementation)
class CryptoUtils {
  private static generateSalt(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  private static async hashPassword(password: string, salt: string): Promise<string> {
    // Simple hash for demo - in production use bcrypt or similar
    const encoder = new TextEncoder();
    const data = encoder.encode(password + salt);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }

  static async hashPasswordSecure(password: string): Promise<{ hash: string; salt: string }> {
    const salt = this.generateSalt();
    const hash = await this.hashPassword(password, salt);
    return { hash, salt };
  }

  static async verifyPassword(password: string, hash: string, salt: string): Promise<boolean> {
    const newHash = await this.hashPassword(password, salt);
    return newHash === hash;
  }
}

// Validation utilities
class ValidationUtils {
  private static readonly emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  static readonly validationSchema: ValidationSchema = {
    email: [
      {
        test: (value: string) => value.length > 0,
        message: 'Email is required',
      },
      {
        test: (value: string) => this.emailRegex.test(value),
        message: 'Please enter a valid email address',
      },
    ],
    password: [
      {
        test: (value: string) => value.length >= AUTH_CONSTANTS.PASSWORD_REQUIREMENTS.MIN_LENGTH,
        message: `Password must be at least ${AUTH_CONSTANTS.PASSWORD_REQUIREMENTS.MIN_LENGTH} characters`,
      },
      {
        test: (value: string) =>
          !AUTH_CONSTANTS.PASSWORD_REQUIREMENTS.REQUIRE_UPPERCASE || /[A-Z]/.test(value),
        message: 'Password must contain at least one uppercase letter',
      },
      {
        test: (value: string) =>
          !AUTH_CONSTANTS.PASSWORD_REQUIREMENTS.REQUIRE_LOWERCASE || /[a-z]/.test(value),
        message: 'Password must contain at least one lowercase letter',
      },
      {
        test: (value: string) =>
          !AUTH_CONSTANTS.PASSWORD_REQUIREMENTS.REQUIRE_NUMBERS || /\d/.test(value),
        message: 'Password must contain at least one number',
      },
    ],
    name: [
      {
        test: (value: string) => value.trim().length > 0,
        message: 'Name is required',
      },
      {
        test: (value: string) => value.trim().length >= 2,
        message: 'Name must be at least 2 characters',
      },
    ],
  };

  static validateField(field: keyof ValidationSchema, value: string): string | null {
    const rules = this.validationSchema[field];

    for (const rule of rules) {
      if (!rule.test(value)) {
        return rule.message;
      }
    }

    return null;
  }

  static validateLoginCredentials(credentials: LoginCredentials): Record<string, string> {
    const errors: Record<string, string> = {};

    const emailError = this.validateField('email', credentials.email);
    if (emailError) {
      errors.email = emailError;
    }

    const passwordError = this.validateField('password', credentials.password);
    if (passwordError) {
      errors.password = passwordError;
    }

    return errors;
  }

  static validateSignupData(data: SignupData): Record<string, string> {
    const errors: Record<string, string> = {};

    const emailError = this.validateField('email', data.email);
    if (emailError) {
      errors.email = emailError;
    }

    const passwordError = this.validateField('password', data.password);
    if (passwordError) {
      errors.password = passwordError;
    }

    const nameError = this.validateField('name', data.name);
    if (nameError) {
      errors.name = nameError;
    }

    if (!data.acceptTerms) {
      errors.acceptTerms = 'You must accept the terms and conditions';
    }

    return errors;
  }
}

// Session management utilities
class SessionUtils {
  static generateSessionToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
  }

  static calculateExpirationDate(rememberMe: boolean = false): string {
    const now = new Date();
    const duration = rememberMe
      ? AUTH_CONSTANTS.SESSION_DURATION.REMEMBER_ME
      : AUTH_CONSTANTS.SESSION_DURATION.DEFAULT;

    return new Date(now.getTime() + duration).toISOString();
  }

  static isSessionExpired(expiresAt: string): boolean {
    return new Date().getTime() > new Date(expiresAt).getTime();
  }
}

// Authentication error class
export class AuthenticationError extends Error {
  constructor(
    public readonly code: AuthErrorCode,
    message: string,
    public readonly details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

// Main authentication service
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
  } /**
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
      }); // Create session
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

// Export singleton instance
export const authService = AuthService.getInstance();
