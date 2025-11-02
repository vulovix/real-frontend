# API Services

This folder contains API-related utilities and services for making HTTP requests and managing API configurations.

## Structure

```
src/services/Api/
├── index.ts           # Main exports file
├── ApiWrapper.ts      # Core API wrapper with HTTP methods
├── RequestUtils.ts    # Specific request utility functions
├── ConfigUtils.ts     # API configuration utilities
└── README.md          # This documentation
```

## Services Overview

### 🌐 ApiWrapper
**File**: `ApiWrapper.ts`
- Core API wrapper around HttpClient
- Provides convenient methods: `get()`, `post()`, `put()`, `patch()`, `delete()`
- Returns full HTTP responses with status, headers, etc.

### 🔧 RequestUtils
**File**: `RequestUtils.ts`
- Helper functions for making specific API requests
- Returns only the data portion of responses
- Methods: `makeGetRequest()`, `makePostRequest()`, etc.
- Simpler interface for common use cases

### ⚙️ ConfigUtils
**File**: `ConfigUtils.ts`
- API configuration utilities
- Functions for setting auth tokens, base URLs, default headers
- Currently provides placeholder implementations for future HttpClient enhancements

## Usage

### Basic API Calls
```typescript
import { api } from './Api';

// Using the full API wrapper
const response = await api.get<User[]>('/users');
console.log(response.status, response.data);

// Using utility functions (returns data directly)
const users = await makeGetRequest<User[]>('/users');
console.log(users);
```

### Different Request Types
```typescript
import { 
  makeGetRequest, 
  makePostRequest, 
  makePutRequest, 
  makeDeleteRequest 
} from './Api';

// GET request
const users = await makeGetRequest<User[]>('/users');

// POST request
const newUser = await makePostRequest<User>('/users', userData);

// PUT request
const updatedUser = await makePutRequest<User>(`/users/${id}`, userData);

// DELETE request
await makeDeleteRequest(`/users/${id}`);
```

### Configuration
```typescript
import { setAuthToken, removeAuthToken, setBaseURL } from './Api';

// Set authentication token (placeholder)
setAuthToken('bearer-token-here');

// Remove authentication token (placeholder)
removeAuthToken();

// Set base URL (placeholder)
setBaseURL('https://api.example.com');
```

## Benefits of This Structure

1. **🎯 Separation of Concerns**: Different aspects of API handling are separated
2. **🔄 Flexibility**: Choose between full responses or data-only utilities
3. **🛠️ Maintainability**: Easy to extend with new request types or configurations
4. **📱 Consistency**: Standardized API calling patterns across the application
5. **🔧 Configuration**: Centralized place for API configuration management

## Future Enhancements

- Implement actual configuration methods in HttpClient
- Add request/response interceptors
- Add caching mechanisms
- Add request retry logic
- Add request cancellation support