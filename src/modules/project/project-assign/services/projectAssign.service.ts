import { API_CONFIG } from '@/config/api.config';
import { httpClient } from '@/utils/httpClient';

const BASE_URL = API_CONFIG.BASE_URL;

export interface GetDataRequest {
  id: number;
}
export interface AssignSubprojectsRequest {
  projectId: number;
  subprojects: { id: number }[];
}
export interface RemoveSubprojectsRequest {
  projectId: number;
  subprojectIds: number[];
}

export interface SubprojectData {
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
  getAssignedData: async (
    params?: GetDataRequest,
  ): Promise<SubprojectData[]> => {
    const queryParams = new URLSearchParams();

    queryParams.append('projectId', String(params?.id));

    const response = await httpClient.get<SubprojectData[]>(
      `${BASE_URL}/subproject-assignment/assigned/${params?.id}`,
    );
    return response;
  },
  getUnAssignedData: async (
    params?: GetDataRequest,
  ): Promise<SubprojectData[]> => {
    const queryParams = new URLSearchParams();

    queryParams.append('projectId', String(params?.id));

    const response = await httpClient.get<SubprojectData[]>(
      `${BASE_URL}/subproject-assignment/unassigned/${params?.id}`,
    );
    return response;
  },
  assignSubprojects: async (
    params: AssignSubprojectsRequest,
  ): Promise<void> => {
    const response = await httpClient.post<void>(
      `${BASE_URL}/subproject-assignment`,
      {
        projectId: params.projectId,
        subprojects: params.subprojects,
      },
    );
    return response;
  },
  removeSubprojects: async (
    params: RemoveSubprojectsRequest,
  ): Promise<void> => {
    const response = await httpClient.delete<void>(
      `${BASE_URL}/subproject-assignment`,
      {
        data: params.subprojectIds,
      },
    );
    return response;
  },
};
