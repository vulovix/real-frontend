/**
 * LoginForm Feature Component
 * Contains all login logic and UI
 */

import React, { useEffect, useState } from 'react';
import { IconAlertCircle, IconLock, IconMail } from '@tabler/icons-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Alert,
  Anchor,
  Button,
  Checkbox,
  Divider,
  PasswordInput,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { loginRequest, selectAuth, selectIsAuthenticated } from '../slice';
import { AuthStatus, LoginCredentials } from '../types';

export function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const authState = useAppSelector(selectAuth);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  // Form state
  const [formData, setFormData] = useState<LoginCredentials>({
    email: '',
    password: '',
    rememberMe: false,
  });

  // Form validation errors
  const [formErrors, setFormErrors] = useState({
    email: '',
    password: '',
  });

  // Loading state
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already authenticated (only if we're on dedicated login page)
  useEffect(() => {
    if (isAuthenticated && (location.pathname === '/login' || location.pathname === '/signup')) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate, location.pathname]);

  // Validation functions
  const validateEmail = (email: string): string => {
    if (!email) {
      return 'Email is required';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return 'Please enter a valid email address';
    }
    return '';
  };

  const validatePassword = (password: string): string => {
    if (!password) {
      return 'Password is required';
    }
    if (password.length < 6) {
      return 'Password must be at least 6 characters';
    }
    return '';
  };

  // Handle form input changes
  const handleInputChange = (field: keyof LoginCredentials, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (field === 'email' || field === 'password') {
      setFormErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) {
      return;
    }

    // Validate form
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);

    if (emailError || passwordError) {
      setFormErrors({
        email: emailError,
        password: passwordError,
      });
      return;
    }

    setIsSubmitting(true);
    dispatch(loginRequest(formData));
  };

  // Reset submitting state when status changes
  useEffect(() => {
    if (authState.status !== AuthStatus.LOADING) {
      setIsSubmitting(false);
    }
  }, [authState.status]);

  // Demo credentials helper
  const fillDemoCredentials = (userType: 'admin' | 'user') => {
    if (userType === 'admin') {
      setFormData({
        email: 'admin@newsapp.com',
        password: 'Admin123',
        rememberMe: false,
      });
    } else {
      setFormData({
        email: 'user@newsapp.com',
        password: 'Password123',
        rememberMe: false,
      });
    }

    // Clear any existing errors
    setFormErrors({ email: '', password: '' });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="md">
        {authState.error && (
          <Alert
            icon={<IconAlertCircle size={16} />}
            title="Authentication Error"
            color="red"
            variant="light"
          >
            {authState.error.message}
            {authState.error.details && (
              <pre style={{ marginTop: '8px', fontSize: '12px', whiteSpace: 'pre-wrap' }}>
                {JSON.stringify(authState.error.details, null, 2)}
              </pre>
            )}
          </Alert>
        )}

        <TextInput
          label="Email"
          placeholder="Enter your email"
          leftSection={<IconMail size={16} />}
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          error={formErrors.email}
          required
        />

        <PasswordInput
          label="Password"
          placeholder="Enter your password"
          leftSection={<IconLock size={16} />}
          value={formData.password}
          onChange={(e) => handleInputChange('password', e.target.value)}
          error={formErrors.password}
          required
        />

        <Checkbox
          label="Remember me"
          checked={formData.rememberMe}
          onChange={(e) => handleInputChange('rememberMe', e.currentTarget.checked)}
        />

        <Button
          type="submit"
          fullWidth
          loading={isSubmitting}
          disabled={authState.status === AuthStatus.LOADING}
        >
          Sign In
        </Button>

        <Divider label="Demo credentials" labelPosition="center" />

        <Stack gap="xs">
          <Button
            variant="outline"
            fullWidth
            onClick={() => fillDemoCredentials('admin')}
            disabled={isSubmitting}
          >
            Fill Admin Credentials
          </Button>
          <Button
            variant="outline"
            fullWidth
            onClick={() => fillDemoCredentials('user')}
            disabled={isSubmitting}
          >
            Fill User Credentials
          </Button>
        </Stack>

        <Divider />

        <Text ta="center" size="sm" c="dimmed">
          Don't have an account?{' '}
          <Anchor component={Link} to="/signup" fw={500}>
            Create one here
          </Anchor>
        </Text>
      </Stack>
    </form>
  );
}
