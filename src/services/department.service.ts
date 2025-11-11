import axios from 'axios';
import type { Observable } from 'rxjs';
import { from } from 'rxjs';

import { API_CONFIG } from '@/config/api.config';
import type {
  CreateDepartmentRequest,
  Department,
  DepartmentsQueryParams,
  DepartmentsResponse,
} from '@/types/department.types';
import { TokenService } from '@/utils/tokenService';

const BASE_URL = API_CONFIG.BASE_URL;

// Create dedicated axios instance for department API
const departmentApiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token interceptor
departmentApiClient.interceptors.request.use((config) => {
  const token = TokenService.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

class DepartmentService {
  /**
   * Get paginated list of departments
   */
  getDepartments(
    params?: DepartmentsQueryParams,
  ): Observable<DepartmentsResponse> {
    const queryParams = new URLSearchParams({
      page: String(params?.page ?? 0),
      size: String(params?.size ?? 10),
    });

    return from(
      departmentApiClient
        .get<DepartmentsResponse>(`/departments?${queryParams.toString()}`)
        .then((res) => res.data),
    );
  }

  /**
   * Update department status (enable/disable)
   */
  updateDepartmentStatus(id: number, status: boolean): Observable<Department> {
    return from(
      departmentApiClient
        .patch<Department>(`/departments/${id}?status=${status}`)
        .then((res) => res.data),
    );
  }

  /**
   * Create a new department
   */
  createDepartment(data: CreateDepartmentRequest): Observable<Department> {
    return from(
      departmentApiClient
        .post<Department>('/departments', data)
        .then((res) => res.data),
    );
  }

  /**
   * Update an existing department
   */
  updateDepartment(
    id: number,
    data: CreateDepartmentRequest,
  ): Observable<Department> {
    return from(
      departmentApiClient
        .put<Department>(`/departments`, {
          id,
          ...data,
        })
        .then((res) => res.data),
    );
  }

  /**
   * Get enabled departments
   */
  getEnabledDepartments(): Observable<Department[]> {
    return from(
      departmentApiClient
        .get<Department[]>('/departments/enabled')
        .then((res) => res.data),
    );
  }
}

export const departmentService = new DepartmentService();
