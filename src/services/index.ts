// HTTP Client and API utilities
export { httpClient, HttpClient } from './Http';
export {
  api,
  makeGetRequest,
  makePostRequest,
  makePutRequest,
  makePatchRequest,
  makeDeleteRequest,
  setAuthToken,
  removeAuthToken,
  setBaseURL,
  setDefaultHeaders,
} from './Api';

// Storage utilities
export { storageService as storage, authStorage, AuthStorage } from './Storage';

// Database utilities
export * from './Database';

// Repository utilities
export * from './Repository';

// Types
export type { HttpResponse, HttpRequestConfig, HttpConfig, HttpError, HttpErrorCode } from './Http';
