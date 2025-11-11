import axios from 'axios';
import type { Observable } from 'rxjs';
import { from } from 'rxjs';

import { API_CONFIG } from '@/config/api.config';
import type {
  AssignEmployeeScheduleRequest,
  AssignEmployeeScheduleResponse,
  EmployeeScheduleResponse,
  WorkSchedule,
} from '@/types/employee-schedule.types';
import { TokenService } from '@/utils/tokenService';

const BASE_URL = API_CONFIG.BASE_URL;

// Create dedicated axios instance for employee schedule API
const employeeScheduleApiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token interceptor
employeeScheduleApiClient.interceptors.request.use((config) => {
  const token = TokenService.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

class EmployeeScheduleService {
  /**
   * Get enabled work schedules
   */
  getEnabledWorkSchedules(): Observable<WorkSchedule[]> {
    return from(
      employeeScheduleApiClient
        .get<WorkSchedule[]>('/work-schedules/enabled')
        .then((res) => res.data),
    );
  }

  /**
   * Get employee schedule by employee ID
   * Returns the current schedule or the first upcoming schedule if no current exists
   */
  getEmployeeSchedule(
    employeeId: number,
  ): Observable<EmployeeScheduleResponse | null> {
    return from(
      employeeScheduleApiClient
        .get<
          EmployeeScheduleResponse[]
        >(`/employee-schedules/employee/${employeeId}`)
        .then((res) => {
          const schedules = res.data;
          if (!schedules || schedules.length === 0) {
            return null;
          }

          // Find the current schedule
          const currentSchedule = schedules.find(
            (s) => s.scheduleStatus?.status === 'Current',
          );

          // Return current schedule or the first schedule if no current exists
          return currentSchedule || schedules[0];
        }),
    );
  }

  /**
   * Assign schedule to employee
   */
  assignSchedule(
    data: AssignEmployeeScheduleRequest,
  ): Observable<AssignEmployeeScheduleResponse> {
    return from(
      employeeScheduleApiClient
        .post<AssignEmployeeScheduleResponse>('/employee-schedules', data)
        .then((res) => res.data),
    );
  }

  /**
   * Update employee schedule
   */
  updateEmployeeSchedule(
    data: AssignEmployeeScheduleRequest,
  ): Observable<AssignEmployeeScheduleResponse> {
    return from(
      employeeScheduleApiClient
        .put<AssignEmployeeScheduleResponse>('/employee-schedules', data)
        .then((res) => res.data),
    );
  }
}

export const employeeScheduleService = new EmployeeScheduleService();
