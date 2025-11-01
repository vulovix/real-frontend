/**
 * Authentication Redux Slice
 * Professional implementation with Redux Toolkit
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  AuthError,
  AuthErrorCode,
  AuthResponse,
  AuthState,
  AuthStatus,
  LoginCredentials,
  SignupData,
  User,
} from './types';

// Initial state
const initialState: AuthState = {
  currentUser: null,
  status: AuthStatus.IDLE,
  error: null,
  isInitialized: false,
  sessionExpiresAt: null,
};

// Helper function to create auth error
const createAuthError = (
  code: AuthErrorCode,
  message: string,
  details?: Record<string, unknown>
): AuthError => ({
  code,
  message,
  timestamp: new Date().toISOString(),
  details,
});

// Auth slice
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Session initialization
    initializeSessionRequest: (state) => {
      state.status = AuthStatus.LOADING;
      state.error = null;
    },
    initializeSessionSuccess: (
      state,
      action: PayloadAction<{ user: User; expiresAt: string } | null>
    ) => {
      state.isInitialized = true;
      if (action.payload) {
        state.currentUser = action.payload.user;
        state.sessionExpiresAt = action.payload.expiresAt;
        state.status = AuthStatus.AUTHENTICATED;
      } else {
        state.status = AuthStatus.UNAUTHENTICATED;
      }
    },
    initializeSessionFailure: (state, action: PayloadAction<AuthError>) => {
      state.isInitialized = true;
      state.status = AuthStatus.UNAUTHENTICATED;
      state.error = action.payload;
    },

    // Login actions
    loginRequest: (state, _action: PayloadAction<LoginCredentials>) => {
      state.status = AuthStatus.LOADING;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<AuthResponse>) => {
      state.currentUser = action.payload.user;
      state.sessionExpiresAt = action.payload.expiresAt;
      state.status = AuthStatus.AUTHENTICATED;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<AuthError>) => {
      state.currentUser = null;
      state.sessionExpiresAt = null;
      state.status = AuthStatus.UNAUTHENTICATED;
      state.error = action.payload;
    },

    // Signup actions
    signupRequest: (state, _action: PayloadAction<SignupData>) => {
      state.status = AuthStatus.LOADING;
      state.error = null;
    },
    signupSuccess: (state, action: PayloadAction<AuthResponse>) => {
      state.currentUser = action.payload.user;
      state.sessionExpiresAt = action.payload.expiresAt;
      state.status = AuthStatus.AUTHENTICATED;
      state.error = null;
    },
    signupFailure: (state, action: PayloadAction<AuthError>) => {
      state.currentUser = null;
      state.sessionExpiresAt = null;
      state.status = AuthStatus.UNAUTHENTICATED;
      state.error = action.payload;
    },

    // Logout actions
    logoutRequest: (state) => {
      // Keep current state during logout process
      state.error = null;
    },
    logoutSuccess: (state) => {
      state.currentUser = null;
      state.sessionExpiresAt = null;
      state.status = AuthStatus.UNAUTHENTICATED;
      state.error = null;
    },
    logoutFailure: (state, action: PayloadAction<AuthError>) => {
      // Even if logout fails on server, clear local state
      state.currentUser = null;
      state.sessionExpiresAt = null;
      state.status = AuthStatus.UNAUTHENTICATED;
      state.error = action.payload;
    },

    // Session management
    sessionExpired: (state) => {
      state.currentUser = null;
      state.sessionExpiresAt = null;
      state.status = AuthStatus.UNAUTHENTICATED;
      state.error = createAuthError(
        AuthErrorCode.SESSION_EXPIRED,
        'Your session has expired. Please log in again.'
      );
    },

    // Error management
    clearError: (state) => {
      state.error = null;
    },

    // User profile updates (from user management)
    updateUserProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.currentUser) {
        state.currentUser = { ...state.currentUser, ...action.payload };
      }
    },
  },
});

// Action creators
export const {
  initializeSessionRequest,
  initializeSessionSuccess,
  initializeSessionFailure,
  loginRequest,
  loginSuccess,
  loginFailure,
  signupRequest,
  signupSuccess,
  signupFailure,
  logoutRequest,
  logoutSuccess,
  logoutFailure,
  sessionExpired,
  clearError,
  updateUserProfile,
} = authSlice.actions;

// Selectors
export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectCurrentUser = (state: { auth: AuthState }) => state.auth.currentUser;
export const selectIsAuthenticated = (state: { auth: AuthState }) =>
  state.auth.status === AuthStatus.AUTHENTICATED;
export const selectIsLoading = (state: { auth: AuthState }) =>
  state.auth.status === AuthStatus.LOADING;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;
export const selectIsInitialized = (state: { auth: AuthState }) => state.auth.isInitialized;
export const selectIsAdmin = (state: { auth: AuthState }) =>
  state.auth.currentUser?.role === 'admin';

// Export reducer
export default authSlice.reducer;
