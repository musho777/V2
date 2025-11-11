import { useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import type { Customer } from '../services/customer.service';
import { customerService } from '../services/customer.service';
import type {
  PaginationState,
  SearchFormParams,
  SearchParams,
} from '../types/search.types';

export const useSearchClient = () => {
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
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<PaginationState>({
    current: 1,
    pageSize: 10,
    total: 0,
  });

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
    performSearch({
      name: name || undefined,
      streetId: streetId ? Number(streetId) : undefined,
      buildingId: buildingId ? Number(buildingId) : undefined,
      flat: flat ? Number(flat) : undefined,
      phoneNumber: phoneNumber || undefined,
      page: 0,
      size: 10,
    });
  }, [searchParamsUrl]);

  const performSearch = useCallback(async (params: SearchParams) => {
    try {
      setLoading(true);
      const response = await customerService.search({
        ...params,
        page: params.page ?? 0,
        size: params.size ?? 10,
      });

      setTableData(response.content);
      setPagination({
        current: response.number + 1,
        pageSize: response.size,
        total: response.totalElements,
      });
    } catch (error) {
      console.error('Failed to search customers:', error);
      setTableData([]);
    } finally {
      setLoading(false);
    }
  }, []);

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

  const handleIdSearch = useCallback(async () => {
    if (!formParams.id.trim()) {
      return;
    }

    try {
      setLoading(true);
      const customer = await customerService.searchById(Number(formParams.id));
      setTableData([customer]);
      setPagination({
        current: 1,
        pageSize: 10,
        total: 1,
      });
    } catch (error) {
      console.error('Failed to search customer by ID:', error);
      setTableData([]);
      setPagination({
        current: 1,
        pageSize: 10,
        total: 0,
      });
    } finally {
      setLoading(false);
    }
  }, [formParams.id]);

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
      performSearch({
        name: formParams.name || undefined,
        streetId: formParams.streetId || undefined,
        buildingId: formParams.buildingId || undefined,
        flat: formParams.flat ? Number(formParams.flat) : undefined,
        phoneNumber: formParams.phoneNumber || undefined,
        page: newPagination.current - 1,
        size: newPagination.pageSize,
      });
    },
    [formParams, performSearch],
  );

  return {
    // State
    formParams,
    tableData,
    loading,
    pagination,

    // Actions
    handleFormChange,
    handleSearch,
    handleIdSearch,
    handleReset,
    handleTableChange,
    performSearch,
  };
};
