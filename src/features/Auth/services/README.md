# Auth Services

This folder contains the refactored authentication services, split from the original monolithic `api.ts` file into focused, single-responsibility modules.

## Structure

```
src/features/Auth/services/
├── index.ts                    # Main exports file
├── AuthService.ts             # Core authentication service
├── AuthenticationError.ts     # Custom error class
├── CryptoUtils.ts            # Password hashing utilities
├── SessionUtils.ts           # Session token management
└── ValidationUtils.ts        # Form validation utilities
```

## Services Overview

### 🔐 AuthService

**File**: `AuthService.ts`

- Main authentication service (singleton)
- Handles login, signup, logout, session management
- Manages demo users initialization
- Integrates with IndexedDB repositories

### 🛡️ AuthenticationError

**File**: `AuthenticationError.ts`

- Custom error class for authentication failures
- Provides structured error codes and details
- Used throughout the auth system for consistent error handling

### 🔒 CryptoUtils

**File**: `CryptoUtils.ts`

- Password hashing and verification utilities
- Salt generation and secure password storage
- Uses SHA-256 for demo (production should use bcrypt)

### 🎫 SessionUtils

**File**: `SessionUtils.ts`

- Session token generation
- Session expiration calculations
- Session validation utilities

### ✅ ValidationUtils

**File**: `ValidationUtils.ts`

- Form validation for login and signup
- Email, password, and name validation rules
- Validation schema management

## Usage

Import services from the main index file:

```typescript
// Or import specific utilities
import { AuthenticationError, authService, CryptoUtils, ValidationUtils } from './services';
```

## Benefits of This Structure

1. **Single Responsibility**: Each service has one clear purpose
2. **Maintainability**: Easier to find and modify specific functionality
3. **Testability**: Individual services can be tested in isolation
4. **Reusability**: Utilities can be imported independently
5. **Type Safety**: Better TypeScript support with focused interfaces

## Migration

The original `api.ts` file now serves as a compatibility layer, re-exporting the main services to maintain backward compatibility with existing imports.
