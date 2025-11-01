/**
 * SignupForm Feature Component
 * Contains all signup logic and UI
 */

import React, { useEffect, useState } from 'react';
import { IconAlertCircle, IconLock, IconMail, IconUser } from '@tabler/icons-react';
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
import { selectAuth, selectIsAuthenticated, signupRequest } from '../slice';
import { AuthStatus, SignupData } from '../types';

export function SignupForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const authState = useAppSelector(selectAuth);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  // Form state
  const [formData, setFormData] = useState<SignupData>({
    name: '',
    email: '',
    password: '',
    acceptTerms: false,
  });

  // Form validation errors
  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if already authenticated (only if we're on dedicated signup page)
  useEffect(() => {
    if (isAuthenticated && (location.pathname === '/login' || location.pathname === '/signup')) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate, location.pathname]);

  // Validation functions
  const validateName = (name: string): string => {
    if (!name) {
      return 'Name is required';
    }
    if (name.length < 2) {
      return 'Name must be at least 2 characters';
    }
    return '';
  };

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

  const validateConfirmPassword = (confirmPass: string): string => {
    if (!confirmPass) {
      return 'Please confirm your password';
    }
    if (confirmPass !== formData.password) {
      return 'Passwords do not match';
    }
    return '';
  };

  // Handle form input changes
  const handleInputChange = (field: keyof SignupData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (field === 'name' || field === 'email' || field === 'password') {
      setFormErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    setFormErrors((prev) => ({ ...prev, confirmPassword: '' }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting) {
      return;
    }

    // Validate form
    const nameError = validateName(formData.name);
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    const confirmPasswordError = validateConfirmPassword(confirmPassword);

    if (nameError || emailError || passwordError || confirmPasswordError) {
      setFormErrors({
        name: nameError,
        email: emailError,
        password: passwordError,
        confirmPassword: confirmPasswordError,
      });
      return;
    }

    if (!formData.acceptTerms) {
      return;
    }

    setIsSubmitting(true);
    dispatch(signupRequest(formData));
  };

  // Reset submitting state when status changes
  useEffect(() => {
    if (authState.status !== AuthStatus.LOADING) {
      setIsSubmitting(false);
    }
  }, [authState.status]);

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="md">
        {authState.error && (
          <Alert
            icon={<IconAlertCircle size={16} />}
            title="Registration Error"
            color="red"
            variant="light"
          >
            {authState.error.message}
          </Alert>
        )}

        <TextInput
          label="Full Name"
          placeholder="Enter your full name"
          leftSection={<IconUser size={16} />}
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          error={formErrors.name}
          required
        />

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
          placeholder="Create a password"
          leftSection={<IconLock size={16} />}
          value={formData.password}
          onChange={(e) => handleInputChange('password', e.target.value)}
          error={formErrors.password}
          required
        />

        <PasswordInput
          label="Confirm Password"
          placeholder="Confirm your password"
          leftSection={<IconLock size={16} />}
          value={confirmPassword}
          onChange={(e) => handleConfirmPasswordChange(e.target.value)}
          error={formErrors.confirmPassword}
          required
        />

        <Checkbox
          label="I accept the terms and conditions"
          checked={formData.acceptTerms}
          onChange={(e) => handleInputChange('acceptTerms', e.currentTarget.checked)}
          required
        />

        <Button
          type="submit"
          fullWidth
          loading={isSubmitting}
          disabled={authState.status === AuthStatus.LOADING || !formData.acceptTerms}
        >
          Create Account
        </Button>

        <Divider />

        <Text ta="center" size="sm" c="dimmed">
          Already have an account?{' '}
          <Anchor component={Link} to="/login" fw={500}>
            Sign in here
          </Anchor>
        </Text>
      </Stack>
    </form>
  );
}
