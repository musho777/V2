import { useQuery } from '@tanstack/react-query';

import { projectAssignService } from '../services/projectAssign.service';

export const useAssignedProjects = (
  selectedProjectId: number | null,
  enabled: boolean = true,
) => {
  return useQuery({
    queryKey: ['assignedProjects', selectedProjectId],
    queryFn: () =>
      projectAssignService.getAssignedData({
        id: selectedProjectId as number,
      }),
    enabled: enabled && !!selectedProjectId,
  });
};

export const useUnassignedProjects = (
  selectedProjectId: number | null,
  enabled: boolean = true,
) => {
  return useQuery({
    queryKey: ['unassignedProjects', selectedProjectId],
    queryFn: () =>
      projectAssignService.getUnAssignedData({
        id: selectedProjectId as number,
      }),
    enabled: enabled && !!selectedProjectId,
  });
};
