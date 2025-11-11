'use client';

import { useEffect, useState } from 'react';

import { Card } from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import type { SorterResult } from 'antd/es/table/interface';
import { format } from 'date-fns';

import { ResetIcon } from '@/components/Icons/ResetIcon';
import { Input } from '@/components/Input';
import { ResponsiveTable } from '@/components/Table';
import { Typography } from '@/components/Typography';
import { useArchivedUsers } from '@/hooks/useArchive';
import useDebounce from '@/hooks/useDebounce';
import type { ArchivedUser } from '@/types/archive.types';

import { useArchiveUserSearchParams } from '../hooks/useSearch';

interface UserTableData extends ArchivedUser {
  key: string;
}

export default function ArchivedUsersPage() {
  const { searchData, setSearchData, resetSearchData } =
    useArchiveUserSearchParams();
  const [searchName, setSearchName] = useState(searchData.search || '');
  const [first, setFirst] = useState(false);

  const debouncedName = useDebounce(searchName, 500);

  const { data: usersData, isLoading } = useArchivedUsers({
    ...searchData,
  });

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFirst(true);
    setSearchName(e.target.value);
  };

  const handleReset = () => {
    setSearchName('');
    resetSearchData();
  };

  useEffect(() => {
    if (first) setSearchData({ search: debouncedName });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedName]);

  const columns: ColumnsType<UserTableData> = [
    {
      title: 'NAME',
      dataIndex: 'name',
      key: 'name',
      width: '33%',
      sorter: true,
    },
    {
      title: 'ARCHIVED BY',
      dataIndex: 'archivedBy',
      key: 'archivedBy',
      width: '33%',
      sorter: true,
    },
    {
      title: 'ARCHIVED DATE',
      dataIndex: 'archivedDate',
      key: 'archivedDate',
      width: '34%',
      sorter: true,
      render: (date: string, record) => {
        try {
          return (
            <Typography variant="body2">
              {format(new Date(record.archivedAt), 'MMM dd, yyyy HH:mm')}
            </Typography>
          );
        } catch {
          return <Typography variant="body2">{date || 'N/A'}</Typography>;
        }
      },
    },
  ];

  const tableData: UserTableData[] =
    usersData?.content?.map((user) => ({
      ...user,
      key: String(user.id),
    })) || [];

  const handleTableChange = (
    pagination: TablePaginationConfig,
    _filters: Record<string, unknown>,
    sorter: SorterResult<UserTableData> | SorterResult<UserTableData>[],
  ) => {
    const updates: {
      page?: number;
      size?: number;
      sort?: string[];
    } = {};

    if (pagination.current !== undefined) {
      updates.page = pagination.current - 1;
    }

    if (pagination.pageSize !== undefined) {
      updates.size = pagination.pageSize;
    }

    if (!Array.isArray(sorter) && sorter.field) {
      const order =
        sorter.order === 'ascend'
          ? 'asc'
          : sorter.order === 'descend'
            ? 'desc'
            : undefined;
      if (order) {
        updates.sort = [`${sorter.field as string},${order}`];
      }
    }

    setSearchData(updates);
  };

  const pagination = {
    current: searchData.page + 1,
    pageSize: searchData.size,
    total: usersData?.totalElements || 0,
    showSizeChanger: true,
  };

  return (
    <div className="flex gap-4 flex-col">
      <Card>
        <div className="flex gap-4 items-center">
          <Input
            height={38}
            placeholder="Search by name"
            value={searchName}
            onChange={handleNameChange}
          />
          <div onClick={handleReset} className="cursor-pointer">
            <ResetIcon />
          </div>
        </div>
      </Card>
      <ResponsiveTable
        columns={columns}
        dataSource={tableData}
        loading={isLoading}
        pagination={pagination}
        onChange={handleTableChange}
        mobileColumnsCount={2}
      />
    </div>
  );
}
