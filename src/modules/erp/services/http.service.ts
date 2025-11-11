import type { Observable } from 'rxjs';
import { throwError } from 'rxjs';
import type { AjaxError } from 'rxjs/ajax';
import { ajax } from 'rxjs/ajax';
import { catchError, map } from 'rxjs/operators';

export interface HttpConfig {
  baseURL: string;
  headers?: Record<string, string>;
}

export interface HttpResponse<T> {
  data: T;
  status: number;
  statusText: string;
}

export interface HttpError {
  status: number;
  message: string;
  error?: any;
  timestamp?: string;
}

class HttpService {
  private config: HttpConfig;

  constructor(config: HttpConfig) {
    this.config = config;
  }

  private getAuthHeaders(): Record<string, string> {
    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('accessToken')
        : null;
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...this.config.headers,
    };
  }

  private handleError(error: AjaxError): Observable<never> {
    const httpError: HttpError = {
      status: error.status,
      message: error.message || 'An error occurred',
      error: error.response,
      timestamp: new Date().toISOString(),
    };

    console.error('HTTP Error:', httpError);
    return throwError(() => httpError);
  }

  get<T>(endpoint: string): Observable<T> {
    return ajax<T>({
      url: `${this.config.baseURL}${endpoint}`,
      method: 'GET',
      headers: this.getAuthHeaders(),
    }).pipe(
      map((response) => response.response),
      catchError(this.handleError),
    );
  }

  post<T, D = any>(endpoint: string, data: D): Observable<T> {
    return ajax<T>({
      url: `${this.config.baseURL}${endpoint}`,
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: data,
    }).pipe(
      map((response) => response.response),
      catchError(this.handleError),
    );
  }

  put<T, D = any>(endpoint: string, data: D): Observable<T> {
    return ajax<T>({
      url: `${this.config.baseURL}${endpoint}`,
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: data,
    }).pipe(
      map((response) => response.response),
      catchError(this.handleError),
    );
  }

  patch<T, D = any>(endpoint: string, data: D): Observable<T> {
    return ajax<T>({
      url: `${this.config.baseURL}${endpoint}`,
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: data,
    }).pipe(
      map((response) => response.response),
      catchError(this.handleError),
    );
  }

  delete<T>(endpoint: string): Observable<T> {
    return ajax<T>({
      url: `${this.config.baseURL}${endpoint}`,
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    }).pipe(
      map((response) => response.response),
      catchError(this.handleError),
    );
  }
}

export default HttpService;
