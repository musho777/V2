import { useQuery } from '@tanstack/react-query';
import { firstValueFrom } from 'rxjs';

import { teamService } from '@/services/team.service';
import type { TeamsParams } from '@/types/team.types';

export const useTeams = (params: TeamsParams) => {
  return useQuery({
    queryKey: ['teams', params.page, params.size],
    queryFn: () => firstValueFrom(teamService.getTeams(params)),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
