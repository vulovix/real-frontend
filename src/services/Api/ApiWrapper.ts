/**
 * API Request Wrapper
 * Convenient wrapper functions for common HTTP operations
 */

import { httpClient, HttpResponse, HttpRequestConfig } from '../Http';

export const api = {
  // GET requests
  get: <T = any>(url: string, config?: Omit<HttpRequestConfig, 'method'>): Promise<HttpResponse<T>> =>
    httpClient.get<T>(url, config),

  // POST requests
  post: <T = any>(url: string, data?: any, config?: Omit<HttpRequestConfig, 'method'>): Promise<HttpResponse<T>> =>
    httpClient.post<T>(url, data, config),

  // PUT requests
  put: <T = any>(url: string, data?: any, config?: Omit<HttpRequestConfig, 'method'>): Promise<HttpResponse<T>> =>
    httpClient.put<T>(url, data, config),

  // PATCH requests
  patch: <T = any>(url: string, data?: any, config?: Omit<HttpRequestConfig, 'method'>): Promise<HttpResponse<T>> =>
    httpClient.patch<T>(url, data, config),

  // DELETE requests
  delete: <T = any>(url: string, config?: Omit<HttpRequestConfig, 'method'>): Promise<HttpResponse<T>> =>
    httpClient.delete<T>(url, config),
};