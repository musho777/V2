import { useQuery } from '@tanstack/react-query';
import { firstValueFrom } from 'rxjs';

import { archiveService } from '@/services/archive.service';
import type { ArchiveQueryParams } from '@/types/archive.types';

export const useArchivedDepartments = (params?: ArchiveQueryParams) => {
  return useQuery({
    queryKey: ['archived-departments', params],
    queryFn: () =>
      firstValueFrom(archiveService.getArchivedDepartments(params)),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useArchivedBranches = (params?: ArchiveQueryParams) => {
  return useQuery({
    queryKey: ['archived-branches', params],
    queryFn: () => firstValueFrom(archiveService.getArchivedBranches(params)),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useArchivedTeams = (params?: ArchiveQueryParams) => {
  return useQuery({
    queryKey: ['archived-teams', params],
    queryFn: () => firstValueFrom(archiveService.getArchivedTeams(params)),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useArchivedUsers = (params?: ArchiveQueryParams) => {
  return useQuery({
    queryKey: ['archived-users', params],
    queryFn: () => firstValueFrom(archiveService.getArchivedUsers(params)),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
