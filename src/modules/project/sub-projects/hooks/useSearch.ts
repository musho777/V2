'use client';

import { useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import type { SubProjectSearchData } from '../types/sub-project.types';

export const useSubProjectSearchParams = () => {
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

  const setSubProjectSearchData = (updated: Partial<SubProjectSearchData>) => {
    const nextParams = new URLSearchParams(searchParams.toString());
    const fullSearchData = { ...searchData, ...updated };

    if (!(Object.keys(updated).length === 1 && 'page' in updated)) {
      fullSearchData.page = 0;
    }

    const appendKey = <K extends keyof SubProjectSearchData>(
      key: K,
      value: SubProjectSearchData[K],
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
        keyof SubProjectSearchData,
        SubProjectSearchData[keyof SubProjectSearchData],
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
    setSubProjectSearchData,
    resetSearchData,
    defaultSearchData,
  };
};
