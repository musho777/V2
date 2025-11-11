import { useQuery } from '@tanstack/react-query';

import { projectService } from '../modules/project/projects/services/project.service';
import type { ProjectsQueryParams } from '../modules/project/projects/types/project.types';

export const useProjects = (
  params?: ProjectsQueryParams,
  enabled: boolean = true,
) => {
  return useQuery({
    queryKey: ['projects', params],
    queryFn: () => projectService.getProjects(params),
    enabled: enabled,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 2,
  });
};
