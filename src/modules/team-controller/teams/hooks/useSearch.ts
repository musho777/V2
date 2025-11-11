'use client';

import { useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import type { TeamSearchData } from '../types/team.types';

export const useTeamSearchParams = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const defaultSearchData = {
    size: 10,
    page: 0,
    name: '',
    status: '',
  };

  const getString = (key: string) => searchParams.get(key) ?? '';
  const getNumber = (key: string, fallback: number) => {
    const val = searchParams.get(key);
    return val !== null ? Number(val) : fallback;
  };

  const searchData = useMemo(
    () => ({
      size: getNumber('size', defaultSearchData.size),
      page: getNumber('page', defaultSearchData.page),
      name: getString('name'),
      status: getString('status'),
    }),
    [searchParams],
  );

  const setTeamSearchData = (updated: Partial<TeamSearchData>) => {
    const nextParams = new URLSearchParams(searchParams.toString());
    const fullSearchData = { ...searchData, ...updated };

    if (!(Object.keys(updated).length === 1 && 'page' in updated)) {
      fullSearchData.page = 0;
    }

    const appendKey = <K extends keyof TeamSearchData>(
      key: K,
      value: TeamSearchData[K],
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
        keyof TeamSearchData,
        TeamSearchData[keyof TeamSearchData],
      ][]
    ).forEach(([key, value]) => appendKey(key, value));

    router.replace(`${pathname}?${nextParams.toString()}`);
  };

  const resetSearchData = () => {
    const nextParams = new URLSearchParams();

    Object.entries(defaultSearchData).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        nextParams.set(key, String(value));
      }
    });

    router.replace(`${pathname}?${nextParams.toString()}`);
  };

  return {
    searchData,
    setTeamSearchData,
    resetSearchData,
    defaultSearchData,
  };
};
