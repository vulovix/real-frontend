// HTTP Client and API utilities
export { default as httpClient, HttpClient } from './HttpClient';
export {
  default as api,
  makeGetRequest,
  makePostRequest,
  makePutRequest,
  makePatchRequest,
  makeDeleteRequest,
  makeUploadRequest,
  setAuthToken,
  removeAuthToken,
  setBaseURL,
  setDefaultHeaders,
} from './api';

// Storage utilities
export { storageService as storage } from './storage';
export { authStorage, AuthStorage } from './Storage/index';

// Types
export type { ApiResponse, ApiError, RequestConfig } from './HttpClient';
