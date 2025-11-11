import { useQuery } from '@tanstack/react-query';
import { firstValueFrom } from 'rxjs';

import { userService } from '@/services/user.service';
import type { UsersQueryParams } from '@/types/user.types';

export const useUsers = (params?: UsersQueryParams) => {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => firstValueFrom(userService.getUsers(params)),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useEnabledUsers = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ['users-enabled'],
    queryFn: () => firstValueFrom(userService.getEnabledUsers()),
    enabled,
    staleTime: 1000 * 60 * 5,
  });
};
