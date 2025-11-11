import { useQuery } from '@tanstack/react-query';

import { projectAssignService } from '../services/teamAssign.service';

export const useEnabledTeams = (enabled: boolean = false) => {
  return useQuery({
    queryKey: ['enabledTeams'],
    queryFn: () => projectAssignService.getEnabledTeams(),
    enabled,
  });
};

export const useAssignedTeams = (
  selectedTeamId: number | null,
  enabled: boolean = true,
) => {
  return useQuery({
    queryKey: ['assignedTeam', selectedTeamId],
    queryFn: () =>
      projectAssignService.getAssignedData({ id: selectedTeamId as number }),
    enabled: enabled && !!selectedTeamId,
  });
};

export const useUnassignedTeams = (
  selectedTeamId: number | null,
  enabled: boolean = true,
) => {
  return useQuery({
    queryKey: ['unassignedTeam', selectedTeamId],
    queryFn: () =>
      projectAssignService.getUnAssignedData({ id: selectedTeamId as number }),
    enabled: enabled && !!selectedTeamId,
  });
};
