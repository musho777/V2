import { useQuery } from '@tanstack/react-query';
import { firstValueFrom } from 'rxjs';

import { userService } from '@/services/user.service';

export const useOccupations = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ['occupations'],
    queryFn: () => firstValueFrom(userService.getOccupations()),
    enabled,
    staleTime: 1000 * 60 * 60, // 1 hour - occupations don't change often
    gcTime: 1000 * 60 * 60 * 2, // 2 hours
  });
};
