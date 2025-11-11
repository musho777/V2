'use client';

import { useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export type AssignmentFilterType =
  | 'onlyAssignee'
  | 'onlyAssigneeNew'
  | 'onlyTeam'
  | 'onlyTeamNew'
  | 'onlyWatcher'
  | 'onlyWatcherNew';

export interface TicketSearchData {
  size: number;
  page: number;
  title?: string;
  status?: string;
  priority?: string;
  projectId?: number;
  projectIds?: number[];
  subprojectIds?: number[];
  trackerIds?: number[];
  statusIds?: number[];
  priorityIds?: number[];
  assigneeUserIds?: number[];
  connectionFilters?: string[];
  createdByIds?: number[];
  assignmentFilter?: AssignmentFilterType;
  search?: string;
  id?: string;
  createdDateFrom?: string;
  createdDateTo?: string;
}

export const useTicketSearchParams = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const defaultSearchData: TicketSearchData = {
    size: 10,
    page: 0,
    title: '',
    status: '',
    priority: '',
    search: '',
    id: '',
    projectIds: [],
    subprojectIds: [],
    trackerIds: [],
    statusIds: [],
    priorityIds: [],
    assigneeUserIds: [],
    connectionFilters: '',
    createdByIds: [],
  };

  const getString = (key: string) => searchParams.get(key) ?? '';
  const getNumber = (key: string, fallback?: number) => {
    const val = searchParams.get(key);
    return val !== null ? Number(val) : fallback;
  };
  const getNumberArray = (key: string): number[] => {
    const vals = searchParams.getAll(key);
    return vals.map((val) => Number(val)).filter((num) => !isNaN(num));
  };
  const getStringArray = (key: string): string[] => {
    const vals = searchParams.getAll(key);
    return vals.filter((val) => val.trim() !== '');
  };

  const searchData = useMemo(
    () => ({
      size: getNumber('size', defaultSearchData.size),
      page: getNumber('page', defaultSearchData.page),
      title: getString('title'),
      status: getString('status'),
      priority: getString('priority'),
      projectId: getNumber('projectId'),
      projectIds: getNumberArray('projectIds'),
      trackerIds: getNumberArray('trackerIds'),
      subprojectIds: getNumberArray('subprojectIds'),
      statusIds: getNumberArray('statusIds'),
      priorityIds: getNumberArray('priorityIds'),
      assigneeUserIds: getNumberArray('assigneeUserIds'),
      connectionFilters: getStringArray('connectionFilters'),

      createdByIds: getNumberArray('createdByIds'),
      assignmentFilter: getString('assignmentFilter') as
        | AssignmentFilterType
        | undefined,
      search: getString('search'),
      id: getString('id'),
      createdDateFrom: getString('createdDateFrom'),
      createdDateTo: getString('createdDateTo'),
    }),
    [searchParams],
  );

  const setTicketSearchData = (updated: Partial<TicketSearchData>) => {
    const nextParams = new URLSearchParams(searchParams.toString());
    const fullSearchData = { ...searchData, ...updated };

    if (!(Object.keys(updated).length === 1 && 'page' in updated)) {
      fullSearchData.page = 0;
    }

    const appendKey = <K extends keyof TicketSearchData>(
      key: K,
      value: TicketSearchData[K],
    ): void => {
      nextParams.delete(key);
      if (Array.isArray(value)) {
        value.forEach((v) => nextParams.append(key, String(v)));
      } else if (value !== null && value !== undefined && value !== '') {
        nextParams.set(key, String(value));
      } else {
        nextParams.delete(key);
      }
    };

    (
      Object.entries(fullSearchData) as [
        keyof TicketSearchData,
        TicketSearchData[keyof TicketSearchData],
      ][]
    ).forEach(([key, value]) => appendKey(key, value));

    router.replace(`${pathname}?${nextParams.toString()}`);
  };
  const resetSearchData = () => {
    const nextParams = new URLSearchParams();

    nextParams.set('page', '0');
    nextParams.set('size', '10');

    router.replace(`${pathname}?${nextParams.toString()}`);
  };
  return {
    searchData,
    setTicketSearchData,
    resetSearchData,
    defaultSearchData,
  };
};
