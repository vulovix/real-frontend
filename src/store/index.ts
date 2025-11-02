/**
 * Redux Store Configuration
 * Professional setup with Redux Toolkit, Saga middleware, and comprehensive state management
 */

import { configureStore, Middleware } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
// Import reducers
import authReducer from '../features/Auth/slice';
// Import state types
import type { AuthState } from '../features/Auth/types';
import editorReducer from '../features/Editor/slice';
import type { EditorState } from '../features/Editor/types';
import feature1Reducer, { type Feature1State } from '../features/Feature1/slice';
import feature2Reducer, { type Feature2State } from '../features/Feature2/slice';
import newsReducer from '../features/News/slice';
import type { NewsState } from '../features/News/types';
import userManagementReducer from '../features/Users/slice';
import type { UserManagementState } from '../features/Users/types';
// Import root saga
import { rootSaga } from './rootSaga';

// Create saga middleware with error handling
const sagaMiddleware = createSagaMiddleware({
  onError: (error: Error) => {
    // Professional error handling for sagas
    // In development, log to console
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error('Saga Error:', error);
    }

    // In production, you might want to send to error tracking service
    // errorTrackingService.captureException(error);
  },
});

// Additional middleware for development
const additionalMiddleware: Middleware[] = [];

if (process.env.NODE_ENV === 'development') {
  // Additional dev middleware can be added here
}

// Configure store
export const store = configureStore({
  reducer: {
    auth: authReducer,
    editor: editorReducer,
    feature1: feature1Reducer,
    feature2: feature2Reducer,
    userManagement: userManagementReducer,
    news: newsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Redux Toolkit default middleware includes Redux Thunk by default
      thunk: true,
      serializableCheck: {
        // Only ignore specific non-serializable values when necessary
        ignoredActionsPaths: ['payload.error', 'error.stack'],
        ignoredPaths: ['auth.error.stack', 'userManagement.error.stack', 'news.error.stack'],
      },
      immutableCheck: {
        // Ignore these paths for immutability check (for performance)
        ignoredPaths: ['auth.currentUser', 'userManagement.users', 'news.articles'],
      },
    })
      .concat(sagaMiddleware)
      .concat(additionalMiddleware),

  // Enable Redux DevTools in development
  devTools: process.env.NODE_ENV !== 'production',
});

// Run the root saga
sagaMiddleware.run(rootSaga);

// Export types for TypeScript
export interface RootState {
  auth: AuthState;
  editor: EditorState;
  feature1: Feature1State;
  feature2: Feature2State;
  userManagement: UserManagementState;
  news: NewsState;
}

export type AppDispatch = typeof store.dispatch;

// Store helper utilities
export const getState = () => store.getState();
export const dispatch = store.dispatch;

// State selectors for convenience
export const selectAuthState = (state: RootState) => state.auth;
export const selectUserManagementState = (state: RootState) => state.userManagement;
export const selectNewsState = (state: RootState) => state.news;
