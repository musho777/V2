import { API_CONFIG } from '@/config/api.config';
import { httpClient } from '@/utils/httpClient';

import type {
  SubProject,
  SubProjectsQueryParamsApi,
  SubProjectsResponse,
} from '../types/sub-project.types';

const BASE_URL = API_CONFIG.BASE_URL;

export interface CreateSubProjectRequest {
  name: string;
  description?: string;
  status: boolean;
  subprojectTypeName: string;
  managementTypeName: string;
  timezone: {
    id: number;
    name: string;
  };
  startTime?: string;
  endTime?: string;
}

export interface ManagementType {
  id?: number;
  name?: string;
  typeName?: string;
  label?: string;
}

export interface SubProjectType {
  id?: number;
  name?: string;
  typeName?: string;
  label?: string;
}

export interface Timezone {
  id?: number;
  name?: string;
  label?: string;
}

export const subProjectService = {
  /**
   * Get paginated list of sub-projects
   * @param params - Query parameters
   * @param params.name - Filter by sub-project name
   * @param params.status - Filter by status (true/false)
   * @param params.page - Zero-based page index (default: 0)
   * @param params.size - Page size (default: 10)
   * @param params.sort - Sorting criteria in format: property,(asc|desc). Multiple sort criteria supported.
   */
  getSubProjects: async (
    params?: SubProjectsQueryParamsApi,
  ): Promise<SubProjectsResponse> => {
    const queryParams = new URLSearchParams();

    queryParams.append('page', String(params?.page ?? 0));
    queryParams.append('size', String(params?.size ?? 10));

    if (params?.name !== undefined) {
      queryParams.append('name', params.name);
    }

    if (params?.status !== undefined) {
      queryParams.append('status', String(params.status));
    }

    if (params?.sort) {
      const sortArray = Array.isArray(params.sort)
        ? params.sort
        : [params.sort];
      sortArray.forEach((sortParam) => {
        queryParams.append('sort', sortParam);
      });
    }

    const response = await httpClient.get<SubProjectsResponse>(
      `${BASE_URL}/subprojects?${queryParams.toString()}`,
    );
    return response;
  },

  /**
   * Update sub-project status
   * @param id - Sub-project ID
   * @param status - New status value (true/false)
   */
  updateSubProjectStatus: async (
    id: number,
    status: boolean,
  ): Promise<void> => {
    await httpClient.patch(`${BASE_URL}/subprojects/${id}?status=${status}`);
  },

  /**
   * Create a new sub-project
   * @param data - Sub-project data
   */
  createSubProject: async (data: CreateSubProjectRequest): Promise<void> => {
    await httpClient.post(`${BASE_URL}/subprojects`, data);
  },

  /**
   * Update an existing sub-project
   * @param id - Sub-project ID
   * @param data - Sub-project data
   */
  updateSubProject: async (
    id: number,
    data: CreateSubProjectRequest,
  ): Promise<void> => {
    await httpClient.put(`${BASE_URL}/subprojects`, { id, ...data });
  },

  /**
   * Get a single sub-project by ID
   * @param id - Sub-project ID
   */
  getSubProjectById: async (id: number): Promise<SubProject> => {
    const response = await httpClient.get<SubProject>(
      `${BASE_URL}/subprojects/${id}`,
    );
    return response;
  },
  getManagementTypes: async (params?: {
    page?: number;
    size?: number;
    status?: boolean;
  }): Promise<ManagementType[]> => {
    const queryParams = new URLSearchParams();

    if (params?.page !== undefined) {
      queryParams.append('page', String(params.page));
    }

    if (params?.size !== undefined) {
      queryParams.append('size', String(params.size));
    }

    const url = `${BASE_URL}/subprojects/management-types${
      queryParams.toString() ? `?${queryParams.toString()}` : ''
    }`;

    const response = await httpClient.get<ManagementType[]>(url);
    return Array.isArray(response) ? response : [];
  },
  getSubProjectType: async (params?: {
    page?: number;
    size?: number;
  }): Promise<SubProjectType[]> => {
    const queryParams = new URLSearchParams();

    if (params?.page !== undefined) {
      queryParams.append('page', String(params.page));
    }

    if (params?.size !== undefined) {
      queryParams.append('size', String(params.size));
    }

    const url = `${BASE_URL}/subprojects/types${
      queryParams.toString() ? `?${queryParams.toString()}` : ''
    }`;

    const response = await httpClient.get<SubProjectType[]>(url);
    return Array.isArray(response) ? response : [];
  },

  /**
   * Get list of timezones
   * @param params - Optional query parameters
   */
  getTimezones: async (params?: {
    page?: number;
    size?: number;
  }): Promise<Timezone[]> => {
    const queryParams = new URLSearchParams();

    if (params?.page !== undefined) {
      queryParams.append('page', String(params.page));
    }

    if (params?.size !== undefined) {
      queryParams.append('size', String(params.size));
    }

    const url = `${BASE_URL}/timezones${
      queryParams.toString() ? `?${queryParams.toString()}` : ''
    }`;

    const response = await httpClient.get<Timezone[]>(url);
    return Array.isArray(response) ? response : [];
  },
};
