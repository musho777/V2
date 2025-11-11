import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { projectAssignService } from '../services/projectassign.service';

export const useAssignedProjects = (
  selectedSubprojectId: number | null,
  enabled: boolean = true,
) => {
  return useQuery({
    queryKey: ['assignedProjects', selectedSubprojectId],
    queryFn: () =>
      projectAssignService.getAssignedData({ id: selectedSubprojectId! }),
    enabled: enabled && !!selectedSubprojectId,
  });
};

export const useUnassignedProjects = (
  selectedSubprojectId: number | null,
  enabled: boolean = true,
) => {
  return useQuery({
    queryKey: ['unassignedProjects', selectedSubprojectId],
    queryFn: () =>
      projectAssignService.getUnAssignedData({ id: selectedSubprojectId! }),
    enabled: enabled && !!selectedSubprojectId,
  });
};

export const useAssignTeamsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      subprojects,
    }: {
      projectId: number;
      subprojects: number[];
    }) => projectAssignService.assignTeams({ projectId, subprojects }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['assignedProjects'] });
      void queryClient.invalidateQueries({ queryKey: ['unassignedProjects'] });
    },
    onError: (error) => {
      console.error('Failed to assign subprojects:', error);
    },
  });
};

export const useRemoveTeamsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      projectId,
      subprojectIds,
    }: {
      projectId: number;
      subprojectIds: number[];
    }) => projectAssignService.removeTeams({ projectId, subprojectIds }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['assignedProjects'] });
      void queryClient.invalidateQueries({ queryKey: ['unassignedProjects'] });
    },
    onError: (error) => {
      console.error('Failed to remove subprojects:', error);
    },
  });
};
