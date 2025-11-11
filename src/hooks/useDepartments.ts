import { useQuery } from '@tanstack/react-query';
import { firstValueFrom } from 'rxjs';

import { departmentService } from '@/services/department.service';
import type { DepartmentsQueryParams } from '@/types/department.types';

export const useDepartments = (params?: DepartmentsQueryParams) => {
  return useQuery({
    queryKey: ['departments', params],
    queryFn: () => firstValueFrom(departmentService.getDepartments(params)),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
