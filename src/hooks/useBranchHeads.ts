import { useQuery } from '@tanstack/react-query';
import { firstValueFrom, from } from 'rxjs';

import { httpClient } from '@/utils/httpClient';

export interface BranchHead {
  id: number;
  name: string;
}

export const useBranchHeads = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ['branchHeads'],
    queryFn: () =>
      firstValueFrom(from(httpClient.get<BranchHead[]>('/users/branch-heads'))),
    enabled,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  });
};
