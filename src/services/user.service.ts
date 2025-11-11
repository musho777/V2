import axios from 'axios';
import type { Observable } from 'rxjs';
import { from } from 'rxjs';

import { API_CONFIG } from '@/config/api.config';
import type {
  UpdateUserProfileRequest,
  UserProfile,
} from '@/modules/profile/types/profile.types';
import type {
  CommissionsResponse,
  CreateUserRequest,
  CreateUserResponse,
  DepartmentHeadsResponse,
  HolidaysResponse,
  MoneyUnitsResponse,
  OccupationsResponse,
  OfficeLocationsResponse,
  RolesResponse,
  TimezonesResponse,
  UsersQueryParams,
  UsersResponse,
  UserStatusesResponse,
} from '@/types/user.types';
import { TokenService } from '@/utils/tokenService';

const BASE_URL = API_CONFIG.BASE_URL;

// Create dedicated axios instance for user API
const userApiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token interceptor
userApiClient.interceptors.request.use((config) => {
  const token = TokenService.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

class UserService {
  /**
   * Get paginated list of users
   */
  getUsers(params?: UsersQueryParams): Observable<UsersResponse> {
    const queryParams = new URLSearchParams({
      page: String(params?.page ?? 0),
      size: String(params?.size ?? 10),
    });

    return from(
      userApiClient
        .get<UsersResponse>(`/users?${queryParams.toString()}`)
        .then((res) => res.data),
    );
  }

  /**
   * Get available user statuses
   */
  getUserStatuses(): Observable<UserStatusesResponse> {
    return from(
      userApiClient
        .get<UserStatusesResponse>('/users/statuses')
        .then((res) => res.data),
    );
  }

  /**
   * Get available roles
   */
  getRoles(): Observable<RolesResponse> {
    return from(
      userApiClient.get<RolesResponse>('/roles').then((res) => res.data),
    );
  }

  /**
   * Get available occupations
   */
  getOccupations(): Observable<OccupationsResponse> {
    return from(
      userApiClient
        .get<OccupationsResponse>('/occupations')
        .then((res) => res.data),
    );
  }

  /**
   * Get available timezones
   */
  getTimezones(): Observable<TimezonesResponse> {
    return from(
      userApiClient
        .get<TimezonesResponse>('/timezones')
        .then((res) => res.data),
    );
  }

  /**
   * Get available money units
   */
  getMoneyUnits(): Observable<MoneyUnitsResponse> {
    return from(
      userApiClient
        .get<MoneyUnitsResponse>('/money-units/enabled')
        .then((res) => res.data),
    );
  }

  /**
   * Get available holidays
   */
  getHolidays(): Observable<HolidaysResponse> {
    return from(
      userApiClient.get<HolidaysResponse>('/holidays').then((res) => res.data),
    );
  }

  /**
   * Get available office locations
   */
  getOfficeLocations(): Observable<OfficeLocationsResponse> {
    return from(
      userApiClient
        .get<OfficeLocationsResponse>('/office-locations')
        .then((res) => res.data),
    );
  }

  /**
   * Get available commissions
   */
  getCommissions(): Observable<CommissionsResponse> {
    return from(
      userApiClient
        .get<CommissionsResponse>('/commissions')
        .then((res) => res.data),
    );
  }

  /**
   * Get available department heads
   */
  getDepartmentHeads(): Observable<DepartmentHeadsResponse> {
    return from(
      userApiClient
        .get<DepartmentHeadsResponse>('/users/department-heads')
        .then((res) => res.data),
    );
  }

  /**
   * Create a new user
   */
  createUser(data: CreateUserRequest): Observable<CreateUserResponse> {
    return from(
      userApiClient
        .post<CreateUserResponse>('/users', data)
        .then((res) => res.data),
    );
  }

  /**
   * Update user profile
   */
  updateUserProfile(
    userId: number,
    data: UpdateUserProfileRequest,
  ): Observable<UserProfile> {
    return from(
      userApiClient
        .put<UserProfile>(`/users/${userId}`, data)
        .then((res) => res.data),
    );
  }

  /**
   * Get user profile by ID
   */
  getUserProfile(userId: number): Observable<UserProfile> {
    return from(
      userApiClient
        .get<UserProfile>(`/users/${userId}`)
        .then((res) => res.data),
    );
  }

  /**
   * Get current user profile
   */
  getCurrentUserProfile(): Observable<UserProfile> {
    return from(
      userApiClient.get<UserProfile>('/users/me').then((res) => res.data),
    );
  }

  /**
   * Get enabled users
   */
  getEnabledUsers(): Observable<UsersResponse> {
    return from(
      userApiClient
        .get<UsersResponse>('/users/enabled')
        .then((res) => res.data),
    );
  }
}

export const userService = new UserService();
