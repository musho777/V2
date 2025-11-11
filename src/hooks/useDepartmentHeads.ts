import { useQuery } from '@tanstack/react-query';
import { firstValueFrom } from 'rxjs';

import { userService } from '@/services/user.service';
import type { DepartmentHeadsResponse } from '@/types/user.types';

export const useDepartmentHeads = (shouldFetch: boolean = false) => {
  return useQuery<DepartmentHeadsResponse>({
    queryKey: ['department-heads'],
    queryFn: () => firstValueFrom(userService.getDepartmentHeads()),
    enabled: shouldFetch,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
