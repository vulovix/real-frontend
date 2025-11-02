# Repositories

This folder contains the refactored repository classes, split from the original monolithic `repositories.ts` file into focused, single-responsibility modules.

## Structure

```
src/services/Repository/
├── index.ts                        # Main exports file
├── RepositoryFactory.ts           # Singleton factory for all repositories
├── UserRepository.ts              # User data management
├── SessionRepository.ts           # User session management
├── NewsCacheRepository.ts         # News caching functionality
├── UserPreferencesRepository.ts   # User settings and preferences
└── README.md                      # This documentation
```

## Repositories Overview

### 👤 UserRepository

**File**: `UserRepository.ts`

- Manages user data in IndexedDB
- Methods: `findByEmail()`, `emailExists()`, `findByRole()`, `count()`
- Handles user CRUD operations with email indexing

### 🎫 SessionRepository

**File**: `SessionRepository.ts`

- Manages user authentication sessions
- Methods: `findByUserId()`, `findValidSession()`, `cleanupExpiredSessions()`
- Automatic session validation and cleanup

### 📰 NewsCacheRepository

**File**: `NewsCacheRepository.ts`

- Caches external news API data to reduce API calls
- Methods: `get()`, `set()`, `getValidCache()`, `cleanupExpiredCache()`
- Includes `CachedNewsItem` interface

### ⚙️ UserPreferencesRepository

**File**: `UserPreferencesRepository.ts`

- Manages user settings and preferences
- Methods: `getPreferencesWithDefaults()`, `getNewsPreferences()`, `setNewsPreferences()`
- Includes `UserPreferences` interface with theme, notifications, privacy settings

### 🏭 RepositoryFactory

**File**: `RepositoryFactory.ts`

- Singleton factory pattern for repository access
- Ensures database initialization before repository creation
- Provides centralized access to all repositories

## Usage

Import repositories directly from the Repository folder:

```typescript
import { RepositoryFactory, type CachedNewsItem, type UserPreferences } from './Repository';
import { SessionRepository } from './Repository/SessionRepository';
// Or import specific repositories directly
import { UserRepository } from './Repository/UserRepository';

// Get repository instances
const userRepo = await RepositoryFactory.getUserRepository();
const sessionRepo = await RepositoryFactory.getSessionRepository();
```

## Benefits of This Structure

1. **🎯 Single Responsibility**: Each repository manages one specific domain
2. **🔧 Maintainability**: Easier to find and modify repository-specific logic
3. **🧪 Testability**: Individual repositories can be unit tested in isolation
4. **🔄 Reusability**: Repositories can be imported and used independently
5. **📦 Type Safety**: Clear interfaces and types for each domain
6. **🏗️ Scalability**: Easy to add new repositories without affecting existing ones

## Database Integration

All repositories extend `BaseRepository<T>` which provides:

- Standard CRUD operations (`create`, `findById`, `update`, `delete`, `findAll`)
- Error handling with `DatabaseError`
- Transaction support
- IndexedDB store management

## Migration

The repository system has been fully refactored into individual files within the `Repository` folder. All imports now use direct paths to the specific repository files, eliminating the need for a compatibility layer.
