import { jwtDecode } from 'jwt-decode';

import type { DecodedToken, UserData } from '@/types/auth.types';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_DATA_KEY = 'userData';

export class TokenService {
  static getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  }

  static getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  }

  static setTokens(accessToken: string, refreshToken: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);

    // Decode and store user data
    const userData = this.decodeToken(accessToken);
    if (userData) {
      this.setUserData(userData);
    }
  }

  static clearTokens(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_DATA_KEY);
  }

  static decodeToken(token: string): UserData | null {
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      return {
        userId: decoded.userId,
        email: decoded.email,
        phone: decoded.phone,
        firstName: decoded.firstName,
        lastName: decoded.lastName,
        role: decoded.role,
      };
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  static getUserData(): UserData | null {
    if (typeof window === 'undefined') return null;
    const userData = localStorage.getItem(USER_DATA_KEY);
    return userData ? JSON.parse(userData) : null;
  }

  static setUserData(userData: UserData): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
  }

  static isTokenExpired(token: string): boolean {
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp < currentTime;
    } catch {
      return true;
    }
  }

  static hasRole(role: string): boolean {
    const userData = this.getUserData();
    return userData?.role.includes(role) ?? false;
  }

  static hasAnyRole(roles: string[]): boolean {
    const userData = this.getUserData();
    return roles.some((role) => userData?.role.includes(role)) ?? false;
  }
}
