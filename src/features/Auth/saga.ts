/**
 * Authentication Redux Saga
 * Professional implementation with comprehensive error handling
 */

import { PayloadAction } from '@reduxjs/toolkit';
import { call, delay, fork, put, select, takeEvery, takeLatest } from 'redux-saga/effects';
import { authStorage } from '../../services';
import { AuthenticationError, authService } from './api';
import {
  initializeSessionFailure,
  initializeSessionRequest,
  initializeSessionSuccess,
  loginFailure,
  loginRequest,
  loginSuccess,
  logoutFailure,
  logoutRequest,
  logoutSuccess,
  selectAuth,
  sessionExpired,
  signupFailure,
  signupRequest,
  signupSuccess,
} from './slice';
import {
  AUTH_CONSTANTS,
  AuthErrorCode,
  AuthResponse,
  LoginCredentials,
  SignupData,
  User,
} from './types';

// Session management utilities (now using AuthStorage service)
class SessionStorageUtils {
  static saveSessionData(token: string, user: User): void {
    try {
      const sessionData = {
        token,
        userId: user.id,
        email: user.email,
        role: user.role,
      };
      authStorage.saveSession(sessionData);
    } catch (error) {
      // Handle storage errors silently
    }
  }

  static getSessionToken(): string | null {
    try {
      const session = authStorage.getSession();
      return session?.token || null;
    } catch (error) {
      return null;
    }
  }

  static removeSessionToken(): void {
    try {
      authStorage.clearSession();
    } catch (error) {
      // Ignore errors when removing
    }
  }
}

// Error handling utilities
class SagaErrorHandler {
  static handleAuthError(error: unknown): {
    code: AuthErrorCode;
    message: string;
    details?: Record<string, unknown>;
  } {
    if (error instanceof AuthenticationError) {
      return {
        code: error.code,
        message: error.message,
        details: error.details,
      };
    }

    if (error instanceof Error) {
      return {
        code: AuthErrorCode.UNKNOWN_ERROR,
        message: error.message,
      };
    }

    return {
      code: AuthErrorCode.UNKNOWN_ERROR,
      message: 'An unexpected error occurred',
    };
  }

  static createAuthError(code: AuthErrorCode, message: string, details?: Record<string, unknown>) {
    return {
      code,
      message,
      timestamp: new Date().toISOString(),
      details,
    };
  }
}

// Type-safe saga generators
type AuthSagaGenerator<T = void> = Generator<any, T, any>;

// Initialize session saga
function* initializeSessionSaga(): AuthSagaGenerator {
  try {
    // Add random delay for better UX (400ms to 1000ms)
    const randomDelay = Math.floor(Math.random() * (1000 - 400 + 1)) + 400;
    yield delay(randomDelay);

    const token = SessionStorageUtils.getSessionToken();

    if (!token) {
      yield put(initializeSessionSuccess(null));
      return;
    }

    // Validate session with server
    const user = yield call(authService.loadSession.bind(authService), token);

    if (user) {
      // Session is valid
      const authState = yield select(selectAuth);
      yield put(
        initializeSessionSuccess({
          user: user as User,
          expiresAt:
            (authState as any).sessionExpiresAt ||
            new Date(Date.now() + AUTH_CONSTANTS.SESSION_DURATION.DEFAULT).toISOString(),
        })
      );
    } else {
      // Session is invalid or expired
      SessionStorageUtils.removeSessionToken();
      yield put(initializeSessionSuccess(null));
    }
  } catch (error) {
    const authError = SagaErrorHandler.handleAuthError(error);
    SessionStorageUtils.removeSessionToken();
    yield put(
      initializeSessionFailure(
        SagaErrorHandler.createAuthError(authError.code, authError.message, authError.details)
      )
    );
  }
}

// Login saga
function* loginSaga(action: PayloadAction<LoginCredentials>): AuthSagaGenerator {
  try {
    const response = yield call(authService.login.bind(authService), action.payload);

    // Save session data
    SessionStorageUtils.saveSessionData(
      (response as AuthResponse).sessionToken,
      (response as AuthResponse).user
    );

    yield put(loginSuccess(response as AuthResponse));
  } catch (error) {
    const authError = SagaErrorHandler.handleAuthError(error);
    yield put(
      loginFailure(
        SagaErrorHandler.createAuthError(authError.code, authError.message, authError.details)
      )
    );
  }
}

// Signup saga
function* signupSaga(action: PayloadAction<SignupData>): AuthSagaGenerator {
  try {
    const response = yield call(authService.signup.bind(authService), action.payload);

    // Save session data
    SessionStorageUtils.saveSessionData(
      (response as AuthResponse).sessionToken,
      (response as AuthResponse).user
    );

    yield put(signupSuccess(response as AuthResponse));
  } catch (error) {
    const authError = SagaErrorHandler.handleAuthError(error);
    yield put(
      signupFailure(
        SagaErrorHandler.createAuthError(authError.code, authError.message, authError.details)
      )
    );
  }
}

// Logout saga
function* logoutSaga(): AuthSagaGenerator {
  try {
    const token = SessionStorageUtils.getSessionToken();

    if (token) {
      // Attempt to logout on server
      yield call(authService.logout.bind(authService), token);
    }

    // Always clear local session regardless of server response
    SessionStorageUtils.removeSessionToken();
    yield put(logoutSuccess());
  } catch (error) {
    // Always clear local session even if server logout fails
    SessionStorageUtils.removeSessionToken();
    const authError = SagaErrorHandler.handleAuthError(error);
    yield put(
      logoutFailure(
        SagaErrorHandler.createAuthError(authError.code, authError.message, authError.details)
      )
    );
  }
}

// Session monitoring saga
function* sessionMonitorSaga(): AuthSagaGenerator {
  while (true) {
    try {
      // Check every minute
      yield delay(60 * 1000);

      const authState = yield select(selectAuth);

      if ((authState as any).status === 'authenticated' && (authState as any).sessionExpiresAt) {
        const now = new Date().getTime();
        const expiresAt = new Date((authState as any).sessionExpiresAt).getTime();

        // Check if session expires in next 5 minutes
        const fiveMinutes = 5 * 60 * 1000;
        if (now + fiveMinutes > expiresAt) {
          yield put(sessionExpired());
          SessionStorageUtils.removeSessionToken();
          break; // Stop monitoring after expiration
        }
      }
    } catch (error) {
      // Continue monitoring even if there's an error
      yield delay(60 * 1000);
    }
  }
}

// Cleanup saga - runs maintenance tasks
function* cleanupSaga(): AuthSagaGenerator {
  while (true) {
    try {
      // Run cleanup every 30 minutes
      yield delay(30 * 60 * 1000);

      // Cleanup expired sessions in IndexedDB
      yield call(authService.cleanupExpiredSessions.bind(authService));
    } catch (error) {
      // Continue cleanup cycle even if there's an error
    }
  }
}

// Root auth saga
export function* authSaga(): AuthSagaGenerator {
  yield fork(sessionMonitorSaga);
  yield fork(cleanupSaga);

  yield takeLatest(initializeSessionRequest.type, initializeSessionSaga);
  yield takeEvery(loginRequest.type, loginSaga);
  yield takeEvery(signupRequest.type, signupSaga);
  yield takeEvery(logoutRequest.type, logoutSaga);
}

// Export individual sagas for testing
export {
  initializeSessionSaga,
  loginSaga,
  signupSaga,
  logoutSaga,
  sessionMonitorSaga,
  cleanupSaga,
};
