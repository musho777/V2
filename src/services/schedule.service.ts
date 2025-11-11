import axios from 'axios';
import type { Observable } from 'rxjs';
import { from } from 'rxjs';

import { API_CONFIG } from '@/config/api.config';
import type {
  CreateScheduleRequest,
  Schedule,
  ScheduleResponse,
  ScheduleSearchParams,
  UpdateScheduleRequest,
  WorkingStatus,
} from '@/types/schedule.types';
import { TokenService } from '@/utils/tokenService';

const BASE_URL = API_CONFIG.BASE_URL;

// Create dedicated axios instance for schedule API
const scheduleApiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token interceptor
scheduleApiClient.interceptors.request.use((config) => {
  const token = TokenService.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

class ScheduleService {
  /**
   * Get schedules with pagination and filtering
   */
  getSchedules(params?: ScheduleSearchParams): Observable<ScheduleResponse> {
    return from(
      scheduleApiClient
        .get<ScheduleResponse>('/work-schedules', { params })
        .then((res) => res.data),
    );
  }

  /**
   * Get schedule by ID
   */
  getScheduleById(id: number): Observable<Schedule> {
    return from(
      scheduleApiClient
        .get<Schedule>(`/work-schedules/${id}`)
        .then((res) => res.data),
    );
  }

  /**
   * Get enabled schedules
   */
  getEnabledSchedules(): Observable<Schedule[]> {
    return from(
      scheduleApiClient
        .get<Schedule[]>('/work-schedules/enabled')
        .then((res) => res.data),
    );
  }

  /**
   * Get working statuses
   */
  getWorkingStatuses(): Observable<WorkingStatus[]> {
    return from(
      scheduleApiClient
        .get<WorkingStatus[]>('/work-schedules/working-statuses')
        .then((res) => res.data),
    );
  }

  /**
   * Get schedule usage
   */
  getScheduleUsage(id: number): Observable<{ inUse: boolean; count: number }> {
    return from(
      scheduleApiClient
        .get<{ inUse: boolean; count: number }>(`/work-schedules/usage/${id}`)
        .then((res) => res.data),
    );
  }

  /**
   * Create a new schedule
   */
  createSchedule(data: CreateScheduleRequest): Observable<Schedule> {
    return from(
      scheduleApiClient
        .post<Schedule>('/work-schedules', data)
        .then((res) => res.data),
    );
  }

  /**
   * Update an existing schedule
   */
  updateSchedule(data: UpdateScheduleRequest): Observable<Schedule> {
    return from(
      scheduleApiClient
        .put<Schedule>('/work-schedules', data)
        .then((res) => res.data),
    );
  }

  /**
   * Delete a schedule
   */
  deleteSchedule(id: number): Observable<void> {
    return from(
      scheduleApiClient
        .delete<void>(`/work-schedules/${id}`)
        .then((res) => res.data),
    );
  }
}

export const scheduleService = new ScheduleService();
