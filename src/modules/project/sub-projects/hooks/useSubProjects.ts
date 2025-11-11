import { useQuery } from '@tanstack/react-query';

import { subProjectService } from '../services/sub-project.service';
import type { SubProjectsQueryParams } from '../types/sub-project.types';

export const useSubProjects = (
  params?: SubProjectsQueryParams,
  enabled: boolean = true,
) => {
  return useQuery({
    queryKey: ['sub-projects', params],
    queryFn: () => subProjectService.getSubProjects(params),
    enabled: enabled,
    staleTime: 1000 * 60 * 60,
    gcTime: 1000 * 60 * 60 * 2,
  });
};

export const useManagementTypes = (enabled: boolean = false) => {
  return useQuery({
    queryKey: ['sub-management-type'],
    queryFn: () =>
      subProjectService.getManagementTypes({
        page: 0,
        size: 100,
        status: true,
      }),
    enabled,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
};

export const useSubProjectTypes = (enabled: boolean = false) => {
  return useQuery({
    queryKey: ['subProject-type'],
    queryFn: () =>
      subProjectService.getSubProjectType({
        page: 0,
        size: 100,
      }),
    enabled,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
};
