import { useQuery } from '@tanstack/react-query';
import { firstValueFrom } from 'rxjs';

import { userService } from '@/services/user.service';

export const useOfficeLocations = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ['officeLocations'],
    queryFn: () => firstValueFrom(userService.getOfficeLocations()),
    enabled,
    staleTime: 1000 * 60 * 60, // 1 hour - office locations don't change often
    gcTime: 1000 * 60 * 60 * 2, // 2 hours
  });
};
