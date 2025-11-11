import type { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

import { API_CONFIG } from '@/config/api.config';
import type { AuthTokens, LoginRequest, UserData } from '@/types/auth.types';
import { httpClient } from '@/utils/httpClient';
import { TokenService } from '@/utils/tokenService';

class AuthService {
  private currentUserSubject: BehaviorSubject<UserData | null>;
  public currentUser$: Observable<UserData | null>;

  constructor() {
    const userData = TokenService.getUserData();
    this.currentUserSubject = new BehaviorSubject<UserData | null>(userData);
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): UserData | null {
    return this.currentUserSubject.value;
  }

  async login(credentials: LoginRequest): Promise<AuthTokens> {
    try {
      const response = await httpClient.post<AuthTokens>(
        `${API_CONFIG.AUTH_URL}/auth/login`,
        credentials,
      );
      if (!response.accessToken || !response.refreshToken) {
        console.error('Invalid response structure:', response);
        throw new Error('Invalid response from server');
      }

      TokenService.setTokens(response.accessToken, response.refreshToken);
      const userData = TokenService.getUserData();
      this.currentUserSubject.next(userData);

      return response;
    } catch (error: unknown) {
      const errorObj = error as {
        message?: string;
        response?: { data?: unknown; status?: number };
      };
      console.error('Login error details:', {
        message: errorObj?.message,
        response: errorObj?.response?.data,
        status: errorObj?.response?.status,
      });
      throw error;
    }
  }

  async logout(): Promise<void> {
    TokenService.clearTokens();
    this.currentUserSubject.next(null);

    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }

  async refreshToken(): Promise<AuthTokens> {
    const refreshToken = TokenService.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await httpClient.post<AuthTokens>('/auth/refresh', {
      refreshToken,
    });

    TokenService.setTokens(response.accessToken, response.refreshToken);
    const userData = TokenService.getUserData();
    this.currentUserSubject.next(userData);

    return response;
  }

  isAuthenticated(): boolean {
    const token = TokenService.getAccessToken();
    if (!token) return false;
    return !TokenService.isTokenExpired(token);
  }

  hasRole(role: string): boolean {
    return TokenService.hasRole(role);
  }

  hasAnyRole(roles: string[]): boolean {
    return TokenService.hasAnyRole(roles);
  }
}

export const authService = new AuthService();
