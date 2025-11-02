// Create and export singleton instance
import { AuthService } from './AuthService';

/**
 * Auth Services Export
 * Centralized exports for all auth services
 */

export { AuthService } from './AuthService';
export { AuthenticationError } from './AuthenticationError';
export { CryptoUtils } from './CryptoUtils';
export { SessionUtils } from './SessionUtils';
export { ValidationUtils } from './ValidationUtils';

export const authService = AuthService.getInstance();
