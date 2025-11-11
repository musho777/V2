import axios from 'axios';
import type { Observable } from 'rxjs';
import { from } from 'rxjs';

import { API_CONFIG } from '@/config/api.config';
import type {
  ArchivedBranch,
  ArchivedDepartment,
  ArchivedTeam,
  ArchivedUser,
  ArchiveQueryParams,
  ArchiveResponse,
} from '@/types/archive.types';
import { TokenService } from '@/utils/tokenService';

const BASE_URL = API_CONFIG.BASE_URL;

// Create dedicated axios instance for archive API
const archiveApiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token interceptor
archiveApiClient.interceptors.request.use((config) => {
  const token = TokenService.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

class ArchiveService {
  /**
   * Get archived departments with pagination
   */
  getArchivedDepartments(
    params?: ArchiveQueryParams,
  ): Observable<ArchiveResponse<ArchivedDepartment>> {
    const queryParams = new URLSearchParams({
      timezone: params?.timezone ?? 'Asia/Yerevan',
      page: String(params?.page ?? 0),
      size: String(params?.size ?? 10),
    });

    if (params?.search) {
      queryParams.append('search', params.search);
    }
    if (params?.fromDate) {
      queryParams.append('fromDate', params.fromDate);
    }
    if (params?.toDate) {
      queryParams.append('toDate', params.toDate);
    }
    if (params?.sort) {
      params.sort.forEach((sortParam) => {
        queryParams.append('sort', sortParam);
      });
    }

    return from(
      archiveApiClient
        .get<
          ArchiveResponse<ArchivedDepartment>
        >(`/archives/departments?${queryParams.toString()}`)
        .then((res) => res.data),
    );
  }

  /**
   * Get archived branches with pagination
   */
  getArchivedBranches(
    params?: ArchiveQueryParams,
  ): Observable<ArchiveResponse<ArchivedBranch>> {
    const queryParams = new URLSearchParams({
      timezone: params?.timezone ?? 'Asia/Yerevan',
      page: String(params?.page ?? 0),
      size: String(params?.size ?? 10),
    });

    if (params?.search) {
      queryParams.append('search', params.search);
    }
    if (params?.fromDate) {
      queryParams.append('fromDate', params.fromDate);
    }
    if (params?.toDate) {
      queryParams.append('toDate', params.toDate);
    }
    if (params?.sort) {
      params.sort.forEach((sortParam) => {
        queryParams.append('sort', sortParam);
      });
    }

    return from(
      archiveApiClient
        .get<
          ArchiveResponse<ArchivedBranch>
        >(`/archives/branches?${queryParams.toString()}`)
        .then((res) => res.data),
    );
  }

  /**
   * Get archived teams with pagination
   */
  getArchivedTeams(
    params?: ArchiveQueryParams,
  ): Observable<ArchiveResponse<ArchivedTeam>> {
    const queryParams = new URLSearchParams({
      timezone: params?.timezone ?? 'Asia/Yerevan',
      page: String(params?.page ?? 0),
      size: String(params?.size ?? 10),
    });

    if (params?.search) {
      queryParams.append('search', params.search);
    }
    if (params?.fromDate) {
      queryParams.append('fromDate', params.fromDate);
    }
    if (params?.toDate) {
      queryParams.append('toDate', params.toDate);
    }
    if (params?.sort) {
      params.sort.forEach((sortParam) => {
        queryParams.append('sort', sortParam);
      });
    }

    return from(
      archiveApiClient
        .get<
          ArchiveResponse<ArchivedTeam>
        >(`/archives/teams?${queryParams.toString()}`)
        .then((res) => res.data),
    );
  }

  /**
   * Get archived users with pagination
   */
  getArchivedUsers(
    params?: ArchiveQueryParams,
  ): Observable<ArchiveResponse<ArchivedUser>> {
    const queryParams = new URLSearchParams({
      timezone: params?.timezone ?? 'Asia/Yerevan',
      page: String(params?.page ?? 0),
      size: String(params?.size ?? 10),
    });

    if (params?.search) {
      queryParams.append('search', params.search);
    }
    if (params?.fromDate) {
      queryParams.append('fromDate', params.fromDate);
    }
    if (params?.toDate) {
      queryParams.append('toDate', params.toDate);
    }
    if (params?.sort) {
      params.sort.forEach((sortParam) => {
        queryParams.append('sort', sortParam);
      });
    }

    return from(
      archiveApiClient
        .get<
          ArchiveResponse<ArchivedUser>
        >(`/archives/users?${queryParams.toString()}`)
        .then((res) => res.data),
    );
  }

  /**
   * Restore an archived item
   */
  restoreItem(
    type: 'departments' | 'branches' | 'teams' | 'users',
    id: number,
  ): Observable<void> {
    return from(
      archiveApiClient
        .patch<void>(`/archives/${type}/${id}/restore`)
        .then((res) => res.data),
    );
  }

  /**
   * Permanently delete an archived item
   */
  permanentlyDeleteItem(
    type: 'departments' | 'branches' | 'teams' | 'users',
    id: number,
  ): Observable<void> {
    return from(
      archiveApiClient
        .delete<void>(`/archives/${type}/${id}`)
        .then((res) => res.data),
    );
  }
}

export const archiveService = new ArchiveService();
