import axios from 'axios';
import type { Observable } from 'rxjs';
import { from } from 'rxjs';

import { API_CONFIG } from '@/config/api.config';
import type {
  Branch,
  BranchesParams,
  BranchesResponse,
  CreateBranchRequest,
} from '@/types/branch.types';
import { TokenService } from '@/utils/tokenService';

const BASE_URL = API_CONFIG.BASE_URL;

// Create dedicated axios instance for branch API
const branchApiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token interceptor
branchApiClient.interceptors.request.use((config) => {
  const token = TokenService.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

class BranchService {
  /**
   * Get paginated list of branches
   */
  getBranches(params?: BranchesParams): Observable<BranchesResponse> {
    const queryParams = new URLSearchParams({
      page: String(params?.page ?? 0),
      size: String(params?.size ?? 10),
    });

    if (params?.departmentId) {
      queryParams.append('departmentId', String(params.departmentId));
    }

    return from(
      branchApiClient
        .get<BranchesResponse>(`/branches?${queryParams.toString()}`)
        .then((res) => res.data),
    );
  }

  /**
   * Get a single branch by ID
   */
  getBranchById(id: number): Observable<Branch> {
    return from(
      branchApiClient.get<Branch>(`/branches/${id}`).then((res) => res.data),
    );
  }

  /**
   * Create a new branch
   */
  createBranch(data: CreateBranchRequest): Observable<Branch> {
    return from(
      branchApiClient.post<Branch>('/branches', data).then((res) => res.data),
    );
  }

  /**
   * Update an existing branch
   */
  updateBranch(id: number, data: CreateBranchRequest): Observable<Branch> {
    return from(
      branchApiClient
        .put<Branch>(`/branches`, {
          id,
          ...data,
        })
        .then((res) => res.data),
    );
  }

  /**
   * Update branch status (enable/disable)
   */
  updateBranchStatus(id: number, status: boolean): Observable<Branch> {
    return from(
      branchApiClient
        .patch<Branch>(`/branches/${id}?status=${status}`)
        .then((res) => res.data),
    );
  }
}

export const branchService = new BranchService();
