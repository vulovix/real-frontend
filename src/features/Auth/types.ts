// Authentication enums and constants
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

export enum AuthStatus {
  IDLE = 'idle',
  LOADING = 'loading',
  AUTHENTICATED = 'authenticated',
  UNAUTHENTICATED = 'unauthenticated',
}

export enum AuthActionType {
  LOGIN_REQUEST = 'auth/loginRequest',
  LOGIN_SUCCESS = 'auth/loginSuccess',
  LOGIN_FAILURE = 'auth/loginFailure',
  SIGNUP_REQUEST = 'auth/signupRequest',
  SIGNUP_SUCCESS = 'auth/signupSuccess',
  SIGNUP_FAILURE = 'auth/signupFailure',
  LOGOUT_REQUEST = 'auth/logoutRequest',
  LOGOUT_SUCCESS = 'auth/logoutSuccess',
  LOAD_SESSION_REQUEST = 'auth/loadSessionRequest',
  LOAD_SESSION_SUCCESS = 'auth/loadSessionSuccess',
  LOAD_SESSION_FAILURE = 'auth/loadSessionFailure',
  CLEAR_ERROR = 'auth/clearError',
}

export enum AuthErrorCode {
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  EMAIL_ALREADY_EXISTS = 'EMAIL_ALREADY_EXISTS',
  INVALID_EMAIL_FORMAT = 'INVALID_EMAIL_FORMAT',
  PASSWORD_TOO_WEAK = 'PASSWORD_TOO_WEAK',
  SESSION_EXPIRED = 'SESSION_EXPIRED',
  STORAGE_ERROR = 'STORAGE_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

// Core interfaces
export interface User {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly role: UserRole;
  readonly createdAt: string;
  readonly lastLoginAt?: string;
}

export interface AuthError {
  readonly code: AuthErrorCode;
  readonly message: string;
  readonly timestamp: string;
  readonly details?: Record<string, unknown>;
}

export interface AuthState {
  readonly currentUser: User | null;
  readonly status: AuthStatus;
  readonly error: AuthError | null;
  readonly isInitialized: boolean;
  readonly sessionExpiresAt: string | null;
}

// Request/Response types
export interface LoginCredentials {
  readonly email: string;
  readonly password: string;
  readonly rememberMe?: boolean;
}

export interface SignupData {
  readonly email: string;
  readonly password: string;
  readonly name: string;
  readonly acceptTerms: boolean;
}

export interface AuthResponse {
  readonly user: User;
  readonly sessionToken: string;
  readonly expiresAt: string;
}

// Storage types (internal use only)
export interface StoredUser extends User {
  readonly passwordHash: string;
  readonly salt: string;
}

export interface StoredSession {
  readonly id: string; // Required for IndexedDB
  readonly userId: string;
  readonly token: string;
  readonly expiresAt: string;
  readonly createdAt: string;
}

// Validation schemas
export interface ValidationRule {
  readonly test: (value: string) => boolean;
  readonly message: string;
}

export interface ValidationSchema {
  readonly email: ValidationRule[];
  readonly password: ValidationRule[];
  readonly name: ValidationRule[];
}

// Constants
export const AUTH_CONSTANTS = {
  STORAGE_KEYS: {
    USERS: 'demo_app_users',
    CURRENT_SESSION: 'demo_app_session',
  },
  SESSION_DURATION: {
    DEFAULT: 24 * 60 * 60 * 1000, // 24 hours
    REMEMBER_ME: 30 * 24 * 60 * 60 * 1000, // 30 days
  },
  PASSWORD_REQUIREMENTS: {
    MIN_LENGTH: 8,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBERS: true,
    REQUIRE_SYMBOLS: false,
  },
} as const;
