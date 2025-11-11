import axios from 'axios';
import type { Observable } from 'rxjs';
import { from } from 'rxjs';

import { API_CONFIG } from '@/config/api.config';
import type {
  AttendancePolicy,
  CreateAttendancePolicyRequest,
  UpdateAttendancePolicyRequest,
} from '@/types/attendance-policy.types';
import { TokenService } from '@/utils/tokenService';

const BASE_URL = API_CONFIG.BASE_URL;

// Create dedicated axios instance for attendance policy API
const attendancePolicyApiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token interceptor
attendancePolicyApiClient.interceptors.request.use((config) => {
  const token = TokenService.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

class AttendancePolicyService {
  /**
   * Get all attendance policies
   */
  getAttendancePolicies(): Observable<AttendancePolicy[]> {
    return from(
      attendancePolicyApiClient
        .get<AttendancePolicy[]>('/attendance-policies')
        .then((res) => res.data),
    );
  }

  /**
   * Get attendance policy by ID
   */
  getAttendancePolicyById(id: number): Observable<AttendancePolicy> {
    return from(
      attendancePolicyApiClient
        .get<AttendancePolicy>(`/attendance-policies/${id}`)
        .then((res) => res.data),
    );
  }

  /**
   * Create a new attendance policy
   */
  createAttendancePolicy(
    data: CreateAttendancePolicyRequest,
  ): Observable<AttendancePolicy> {
    return from(
      attendancePolicyApiClient
        .post<AttendancePolicy>('/attendance-policies', data)
        .then((res) => res.data),
    );
  }

  /**
   * Update an existing attendance policy
   */
  updateAttendancePolicy(
    data: UpdateAttendancePolicyRequest,
  ): Observable<AttendancePolicy> {
    return from(
      attendancePolicyApiClient
        .put<AttendancePolicy>(`/attendance-policies/${data.id}`, data)
        .then((res) => res.data),
    );
  }

  /**
   * Delete an attendance policy
   */
  deleteAttendancePolicy(id: number): Observable<void> {
    return from(
      attendancePolicyApiClient
        .delete<void>(`/attendance-policies/${id}`)
        .then((res) => res.data),
    );
  }
}

export const attendancePolicyService = new AttendancePolicyService();
