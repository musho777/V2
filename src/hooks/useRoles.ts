import { useQuery } from '@tanstack/react-query';
import { firstValueFrom } from 'rxjs';

import { userService } from '@/services/user.service';

export const useRoles = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ['roles'],
    queryFn: () => firstValueFrom(userService.getRoles()),
    enabled,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 2,
  });
};
