import { useQuery } from '@tanstack/react-query';
import { firstValueFrom } from 'rxjs';

import { userService } from '@/services/user.service';

export const useHolidays = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ['holidays'],
    queryFn: () => firstValueFrom(userService.getHolidays()),
    enabled,
    staleTime: 1000 * 60 * 60, // 1 hour - holidays don't change often
    gcTime: 1000 * 60 * 60 * 2, // 2 hours
  });
};
