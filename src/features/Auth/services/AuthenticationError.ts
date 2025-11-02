/**
 * Authentication Error Class
 */

import { AuthErrorCode } from '../types';

export class AuthenticationError extends Error {
  constructor(
    public readonly code: AuthErrorCode,
    message: string,
    public readonly details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AuthenticationError';
  }
}
