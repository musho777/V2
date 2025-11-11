import { API_CONFIG } from '@/config/api.config';
import { httpClient } from '@/utils/httpClient';

import type { TeamsQueryParamsApi, TeamsResponse } from '../types/team.types';

const BASE_URL = API_CONFIG.BASE_URL;

// interface TeamProject {
//   id: number;
//   name: string;
//   type: string;
// }

export interface TeamDetails {
  id: number;
  name: string;
  description: string;
  teamLeadId: number;
  teamLeadName: string;
  departmentId: number;
  departmentName: string;
  timezone: {
    id: number;
    name: string;
  };
  status: boolean;
}

export const teamService = {
  /**
   * Get paginated list of teams
   * @param params - Query parameters
   * @param params.name - Filter by team name
   * @param params.status - Filter by status (true/false)
   * @param params.page - Zero-based page index (default: 0)
   * @param params.size - Page size (default: 10)
   * @param params.sort - Sorting criteria in format: property,(asc|desc). Multiple sort criteria supported.
   */
  getTeams: async (params?: TeamsQueryParamsApi): Promise<TeamsResponse> => {
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

    const response = await httpClient.get<TeamsResponse>(
      `${BASE_URL}/subproject-teams?${queryParams.toString()}`,
    );
    return response;
  },

  /**
   * Get team details by ID for editing
   * @param teamId - The team ID
   */
  getTeamById: async (teamId: number): Promise<TeamDetails> => {
    const response = await httpClient.get<TeamDetails>(
      `${BASE_URL}/subproject-teams/${teamId}`,
    );
    return response;
  },

  /**
   * Update team status
   * @param teamId - The team ID
   * @param status - The new status
   */
  updateTeamStatus: async (id: number, status: boolean): Promise<void> => {
    await httpClient.patch(
      `${BASE_URL}/subproject-teams/${id}?status=${status}`,
    );
  },
};
