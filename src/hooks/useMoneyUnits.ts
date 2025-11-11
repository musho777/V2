import { useQuery } from '@tanstack/react-query';
import { firstValueFrom } from 'rxjs';

import { userService } from '@/services/user.service';

export const useMoneyUnits = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ['money-units'],
    queryFn: () => firstValueFrom(userService.getMoneyUnits()),
    enabled,
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 2, // 2 hours
  });
};
