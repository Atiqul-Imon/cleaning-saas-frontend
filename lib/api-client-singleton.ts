import { createClient } from '@/lib/supabase';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === 'production' ? 'https://api.clenvora.com' : 'http://localhost:5000');

/**
 * Request interceptor type
 */
type RequestInterceptor = (config: { url: string; options: RequestInit }) => {
  url: string;
  options: RequestInit;
};

/**
 * Response interceptor type
 */
type ResponseInterceptor = <T>(response: Response, data: T) => T | Promise<T>;

/**
 * Error interceptor type
 */
type ErrorInterceptor = (
  error: Error,
  config: { url: string; options: RequestInit },
) => Error | Promise<Error>;

/**
 * Cache entry interface
 */
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

/**
 * Enhanced Singleton ApiClient instance
 *
 * Features:
 * - Single instance per app
 * - Request/response interceptors
 * - Client-side response caching for GET requests
 * - Automatic token management
 * - Error handling
 */
class ApiClientSingleton {
  private baseUrl: string;
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];
  private errorInterceptors: ErrorInterceptor[] = [];

  // Simple in-memory cache for GET requests
  private cache: Map<string, CacheEntry<any>> = new Map();
  private readonly DEFAULT_CACHE_TTL = 60 * 1000; // 60 seconds

  constructor() {
    this.baseUrl = API_URL;

    // Add default request interceptor for auth
    this.addRequestInterceptor((config) => {
      // Auth is handled in request method
      return config;
    });

    // Add default error interceptor
    this.addErrorInterceptor((error, config) => {
      // Log errors in development
      if (process.env.NODE_ENV === 'development') {
        console.error(`API Error [${config.url}]:`, error);
      }
      return error;
    });
  }

  /**
   * Add request interceptor
   */
  addRequestInterceptor(interceptor: RequestInterceptor): void {
    this.requestInterceptors.push(interceptor);
  }

  /**
   * Add response interceptor
   */
  addResponseInterceptor(interceptor: ResponseInterceptor): void {
    this.responseInterceptors.push(interceptor);
  }

  /**
   * Add error interceptor
   */
  addErrorInterceptor(interceptor: ErrorInterceptor): void {
    this.errorInterceptors.push(interceptor);
  }

  /**
   * Clear cache for a specific endpoint or all cache
   */
  clearCache(endpoint?: string): void {
    if (endpoint) {
      this.cache.delete(endpoint);
    } else {
      this.cache.clear();
    }
  }

  /**
   * Get token from Supabase
   */
  private async getToken(): Promise<string | null> {
    const supabase = createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session?.access_token || null;
  }

  /**
   * Check if cache entry is valid
   */
  private isCacheValid(entry: CacheEntry<any>): boolean {
    return Date.now() < entry.expiresAt;
  }

  /**
   * Get cache key from endpoint
   */
  private getCacheKey(endpoint: string, options?: RequestInit): string {
    // Include method and body in cache key for safety
    const method = options?.method || 'GET';
    const body = options?.body ? JSON.stringify(options.body) : '';
    return `${method}:${endpoint}:${body}`;
  }

  /**
   * Main request method with interceptors and caching
   */
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const method = options.method || 'GET';
    const isGetRequest = method === 'GET';

    // Check cache for GET requests
    if (isGetRequest) {
      const cacheKey = this.getCacheKey(endpoint, options);
      const cached = this.cache.get(cacheKey);

      if (cached && this.isCacheValid(cached)) {
        return cached.data as T;
      }
    }

    // Get token
    const token = await this.getToken();

    // Build headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Apply request interceptors
    let config: { url: string; options: RequestInit } = {
      url: endpoint,
      options: { ...options, headers: headers as HeadersInit },
    };
    for (const interceptor of this.requestInterceptors) {
      config = interceptor(config);
    }

    try {
      // Make request
      const response = await fetch(`${this.baseUrl}${config.url}`, config.options);

      // Handle errors
      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: response.statusText }));
        const errorObj = new Error(error.message || 'Request failed');

        // Apply error interceptors
        let finalError = errorObj;
        for (const interceptor of this.errorInterceptors) {
          finalError = await interceptor(finalError, config);
        }

        throw finalError;
      }

      // Parse response
      let data: T = await response.json();

      // Apply response interceptors
      for (const interceptor of this.responseInterceptors) {
        data = await interceptor<T>(response, data);
      }

      // Cache GET requests
      if (isGetRequest) {
        const cacheKey = this.getCacheKey(endpoint, options);
        this.cache.set(cacheKey, {
          data,
          timestamp: Date.now(),
          expiresAt: Date.now() + this.DEFAULT_CACHE_TTL,
        });
      }

      return data;
    } catch (error) {
      // Apply error interceptors
      let finalError = error instanceof Error ? error : new Error(String(error));
      for (const interceptor of this.errorInterceptors) {
        finalError = await interceptor(finalError, config);
      }
      throw finalError;
    }
  }

  async get<T>(endpoint: string, options?: { cache?: boolean; ttl?: number }): Promise<T> {
    const result = await this.request<T>(endpoint, { method: 'GET' });

    // Override cache TTL if provided
    if (options?.ttl && options.cache !== false) {
      const cacheKey = this.getCacheKey(endpoint, { method: 'GET' });
      const cached = this.cache.get(cacheKey);
      if (cached) {
        cached.expiresAt = Date.now() + options.ttl;
      }
    }

    return result;
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    // Invalidate cache for related endpoints
    this.invalidateRelatedCache(endpoint);

    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    // Invalidate cache for related endpoints
    this.invalidateRelatedCache(endpoint);

    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    // Invalidate cache for related endpoints
    this.invalidateRelatedCache(endpoint);

    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  /**
   * Invalidate cache for related endpoints
   * When a mutation happens, we should invalidate related GET requests
   */
  private invalidateRelatedCache(endpoint: string): void {
    // Invalidate cache entries that might be affected by this mutation
    // For example, if we update /business, invalidate /business and /dashboard/stats
    const keysToInvalidate: string[] = [];

    this.cache.forEach((_, key) => {
      // Invalidate exact matches
      if (key.includes(endpoint)) {
        keysToInvalidate.push(key);
      }

      // Invalidate related endpoints
      if (endpoint.includes('/business') && key.includes('/business')) {
        keysToInvalidate.push(key);
      }
      if (endpoint.includes('/jobs') && key.includes('/jobs')) {
        keysToInvalidate.push(key);
      }
      if (endpoint.includes('/clients') && key.includes('/clients')) {
        keysToInvalidate.push(key);
      }
      if (endpoint.includes('/invoices') && key.includes('/invoices')) {
        keysToInvalidate.push(key);
      }
    });

    keysToInvalidate.forEach((key) => this.cache.delete(key));
  }

  /**
   * Get base URL (for external use like PDF downloads)
   */
  getBaseUrl(): string {
    return this.baseUrl;
  }
}

// Export singleton instance
export const apiClient = new ApiClientSingleton();
