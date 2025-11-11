import { useQuery } from '@tanstack/react-query';
import { firstValueFrom } from 'rxjs';

import { branchService } from '@/services/branch.service';
import type { BranchesParams } from '@/types/branch.types';

export const useBranches = (params: BranchesParams) => {
  return useQuery({
    queryKey: [
      'branches',
      params.page,
      params.size,
      params.departmentId ?? 'all',
    ],
    queryFn: () => firstValueFrom(branchService.getBranches(params)),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};
