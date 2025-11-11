import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { firstValueFrom, from } from 'rxjs';

import { notificationService } from '@/components/Notification/Notification';
import { teamService } from '@/modules/team-controller/teams/services/team.service';
import type {
  CreateTeamData,
  TeamLead,
  TeamsQueryParams,
} from '@/modules/team-controller/teams/types/team.types';
import { departmentService } from '@/services/department.service';
import { httpClient } from '@/utils/httpClient';

import { subProjectService } from '../modules/project/sub-projects/services/sub-project.service';

export const useSubTeams = (params?: TeamsQueryParams) => {
  return useQuery({
    queryKey: ['teams', params],
    queryFn: () => teamService.getTeams(params),
    staleTime: 1000 * 60 * 5,
  });
};

export const useTeamDetails = (teamId?: string | null, enabled = false) => {
  return useQuery({
    queryKey: ['team-details', teamId],
    queryFn: () => teamService.getTeamById(Number(teamId)),
    enabled: enabled && !!teamId,
  });
};

export const useTeamLeads = (enabled = false) => {
  return useQuery({
    queryKey: ['users-team-heads'],
    queryFn: () =>
      firstValueFrom(from(httpClient.get<TeamLead[]>('/users/team-heads'))),
    enabled,
  });
};

export const useDepartments = (enabled = false) => {
  return useQuery({
    queryKey: ['departments', 'enabled'],
    queryFn: () => firstValueFrom(departmentService.getEnabledDepartments()),
    enabled,
  });
};

export const useTimezones = (enabled = false) => {
  return useQuery({
    queryKey: ['timezones'],
    queryFn: () =>
      subProjectService.getTimezones({
        page: 0,
        size: 100,
      }),
    enabled,
  });
};

export const useTeamStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: boolean }) =>
      teamService.updateTeamStatus(id, status),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['teams'] });
      message.success('Team status updated successfully');
    },
    onError: (error: unknown) => {
      const errorMessage =
        (
          error as {
            response?: { data?: { message?: string } };
            message?: string;
          }
        )?.response?.data?.message ||
        (error as { message?: string })?.message ||
        'Failed to update team status';

      notificationService.error({
        message: 'Error',
        description: errorMessage,
      });
    },
  });
};

export const useCreateTeamMutation = (
  isEditMode: boolean,
  teamId?: string | null,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTeamData) => {
      const url =
        isEditMode && teamId ? `/subproject-teams` : '/subproject-teams';
      const method = isEditMode ? 'put' : 'post';
      return firstValueFrom(from(httpClient[method](url, data)));
    },
    onSuccess: () => {
      message.success(
        isEditMode ? 'Team updated successfully' : 'Team created successfully',
      );
      void queryClient.invalidateQueries({ queryKey: ['teams'] });
      void queryClient.invalidateQueries({
        queryKey: ['team-details', teamId],
      });
    },
    onError: (error: unknown) => {
      const errorMessage =
        (
          error as {
            response?: { data?: { message?: string } };
            message?: string;
          }
        )?.response?.data?.message ||
        (error as { message?: string })?.message ||
        (isEditMode ? 'Failed to update team' : 'Failed to create team');
      message.error(errorMessage);
    },
  });
};
