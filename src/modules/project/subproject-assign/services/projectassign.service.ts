import { API_CONFIG } from '@/config/api.config';
import { httpClient } from '@/utils/httpClient';

const BASE_URL = API_CONFIG.BASE_URL;

export interface GetDataRequest {
  id: number;
}
export interface AssignTeamsRequest {
  projectId: number;
  subprojects: number[];
}
export interface RemoveTeamsRequest {
  projectId: number;
  subprojectIds: number[];
}

export interface TeamData {
  id: number;
  name: string;
  user: string;
  subprojectName: string;
  userId: number;
  assignedId: number;
}

export const projectAssignService = {
  /**
   * @param params.id - id
   */
  getAssignedData: async (params?: GetDataRequest): Promise<TeamData[]> => {
    const queryParams = new URLSearchParams();

    queryParams.append('subprojectId', String(params?.id));

    const response = await httpClient.get<TeamData[]>(
      `${BASE_URL}/subproject-team-assignment/assigned/${params?.id}`,
    );
    return response;
  },
  getUnAssignedData: async (params?: GetDataRequest): Promise<TeamData[]> => {
    const queryParams = new URLSearchParams();

    queryParams.append('projectId', String(params?.id));

    const response = await httpClient.get<TeamData[]>(
      `${BASE_URL}/subproject-team-assignment/unassigned/${params?.id}`,
    );
    return response;
  },
  assignTeams: async (params: AssignTeamsRequest): Promise<void> => {
    const response = await httpClient.post<void>(
      `${BASE_URL}/subproject-team-assignment`,
      {
        subprojectId: params.projectId,
        subprojectTeams: params.subprojects.map((id) => ({ id })),
      },
    );
    return response;
  },
  removeTeams: async (params: RemoveTeamsRequest): Promise<void> => {
    const response = await httpClient.delete<void>(
      `${BASE_URL}/subproject-team-assignment`,
      {
        data: params.subprojectIds,
      },
    );
    return response;
  },
};
