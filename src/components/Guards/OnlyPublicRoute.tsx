/**
 * OnlyPublicRoute Guard
 * Only allows access when user is NOT authenticated
 * Redirects to dashboard if already authenticated
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { selectAuth, selectIsAuthenticated } from '../../features/Auth/slice';
import { useAppSelector } from '../../store/hooks';

interface OnlyPublicRouteProps {
  children: React.ReactNode;
}

export function OnlyPublicRoute({ children }: OnlyPublicRouteProps) {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const authState = useAppSelector(selectAuth);

  // Don't show anything if auth is still initializing (AuthInitializer handles this)
  if (!authState.isInitialized) {
    return null;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
