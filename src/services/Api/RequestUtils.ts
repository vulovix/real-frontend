/**
 * API Request Utilities
 * Helper functions for making specific API requests
 */

import { api } from './ApiWrapper';
import { HttpRequestConfig } from '../Http';

// Specific request type functions
export const makeGetRequest = <T = any>(
  url: string, 
  config?: Omit<HttpRequestConfig, 'method'>
): Promise<T> => {
  return api.get<T>(url, config).then((response) => response.data);
};

export const makePostRequest = <T = any>(
  url: string,
  data?: any,
  config?: Omit<HttpRequestConfig, 'method'>
): Promise<T> => {
  return api.post<T>(url, data, config).then((response) => response.data);
};

export const makePutRequest = <T = any>(
  url: string,
  data?: any,
  config?: Omit<HttpRequestConfig, 'method'>
): Promise<T> => {
  return api.put<T>(url, data, config).then((response) => response.data);
};

export const makePatchRequest = <T = any>(
  url: string,
  data?: any,
  config?: Omit<HttpRequestConfig, 'method'>
): Promise<T> => {
  return api.patch<T>(url, data, config).then((response) => response.data);
};

export const makeDeleteRequest = <T = any>(
  url: string, 
  config?: Omit<HttpRequestConfig, 'method'>
): Promise<T> => {
  return api.delete<T>(url, config).then((response) => response.data);
};