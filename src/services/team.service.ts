import type { Observable } from 'rxjs';
import { from } from 'rxjs';

import type {
  CreateTeamRequest,
  Team,
  TeamsParams,
  TeamsResponse,
} from '@/types/team.types';
import { httpClient } from '@/utils/httpClient';

class TeamService {
  getTeams(params: TeamsParams): Observable<TeamsResponse> {
    return from(
      httpClient.get<TeamsResponse>(
        `/teams?page=${params.page}&size=${params.size}`,
      ),
    );
  }

  getTeamById(id: number): Observable<Team> {
    return from(httpClient.get<Team>(`/teams/${id}`));
  }

  createTeam(data: CreateTeamRequest): Observable<Team> {
    return from(httpClient.post<Team>('/teams', data));
  }

  updateTeam(id: number, data: CreateTeamRequest): Observable<Team> {
    return from(
      httpClient.put<Team>('/teams', {
        id,
        ...data,
      }),
    );
  }

  updateTeamStatus(id: number, status: boolean): Observable<void> {
    return from(httpClient.patch<void>(`/teams/${id}/status`, { status }));
  }

  deleteTeam(id: number): Observable<void> {
    return from(httpClient.delete<void>(`/teams/${id}`));
  }
}

export const teamService = new TeamService();
