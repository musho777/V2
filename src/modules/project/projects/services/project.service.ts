import { API_CONFIG } from '@/config/api.config';
import { httpClient } from '@/utils/httpClient';

import type {
  Project,
  ProjectsQueryParamsForApi,
  ProjectsResponse,
} from '../types/project.types';

const BASE_URL = API_CONFIG.BASE_URL;

export interface CreateProjectRequest {
  name: string;
  description?: string;
  status: boolean;
  projectType: {
    id: number;
  };
  projectOwner: {
    id: number;
    role?: {
      id: number;
      role: string;
      default: boolean;
    };
  };
  color?: string;
}

export const projectService = {
  /**
   * Get paginated list of projects
   * @param params - Query parameters
   * @param params.name - Filter by project name
   * @param params.status - Filter by status (true/false)
   * @param params.page - Zero-based page index (default: 0)
   * @param params.size - Page size (default: 10)
   * @param params.sort - Sorting criteria in format: property,(asc|desc). Multiple sort criteria supported.
   */
  getProjects: async (
    params?: ProjectsQueryParamsForApi,
  ): Promise<ProjectsResponse> => {
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

    const response = await httpClient.get<ProjectsResponse>(
      `${BASE_URL}/projects?${queryParams.toString()}`,
    );
    return response;
  },

  /**
   * Create a new project
   * @param data - Project data
   */
  createProject: async (data: CreateProjectRequest): Promise<void> => {
    await httpClient.post(`${BASE_URL}/projects`, data);
  },

  /**
   * Update project status
   * @param id - Project ID
   * @param status - New status value (true/false)
   */
  updateProjectStatus: async (id: number, status: boolean): Promise<void> => {
    await httpClient.patch(`${BASE_URL}/projects/${id}?status=${status}`);
  },

  /**
   * Update an existing project
   * @param id - Project ID
   * @param data - Project data
   */
  updateProject: async (
    id: number,
    data: CreateProjectRequest,
  ): Promise<void> => {
    await httpClient.put(`${BASE_URL}/projects`, { id, ...data });
  },

  /**
   * Get a single project by ID
   * @param id - Project ID
   */
  getProjectById: async (id: number): Promise<Project> => {
    const response = await httpClient.get<Project>(
      `${BASE_URL}/projects/${id}`,
    );
    return response;
  },
};
