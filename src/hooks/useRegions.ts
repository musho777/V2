// ✅ src/hooks/useRegions.ts
import { useQuery } from '@tanstack/react-query';
import { firstValueFrom } from 'rxjs';

import { regionService } from '@/services/regions.service';

export interface Region {
  id: number;
  name: string;
}

export const useRegions = (enabled: boolean = true) => {
  return useQuery<Region[]>({
    queryKey: ['regions'],
    queryFn: () => firstValueFrom(regionService.getRegions()),
    enabled,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 2,
  });
};
