import { useQuery } from '@tanstack/react-query';

import { projectTypeService } from '../../project-types/services/project-type.service';

export const useProjectTypesAll = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ['project-types-all'],
    queryFn: () =>
      projectTypeService.getProjectTypes({
        page: 0,
        size: 10000,
        status: true,
      }),
    enabled,
  });
};
