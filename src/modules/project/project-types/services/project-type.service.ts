import { API_CONFIG } from '@/config/api.config';
import { httpClient } from '@/utils/httpClient';

import type {
  CreateProjectTypeRequest,
  ProjectTypesQueryParams,
  ProjectTypesResponse,
  UpdateProjectTypeRequest,
} from '../types/project-type.types';

const BASE_URL = API_CONFIG.BASE_URL;

export const projectTypeService = {
  /**
   * Get paginated list of project types
   * @param params - Query parameters
   * @param params.name - Filter by project type name
   * @param params.status - Filter by status (true/false)
   * @param params.page - Zero-based page index (default: 0)
   * @param params.size - Page size (default: 10)
   * @param params.sort - Sorting criteria in format: property,(asc|desc). Multiple sort criteria supported.
   */
  getProjectTypes: async (
    params?: ProjectTypesQueryParams,
  ): Promise<ProjectTypesResponse> => {
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

    const response = await httpClient.get<ProjectTypesResponse>(
      `${BASE_URL}/project-types?${queryParams.toString()}`,
    );
    return response;
  },

  /**
   * Update project type status
   * @param id - Project type ID
   * @param status - New status value (true/false)
   */
  updateProjectTypeStatus: async (
    id: number,
    status: boolean,
  ): Promise<void> => {
    await httpClient.patch(`${BASE_URL}/project-types/${id}?status=${status}`);
  },

  /**
   * Create a new project type
   * @param data - Project type data
   */
  createProjectType: async (data: CreateProjectTypeRequest): Promise<void> => {
    await httpClient.post(`${BASE_URL}/project-types`, data);
  },

  /**
   * Update an existing project type
   * @param data - Project type data with id
   */
  updateProjectType: async (data: UpdateProjectTypeRequest): Promise<void> => {
    await httpClient.put(`${BASE_URL}/project-types`, data);
  },
};
