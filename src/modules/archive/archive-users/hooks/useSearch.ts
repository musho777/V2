'use client';

import { useCallback, useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import type { ArchiveUserSearchData } from '../types/archive-user.types';

const defaultSearchData: ArchiveUserSearchData = {
  size: 10,
  page: 0,
  search: '',
};

export const useArchiveUserSearchParams = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const getString = useCallback(
    (key: string) => searchParams.get(key) ?? '',
    [searchParams],
  );
  const getNumber = useCallback(
    (key: string, fallback: number) => {
      const val = searchParams.get(key);
      return val !== null ? Number(val) : fallback;
    },
    [searchParams],
  );
  const getArray = useCallback(
    (key: string): string[] => {
      return searchParams.getAll(key);
    },
    [searchParams],
  );

  const searchData = useMemo(
    () => ({
      size: getNumber('size', defaultSearchData.size),
      page: getNumber('page', defaultSearchData.page),
      search: getString('search'),
      sort: getArray('sort').length > 0 ? getArray('sort') : undefined,
    }),
    [getNumber, getString, getArray],
  );

  const setSearchData = (updated: Partial<ArchiveUserSearchData>) => {
    const nextParams = new URLSearchParams(searchParams.toString());
    const fullSearchData = { ...searchData, ...updated };

    if (!(Object.keys(updated).length === 1 && 'page' in updated)) {
      fullSearchData.page = 0;
    }

    const appendKey = <K extends keyof ArchiveUserSearchData>(
      key: K,
      value: ArchiveUserSearchData[K],
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
        keyof ArchiveUserSearchData,
        ArchiveUserSearchData[keyof ArchiveUserSearchData],
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
    setSearchData,
    resetSearchData,
    defaultSearchData,
  };
};
