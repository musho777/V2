import { useQuery } from '@tanstack/react-query';

import { projectTypeService } from '../services/project-type.service';
import type { ProjectTypesQueryParams } from '../types/project-type.types';

export const useProjectTypes = (params?: ProjectTypesQueryParams) => {
  return useQuery({
    queryKey: ['project-types', params],
    queryFn: () => projectTypeService.getProjectTypes(params),
    staleTime: 1000 * 60 * 5,
  });
};
