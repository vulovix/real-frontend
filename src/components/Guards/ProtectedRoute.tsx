/**
 * ProtectedRoute Guard
 * Only allows access when user is authenticated
 * Shows login/signup form inline if not authenticated (no redirect)
 */

import React, { useState } from 'react';
import { Button, Group } from '@mantine/core';
import { LoginForm } from '../../features/Auth/components/LoginForm';
import { SignupForm } from '../../features/Auth/components/SignupForm';
import { selectAuth, selectIsAuthenticated } from '../../features/Auth/slice';
import { useAppSelector } from '../../store/hooks';
import { AuthLayout } from '../Layout/AuthLayout/AuthLayout';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const authState = useAppSelector(selectAuth);
  const [showSignup, setShowSignup] = useState(false);

  // Don't show anything if auth is still initializing (AuthInitializer handles this)
  if (!authState.isInitialized) {
    return null;
  }

  if (!isAuthenticated) {
    return (
      <AuthLayout
        title={showSignup ? 'Create account' : 'Sign in required'}
        subtitle={
          showSignup
            ? 'Create an account to access this page'
            : 'Please sign in to access this page'
        }
      >
        {showSignup ? <SignupForm /> : <LoginForm />}

        <Group justify="center" mt="md">
          <Button variant="subtle" onClick={() => setShowSignup(!showSignup)} size="sm">
            {showSignup ? 'Already have an account? Sign in' : 'Need an account? Sign up'}
          </Button>
        </Group>
      </AuthLayout>
    );
  }

  return <>{children}</>;
}
