export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface DecodedToken {
  sub: string;
  iat: number;
  exp: number;
  phone: string;
  userId: number;
  role: string[];
  firstName: string;
  tokenType: 'ACCESS_TOKEN' | 'REFRESH_TOKEN';
  email: string;
  lastName: string;
}

export interface UserData {
  userId: number;
  id?: number;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  role: string[];
  avatar?: string;
}
