import { useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import type { Customer } from '../services/customer.service';
import { customerServiceObservable } from '../services/customer.service.observable';
import type {
  PaginationState,
  SearchFormParams,
  SearchParams,
} from '../types/search.types';

import { useObservableLazy } from './useObservable';

export const useSearchClientObservable = () => {
  const router = useRouter();
  const searchParamsUrl = useSearchParams();

  const [formParams, setFormParams] = useState<SearchFormParams>({
    id: '',
    name: '',
    streetId: null,
    buildingId: null,
    flat: '',
    phoneNumber: '',
  });

  const [tableData, setTableData] = useState<Customer[]>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // Observable hooks
  const [executeSearch, searchState] = useObservableLazy(
    (params: SearchParams) => customerServiceObservable.search(params),
  );

  const [executeSearchById, searchByIdState] = useObservableLazy((id: number) =>
    customerServiceObservable.searchById(id),
  );

  // Update table data when search completes
  useEffect(() => {
    if (searchState.data) {
      setTableData(searchState.data.content);
      setPagination({
        current: searchState.data.number + 1,
        pageSize: searchState.data.size,
        total: searchState.data.totalElements,
      });
    } else if (searchState.error) {
      setTableData([]);
    }
  }, [searchState.data, searchState.error]);

  // Update table data when search by ID completes
  useEffect(() => {
    if (searchByIdState.data) {
      setTableData([searchByIdState.data]);
      setPagination({
        current: 1,
        pageSize: 10,
        total: 1,
      });
    } else if (searchByIdState.error) {
      setTableData([]);
      setPagination({
        current: 1,
        pageSize: 10,
        total: 0,
      });
    }
  }, [searchByIdState.data, searchByIdState.error]);

  // Initialize form from URL params and perform initial search
  useEffect(() => {
    const name = searchParamsUrl.get('name') || '';
    const streetId = searchParamsUrl.get('streetId');
    const buildingId = searchParamsUrl.get('buildingId');
    const flat = searchParamsUrl.get('flat') || '';
    const phoneNumber = searchParamsUrl.get('phoneNumber') || '';

    setFormParams({
      id: '',
      name,
      streetId: streetId ? Number(streetId) : null,
      buildingId: buildingId ? Number(buildingId) : null,
      flat,
      phoneNumber,
    });

    // Always trigger search - with or without params
    executeSearch({
      name: name || undefined,
      streetId: streetId ? Number(streetId) : undefined,
      buildingId: buildingId ? Number(buildingId) : undefined,
      flat: flat ? Number(flat) : undefined,
      phoneNumber: phoneNumber || undefined,
      page: 0,
      size: 10,
    });
  }, [searchParamsUrl, executeSearch]);

  const handleFormChange = useCallback(
    (field: keyof SearchFormParams, value: string | number | null) => {
      setFormParams((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  const handleSearch = useCallback(() => {
    const params = new URLSearchParams();

    if (formParams.name) params.append('name', formParams.name);
    if (formParams.streetId)
      params.append('streetId', String(formParams.streetId));
    if (formParams.buildingId)
      params.append('buildingId', String(formParams.buildingId));
    if (formParams.flat) params.append('flat', formParams.flat);
    if (formParams.phoneNumber)
      params.append('phoneNumber', formParams.phoneNumber);

    router.push(`?${params.toString()}`);
  }, [formParams, router]);

  const handleIdSearch = useCallback(() => {
    if (!formParams.id.trim()) {
      return;
    }
    executeSearchById(Number(formParams.id));
  }, [formParams.id, executeSearchById]);

  const handleReset = useCallback(() => {
    setFormParams({
      id: '',
      name: '',
      streetId: null,
      buildingId: null,
      flat: '',
      phoneNumber: '',
    });
    setTableData([]);
    setPagination({
      current: 1,
      pageSize: 10,
      total: 0,
    });
    router.push('?');
  }, [router]);

  const handleTableChange = useCallback(
    (newPagination: any) => {
      executeSearch({
        name: formParams.name || undefined,
        streetId: formParams.streetId || undefined,
        buildingId: formParams.buildingId || undefined,
        flat: formParams.flat ? Number(formParams.flat) : undefined,
        phoneNumber: formParams.phoneNumber || undefined,
        page: newPagination.current - 1,
        size: newPagination.pageSize,
      });
    },
    [formParams, executeSearch],
  );

  return {
    // State
    formParams,
    tableData,
    loading: searchState.loading || searchByIdState.loading,
    error: searchState.error || searchByIdState.error,
    pagination,

    // Actions
    handleFormChange,
    handleSearch,
    handleIdSearch,
    handleReset,
    handleTableChange,
  };
};
