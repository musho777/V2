'use client';

import { useCallback, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { Card } from 'antd';
import type { TablePaginationConfig } from 'antd/es/table';

import { ResponsiveTable } from '@/components/Table/Table';

import Filter from '../components/Filter';
import { useTicketColumns } from '../components/useTicketColumns';
import { useTickets } from '../hooks/useTickets';
import { useTicketSearchParams } from '../hooks/useTicketSearch';
import type { Ticket } from '../types/ticket.types';

export default function TicketsPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string | undefined;
  const { searchData, setTicketSearchData } = useTicketSearchParams();
  const [size, setSize] = useState(searchData.size);
  const { data, isLoading } = useTickets({
    projectId: projectId ? Number(projectId) : undefined,
    page: searchData.page,
    size: size,
    title: searchData.title,
    status: searchData.status,
    priority: searchData.priority,
    assignmentFilter: searchData.assignmentFilter,
    search: searchData.search,
    id: searchData.id,
    projectIds: searchData.projectIds,
    trackerIds: searchData.trackerIds,
    statusIds: searchData.statusIds,
    priorityIds: searchData.priorityIds,
    subprojectIds: searchData.subprojectIds,
    assigneeUserIds: searchData.assigneeUserIds,
    createdByIds: searchData.createdByIds,
    createdDateFrom: searchData.createdDateFrom,
    createdDateTo: searchData.createdDateTo,
    sort: 'id,desc',
  });
  const handleNavigateSingleTicket = useCallback(
    (uuid: string) => {
      router.push(`/project-management/tickets/${uuid}`);
    },
    [router],
  );

  const handleNavigateEdit = useCallback(
    (uuid: string) => {
      router.push(`/project-management/tickets/${uuid}/edit`);
    },
    [router],
  );

  const columns = useTicketColumns({
    onNavigateSingleTicket: handleNavigateSingleTicket,
    onNavigateEdit: handleNavigateEdit,
  });

  const pagination = {
    current: (data?.number || 0) + 1,
    pageSize: data?.size || 10,
    total: data?.totalElements || 0,
    showSizeChanger: true,
    showTotal: (total: number) => `Total ${total} tickets`,
  };

  const handleTableChange = (pagination: TablePaginationConfig) => {
    setSize(pagination.pageSize ?? 10);
    setTicketSearchData({
      page: (pagination.current ?? 1) - 1,
    });
  };

  return (
    <div className="flex gap-4 flex-col">
      <Card>
        <Filter />
      </Card>
      <ResponsiveTable<Ticket>
        columns={columns}
        dataSource={data?.content || []}
        loading={isLoading}
        pagination={pagination}
        onChange={handleTableChange}
        rowKey={(record) => record.id}
      />
    </div>
  );
}
