import httpClient, { ApiResponse, RequestConfig } from './HttpClient';

// Convenient wrapper functions for common HTTP operations
export const api = {
  // GET requests
  get: <T = any>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> =>
    httpClient.get<T>(url, config),

  // POST requests
  post: <T = any>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> =>
    httpClient.post<T>(url, data, config),

  // PUT requests
  put: <T = any>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> =>
    httpClient.put<T>(url, data, config),

  // PATCH requests
  patch: <T = any>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> =>
    httpClient.patch<T>(url, data, config),

  // DELETE requests
  delete: <T = any>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> =>
    httpClient.delete<T>(url, config),

  // Form data uploads
  upload: <T = any>(
    url: string,
    formData: FormData,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> => httpClient.postFormData<T>(url, formData, config),
};

// Specific request type functions
export const makeGetRequest = <T = any>(url: string, config?: RequestConfig): Promise<T> => {
  return api.get<T>(url, config).then((response) => response.data);
};

export const makePostRequest = <T = any>(
  url: string,
  data?: any,
  config?: RequestConfig
): Promise<T> => {
  return api.post<T>(url, data, config).then((response) => response.data);
};

export const makePutRequest = <T = any>(
  url: string,
  data?: any,
  config?: RequestConfig
): Promise<T> => {
  return api.put<T>(url, data, config).then((response) => response.data);
};

export const makePatchRequest = <T = any>(
  url: string,
  data?: any,
  config?: RequestConfig
): Promise<T> => {
  return api.patch<T>(url, data, config).then((response) => response.data);
};

export const makeDeleteRequest = <T = any>(url: string, config?: RequestConfig): Promise<T> => {
  return api.delete<T>(url, config).then((response) => response.data);
};

export const makeUploadRequest = <T = any>(
  url: string,
  formData: FormData,
  config?: RequestConfig
): Promise<T> => {
  return api.upload<T>(url, formData, config).then((response) => response.data);
};

// Authentication helpers
export const setAuthToken = (token: string) => {
  httpClient.setAuthToken(token);
};

export const removeAuthToken = () => {
  httpClient.removeAuthToken();
};

// Configuration helpers
export const setBaseURL = (baseURL: string) => {
  httpClient.setBaseURL(baseURL);
};

export const setDefaultHeaders = (headers: Record<string, string>) => {
  httpClient.setDefaultHeaders(headers);
};

// Export the main client and API object
export { httpClient };
export default api;
