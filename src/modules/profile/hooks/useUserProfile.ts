import { useQuery } from '@tanstack/react-query';
import { firstValueFrom } from 'rxjs';

import { userService } from '@/services/user.service';

import type { UserProfile } from '../types/profile.types';

export function useUserProfile(userId?: number) {
  return useQuery<UserProfile>({
    queryKey: ['userProfile', userId],
    queryFn: async () => {
      if (userId) {
        return firstValueFrom(userService.getUserProfile(userId));
      }
      return firstValueFrom(userService.getCurrentUserProfile());
    },
    enabled: true,
  });
}
