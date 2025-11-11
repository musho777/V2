import { API_CONFIG } from '@/config/api.config';
import { httpClient } from '@/utils/httpClient';

const BASE_URL = API_CONFIG.BASE_URL;

// Request Interfaces
export interface CreateProjectRequest {
  id: number;
}

export interface AssignTeamsRequest {
  teamId: number;
  userIds: number[];
}

export interface RemoveTeamsRequest {
  teamId: number;
  userIds: number[];
}

export interface TeamMember {
  membershipId: number;
  userId: number;
  user: string;
  role: string;
  teamLead: boolean;
}

export interface AssignedDataResponse {
  assigned: TeamMember[];
}

export interface UnassignedDataResponse {
  unassigned: TeamMember[];
}

export interface EnabledTeam {
  id: number;
  name: string;
}

export interface TeamHead {
  id: number;
  firstName: string;
  lastName: string;
}

// Service
export const projectAssignService = {
  getEnabledTeams: async (): Promise<EnabledTeam[]> => {
    const response = await httpClient.get<EnabledTeam[]>(
      `${BASE_URL}/subproject-teams/enabled`,
    );
    return response;
  },

  getTeamHeads: async (): Promise<TeamHead[]> => {
    const response = await httpClient.get<TeamHead[]>(
      `${BASE_URL}/users/team-heads`,
    );
    return response;
  },

  getAssignedData: async (
    params?: CreateProjectRequest,
  ): Promise<AssignedDataResponse> => {
    const response = await httpClient.get<AssignedDataResponse>(
      `${BASE_URL}/team-membership/assigned/${params?.id}`,
    );
    return response;
  },

  getUnAssignedData: async (
    params?: CreateProjectRequest,
  ): Promise<UnassignedDataResponse> => {
    const response = await httpClient.get<UnassignedDataResponse>(
      `${BASE_URL}/team-membership/unassigned/${params?.id}`,
    );
    return response;
  },

  assignTeams: async (
    params: AssignTeamsRequest,
  ): Promise<{ success: boolean }> => {
    const response = await httpClient.post<{ success: boolean }>(
      `${BASE_URL}/team-membership`,
      {
        teamId: params.teamId,
        userIds: params.userIds,
      },
    );
    return response;
  },

  removeTeams: async (
    params: RemoveTeamsRequest,
  ): Promise<{ success: boolean }> => {
    const response = await httpClient.delete<{ success: boolean }>(
      `${BASE_URL}/team-membership`,
      {
        data: params.userIds,
      },
    );
    return response;
  },
};
