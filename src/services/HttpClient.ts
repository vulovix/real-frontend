export interface RequestConfig {
  headers?: Record<string, string>;
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

export interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: Headers;
}

export interface ApiError {
  message: string;
  status?: number;
  statusText?: string;
  data?: any;
}

class HttpClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;
  private defaultTimeout: number;

  constructor(baseURL = '', defaultHeaders: Record<string, string> = {}) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...defaultHeaders,
    };
    this.defaultTimeout = 10000; // 10 seconds
  }

  private async makeRequest<T>(
    url: string,
    options: RequestInit,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const { headers = {}, timeout = this.defaultTimeout, retries = 3, retryDelay = 1000 } = config;

    const fullUrl = url.startsWith('http') ? url : `${this.baseURL}${url}`;

    const requestOptions: RequestInit = {
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...headers,
      },
    };

    // Add timeout using AbortController
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    requestOptions.signal = controller.signal;

    let lastError: ApiError = { message: 'Unknown error occurred' };

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await fetch(fullUrl, requestOptions);
        clearTimeout(timeoutId);

        let data: T;
        const contentType = response.headers.get('content-type');

        if (contentType && contentType.includes('application/json')) {
          data = await response.json();
        } else {
          data = (await response.text()) as unknown as T;
        }

        if (!response.ok) {
          const apiError = new Error(
            `HTTP Error: ${response.status} ${response.statusText}`
          ) as Error & ApiError;
          apiError.status = response.status;
          apiError.statusText = response.statusText;
          apiError.data = data;
          throw apiError;
        }

        return {
          data,
          status: response.status,
          statusText: response.statusText,
          headers: response.headers,
        };
      } catch (error: any) {
        clearTimeout(timeoutId);

        if (error?.name === 'AbortError') {
          lastError = { message: `Request timeout after ${timeout}ms` };
        } else if (error?.status) {
          lastError = error as ApiError;
        } else {
          lastError = { message: error?.message || 'Network error occurred' };
        }

        // Don't retry on client errors (4xx) or timeout
        if (lastError.status && lastError.status >= 400 && lastError.status < 500) {
          break;
        }

        // If this isn't the last attempt, wait before retrying
        if (attempt < retries) {
          await new Promise((resolve) => setTimeout(resolve, retryDelay * (attempt + 1)));
        }
      }
    }

    throw new Error(lastError.message);
  }

  // GET request
  async get<T = any>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(url, { method: 'GET' }, config);
  }

  // POST request
  async post<T = any>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(
      url,
      {
        method: 'POST',
        body: data ? JSON.stringify(data) : undefined,
      },
      config
    );
  }

  // PUT request
  async put<T = any>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(
      url,
      {
        method: 'PUT',
        body: data ? JSON.stringify(data) : undefined,
      },
      config
    );
  }

  // PATCH request
  async patch<T = any>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(
      url,
      {
        method: 'PATCH',
        body: data ? JSON.stringify(data) : undefined,
      },
      config
    );
  }

  // DELETE request
  async delete<T = any>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(url, { method: 'DELETE' }, config);
  }

  // Form data POST (for file uploads)
  async postFormData<T = any>(
    url: string,
    formData: FormData,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    const headers = { ...config?.headers };
    // Remove Content-Type header to let browser set it with boundary for FormData
    delete headers['Content-Type'];

    return this.makeRequest<T>(
      url,
      {
        method: 'POST',
        body: formData,
      },
      { ...config, headers }
    );
  }

  // Set authorization token
  setAuthToken(token: string) {
    this.defaultHeaders.Authorization = `Bearer ${token}`;
  }

  // Remove authorization token
  removeAuthToken() {
    delete this.defaultHeaders.Authorization;
  }

  // Update base URL
  setBaseURL(baseURL: string) {
    this.baseURL = baseURL;
  }

  // Update default headers
  setDefaultHeaders(headers: Record<string, string>) {
    this.defaultHeaders = { ...this.defaultHeaders, ...headers };
  }
}

// Create and export a default instance
const httpClient = new HttpClient(
  process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api'
);

export default httpClient;

export { HttpClient };
