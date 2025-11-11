import { useQuery } from '@tanstack/react-query';
import { firstValueFrom } from 'rxjs';

import { userService } from '@/services/user.service';

export const useCommissions = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ['commissions'],
    queryFn: () => firstValueFrom(userService.getCommissions()),
    enabled,
    staleTime: 1000 * 60 * 60, // 1 hour - commissions don't change often
    gcTime: 1000 * 60 * 60 * 2, // 2 hours
  });
};
