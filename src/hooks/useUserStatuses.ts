import { useQuery } from '@tanstack/react-query';
import { firstValueFrom } from 'rxjs';

import { userService } from '@/services/user.service';

export const useUserStatuses = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ['userStatuses'],
    queryFn: () => firstValueFrom(userService.getUserStatuses()),
    enabled, // Only fetch when enabled is true
    staleTime: 1000 * 60 * 60, // 1 hour - statuses don't change often
    gcTime: 1000 * 60 * 60 * 2, // 2 hours (formerly cacheTime)
  });
};
