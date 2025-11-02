# Services

This is the main services layer of the application, organized into focused folders for different types of services. Each folder contains related functionality with proper separation of concerns.

## Folder Structure

```
src/services/
├── index.ts           # Main exports for all services
├── README.md          # This documentation
├── Api/               # API request utilities
├── Database/          # IndexedDB utilities
├── Http/              # HTTP client services
├── Repository/        # Data repositories
└── Storage/           # Storage services
```

## Service Categories

### 🌐 API Services (`Api/`)
- **Purpose**: API request utilities and wrappers
- **Files**: ApiWrapper, RequestUtils, ConfigUtils
- **Usage**: Making HTTP requests with convenient utilities
- **Features**: Request helpers, configuration management

### 🗄️ Database Services (`Database/`)
- **Purpose**: IndexedDB management and utilities
- **Files**: BaseRepository, DatabaseConnection, DatabaseError, DatabaseConfig
- **Usage**: Database operations, schema management
- **Features**: Type-safe database operations, error handling

### 🌐 HTTP Services (`Http/`)
- **Purpose**: Core HTTP client functionality
- **Files**: HttpClient
- **Usage**: Low-level HTTP operations
- **Features**: Request/response handling, error management

### 📦 Repository Services (`Repository/`)
- **Purpose**: Data access layer with domain-specific repositories
- **Files**: UserRepository, SessionRepository, NewsCacheRepository, etc.
- **Usage**: Domain-specific data operations
- **Features**: CRUD operations, business logic encapsulation

### 💾 Storage Services (`Storage/`)
- **Purpose**: Local storage and session management
- **Files**: StorageService, AuthStorage
- **Usage**: Persisting data locally, session management
- **Features**: localStorage utilities, authentication storage

## Usage Examples

### Making API Requests
```typescript
import { api, makeGetRequest } from './services';

// Using the API wrapper
const response = await api.get<User[]>('/users');

// Using request utilities (returns data directly)
const users = await makeGetRequest<User[]>('/users');
```

### Database Operations
```typescript
import { RepositoryFactory } from './services';

const userRepo = await RepositoryFactory.getUserRepository();
const users = await userRepo.findAll();
```

### Storage Operations
```typescript
import { storageService, authStorage } from './services';

// General storage
storageService.save('settings', { theme: 'dark' });

// Auth storage
authStorage.saveSession({ token: 'abc123', userId: '123' });
```

## Architecture Benefits

### 🎯 **Separation of Concerns**
Each folder handles a specific aspect of data/service management:
- API layer for external communication
- Database layer for persistent storage
- Repository layer for business logic
- Storage layer for local persistence

### 📁 **Organized Structure**
- Related functionality grouped in folders
- Clear naming conventions
- Comprehensive documentation in each folder

### 🔄 **Consistent Patterns**
- Singleton patterns where appropriate
- Error handling across all services
- TypeScript interfaces for type safety

### 🧪 **Testability**
- Each service can be tested independently
- Clear dependencies and interfaces
- Mocking-friendly architecture

### 🚀 **Scalability**
- Easy to add new services within existing categories
- Clear boundaries between different types of services
- Minimal coupling between service types

## Import Patterns

### Individual Service Imports
```typescript
// Import specific services
import { api } from './services/Api';
import { httpClient } from './services/Http';
import { storageService } from './services/Storage';
import { RepositoryFactory } from './services/Repository';
```

### Consolidated Imports
```typescript
// Import from main services index
import { 
  api, 
  httpClient, 
  storageService, 
  RepositoryFactory 
} from './services';
```

## Future Enhancements

- Add caching layer services
- Implement service workers for offline functionality
- Add logging and monitoring services
- Implement service composition patterns
- Add service health checks and monitoring