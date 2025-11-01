/**
 * Signup Route Page
 * Only accessible when NOT authenticated
 * Displays SignupForm feature in AuthLayout
 */

import React from 'react';
import { AuthLayout } from '../../components/Layout/AuthLayout/AuthLayout';
import { SignupForm } from '../../features/Auth/components/SignupForm';

export function SignupRoute() {
  return (
    <AuthLayout title="Create your account" subtitle="Sign up to get started with our platform">
      <SignupForm />
    </AuthLayout>
  );
}
