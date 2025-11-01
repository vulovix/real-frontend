/**
 * HTTP Client Service
 * Centralized HTTP client for API requests with proper error handling
 */

export interface HttpConfig {
  baseURL?: string;
  timeout?: number;
  headers?: Record<string, string>;
}

export interface HttpRequestConfig extends HttpConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: any;
  params?: Record<string, string>;
}

export interface HttpResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
}

export enum HttpErrorCode {
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT = 'TIMEOUT',
  BAD_REQUEST = 'BAD_REQUEST',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  SERVER_ERROR = 'SERVER_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export class HttpError extends Error {
  constructor(
    public readonly code: HttpErrorCode,
    message: string,
    public readonly status?: number,
    public readonly response?: Response
  ) {
    super(message);
    this.name = 'HttpError';
  }
}

export class HttpClient {
  private static instance: HttpClient | null = null;
  private readonly config: HttpConfig;

  private constructor(config: HttpConfig = {}) {
    this.config = {
      timeout: 10000, // 10 seconds default
      headers: {
        'Content-Type': 'application/json',
      },
      ...config,
    };
  }

  static getInstance(config?: HttpConfig): HttpClient {
    if (!HttpClient.instance) {
      HttpClient.instance = new HttpClient(config);
    }
    return HttpClient.instance;
  }

  /**
   * Build URL with query parameters
   */
  private buildUrl(url: string, params?: Record<string, string>): string {
    const baseUrl = this.config.baseURL ? `${this.config.baseURL}${url}` : url;

    if (!params || Object.keys(params).length === 0) {
      return baseUrl;
    }

    const searchParams = new URLSearchParams(params);
    return `${baseUrl}?${searchParams.toString()}`;
  }

  /**
   * Create AbortController for timeout handling
   */
  private createTimeoutController(timeout: number): AbortController {
    const controller = new AbortController();
    setTimeout(() => controller.abort(), timeout);
    return controller;
  }

  /**
   * Handle HTTP errors
   */
  private handleError(error: unknown, response?: Response): HttpError {
    if (error instanceof HttpError) {
      return error;
    }

    if (error instanceof DOMException && error.name === 'AbortError') {
      return new HttpError(HttpErrorCode.TIMEOUT, 'Request timeout', undefined, response);
    }

    if (error instanceof TypeError && error.message.includes('fetch')) {
      return new HttpError(HttpErrorCode.NETWORK_ERROR, 'Network error', undefined, response);
    }

    if (response) {
      const status = response.status;

      if (status >= 400 && status < 500) {
        const code =
          status === 401
            ? HttpErrorCode.UNAUTHORIZED
            : status === 403
              ? HttpErrorCode.FORBIDDEN
              : status === 404
                ? HttpErrorCode.NOT_FOUND
                : HttpErrorCode.BAD_REQUEST;

        return new HttpError(code, `HTTP ${status}: ${response.statusText}`, status, response);
      }

      if (status >= 500) {
        return new HttpError(
          HttpErrorCode.SERVER_ERROR,
          `Server error: ${status} ${response.statusText}`,
          status,
          response
        );
      }
    }

    return new HttpError(
      HttpErrorCode.UNKNOWN_ERROR,
      error instanceof Error ? error.message : 'Unknown error',
      undefined,
      response
    );
  }

  /**
   * Make HTTP request
   */
  async request<T = any>(url: string, config: HttpRequestConfig = {}): Promise<HttpResponse<T>> {
    const {
      method = 'GET',
      body,
      params,
      timeout = this.config.timeout!,
      headers = {},
      ...otherConfig
    } = config;

    const finalUrl = this.buildUrl(url, params);
    const controller = this.createTimeoutController(timeout);

    const requestHeaders = {
      ...this.config.headers,
      ...headers,
    };

    const requestConfig: RequestInit = {
      method,
      headers: requestHeaders,
      signal: controller.signal,
      ...otherConfig,
    };

    // Add body for non-GET requests
    if (body && method !== 'GET') {
      if (typeof body === 'object') {
        requestConfig.body = JSON.stringify(body);
      } else {
        requestConfig.body = body;
      }
    }

    try {
      const response = await fetch(finalUrl, requestConfig);

      if (!response.ok) {
        throw this.handleError(new Error(`HTTP ${response.status}`), response);
      }

      let data: T;
      const contentType = response.headers.get('content-type');

      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = (await response.text()) as unknown as T;
      }

      return {
        data,
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * GET request
   */
  async get<T = any>(
    url: string,
    config?: Omit<HttpRequestConfig, 'method' | 'body'>
  ): Promise<HttpResponse<T>> {
    return this.request<T>(url, { ...config, method: 'GET' });
  }

  /**
   * POST request
   */
  async post<T = any>(
    url: string,
    body?: any,
    config?: Omit<HttpRequestConfig, 'method'>
  ): Promise<HttpResponse<T>> {
    return this.request<T>(url, { ...config, method: 'POST', body });
  }

  /**
   * PUT request
   */
  async put<T = any>(
    url: string,
    body?: any,
    config?: Omit<HttpRequestConfig, 'method'>
  ): Promise<HttpResponse<T>> {
    return this.request<T>(url, { ...config, method: 'PUT', body });
  }

  /**
   * DELETE request
   */
  async delete<T = any>(
    url: string,
    config?: Omit<HttpRequestConfig, 'method' | 'body'>
  ): Promise<HttpResponse<T>> {
    return this.request<T>(url, { ...config, method: 'DELETE' });
  }

  /**
   * PATCH request
   */
  async patch<T = any>(
    url: string,
    body?: any,
    config?: Omit<HttpRequestConfig, 'method'>
  ): Promise<HttpResponse<T>> {
    return this.request<T>(url, { ...config, method: 'PATCH', body });
  }
}

// Export singleton instance
export const httpClient = HttpClient.getInstance();
