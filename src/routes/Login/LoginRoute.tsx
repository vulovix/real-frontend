/**
 * Login Route Page
 * Only accessible when NOT authenticated
 * Displays LoginForm feature in AuthLayout
 */

import React from 'react';
import { AuthLayout } from '../../components/Layout/AuthLayout/AuthLayout';
import { LoginForm } from '../../features/Auth/components/LoginForm';

export function LoginRoute() {
  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to your account to continue">
      <LoginForm />
    </AuthLayout>
  );
}
