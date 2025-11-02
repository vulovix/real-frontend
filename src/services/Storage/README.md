# Storage Services

This folder contains storage-related services for managing data persistence in localStorage and session management.

## Structure

```
src/services/Storage/
├── index.ts             # Main exports file
├── StorageService.ts    # General localStorage utilities
├── AuthStorage.ts       # Authentication-specific storage
└── README.md           # This documentation
```

## Services Overview

### 💾 StorageService
**File**: `StorageService.ts`
- General-purpose localStorage utilities
- Key-value storage with JSON serialization
- Methods: `save()`, `load()`, `remove()`, `clear()`, `isAvailable()`
- Automatic prefix handling for app-specific storage

### 🔐 AuthStorage
**File**: `AuthStorage.ts`
- Authentication-specific storage service
- Session management with expiration handling
- Methods: `saveSession()`, `getSession()`, `clearSession()`, `isSessionValid()`
- Handles session data, user info, and token management

## Usage

### General Storage
```typescript
import { storageService } from './Storage';

// Save data
storageService.save('user-preferences', { theme: 'dark', language: 'en' });

// Load data with default
const preferences = storageService.load('user-preferences', { theme: 'light', language: 'en' });

// Remove data
storageService.remove('user-preferences');

// Clear all app data
storageService.clear();

// Check if storage is available
if (storageService.isAvailable()) {
  // Use storage
}
```

### Authentication Storage
```typescript
import { authStorage } from './Storage';

// Save session
authStorage.saveSession({
  token: 'jwt-token',
  userId: 'user123',
  email: 'user@example.com',
  role: 'user'
});

// Get session
const session = authStorage.getSession();
if (session && authStorage.isSessionValid()) {
  // Use valid session
}

// Clear session
authStorage.clearSession();
```

## Features

### StorageService Features
- **🔒 Safe Operations**: Handles localStorage errors gracefully
- **🏷️ Automatic Prefixing**: Prevents key conflicts with app prefix
- **📦 JSON Serialization**: Automatic serialization/deserialization
- **🧹 Bulk Clear**: Clear all app-specific data at once
- **✅ Availability Check**: Detect if localStorage is available

### AuthStorage Features
- **⏰ Session Expiration**: Automatic session expiration handling
- **🔄 Session Validation**: Check if sessions are still valid
- **📊 Configurable Duration**: Customizable session duration
- **🛡️ Secure Storage**: Proper handling of authentication data

## Configuration

### StorageService Configuration
```typescript
// The prefix is set to 'redux-app-' by default
// All keys are automatically prefixed: 'redux-app-your-key'
```

### AuthStorage Configuration
```typescript
const authStorage = AuthStorage.getInstance({
  sessionDuration: 5 * 60 * 1000, // 5 minutes
  storageKey: 'newsapp_session'
});
```

## Benefits of This Structure

1. **🎯 Specialized Services**: Different storage needs handled by focused services
2. **🔒 Error Handling**: Graceful handling of storage unavailability
3. **⚡ Performance**: Efficient serialization and key management
4. **🛡️ Security**: Proper session management and validation
5. **🔧 Maintainability**: Clear separation between general and auth storage