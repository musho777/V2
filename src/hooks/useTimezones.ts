import { useQuery } from '@tanstack/react-query';
import { firstValueFrom } from 'rxjs';

import { userService } from '@/services/user.service';

export const useTimezones = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ['timezones'],
    queryFn: () => firstValueFrom(userService.getTimezones()),
    enabled,
    staleTime: 1000 * 60 * 60, // 1 hour - timezones don't change often
    gcTime: 1000 * 60 * 60 * 2, // 2 hours
  });
};
