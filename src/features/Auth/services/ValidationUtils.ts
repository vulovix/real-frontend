/**
 * Validation utilities for authentication forms
 */

import { AUTH_CONSTANTS, LoginCredentials, SignupData, ValidationSchema } from '../types';

export class ValidationUtils {
  private static readonly emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  static readonly validationSchema: ValidationSchema = {
    email: [
      {
        test: (value: string) => value.length > 0,
        message: 'Email is required',
      },
      {
        test: (value: string) => this.emailRegex.test(value),
        message: 'Please enter a valid email address',
      },
    ],
    password: [
      {
        test: (value: string) => value.length >= AUTH_CONSTANTS.PASSWORD_REQUIREMENTS.MIN_LENGTH,
        message: `Password must be at least ${AUTH_CONSTANTS.PASSWORD_REQUIREMENTS.MIN_LENGTH} characters`,
      },
      {
        test: (value: string) =>
          !AUTH_CONSTANTS.PASSWORD_REQUIREMENTS.REQUIRE_UPPERCASE || /[A-Z]/.test(value),
        message: 'Password must contain at least one uppercase letter',
      },
      {
        test: (value: string) =>
          !AUTH_CONSTANTS.PASSWORD_REQUIREMENTS.REQUIRE_LOWERCASE || /[a-z]/.test(value),
        message: 'Password must contain at least one lowercase letter',
      },
      {
        test: (value: string) =>
          !AUTH_CONSTANTS.PASSWORD_REQUIREMENTS.REQUIRE_NUMBERS || /\d/.test(value),
        message: 'Password must contain at least one number',
      },
    ],
    name: [
      {
        test: (value: string) => value.trim().length > 0,
        message: 'Name is required',
      },
      {
        test: (value: string) => value.trim().length >= 2,
        message: 'Name must be at least 2 characters',
      },
    ],
  };

  static validateField(field: keyof ValidationSchema, value: string): string | null {
    const rules = this.validationSchema[field];

    for (const rule of rules) {
      if (!rule.test(value)) {
        return rule.message;
      }
    }

    return null;
  }

  static validateLoginCredentials(credentials: LoginCredentials): Record<string, string> {
    const errors: Record<string, string> = {};

    const emailError = this.validateField('email', credentials.email);
    if (emailError) {
      errors.email = emailError;
    }

    const passwordError = this.validateField('password', credentials.password);
    if (passwordError) {
      errors.password = passwordError;
    }

    return errors;
  }

  static validateSignupData(data: SignupData): Record<string, string> {
    const errors: Record<string, string> = {};

    const emailError = this.validateField('email', data.email);
    if (emailError) {
      errors.email = emailError;
    }

    const passwordError = this.validateField('password', data.password);
    if (passwordError) {
      errors.password = passwordError;
    }

    const nameError = this.validateField('name', data.name);
    if (nameError) {
      errors.name = nameError;
    }

    if (!data.acceptTerms) {
      errors.acceptTerms = 'You must accept the terms and conditions';
    }

    return errors;
  }
}
