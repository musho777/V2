'use client';

import { useState } from 'react';

import { Card } from 'antd';
import type { TablePaginationConfig } from 'antd/es/table';

import { ResponsiveTable } from '@/components/Table/Table';
import { useAuth } from '@/hooks/useAuth';
import { useSubTeams, useTeamStatusMutation } from '@/hooks/useSubTeams';

import { getColumns } from '../components/columns';
import CreateTeam from '../components/CreateTeam';
import Filter from '../components/Filter';
import { useTeamSearchParams } from '../hooks/useSearch';
import type { Team, TeamTableRow } from '../types/team.types';

export default function TeamsPage() {
  const { searchData, setTeamSearchData } = useTeamSearchParams();
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { hasRole } = useAuth();
  const [size, setSize] = useState(10);
  const statusMutation = useTeamStatusMutation();

  const { data, isLoading } = useSubTeams({
    ...searchData,
    page: searchData.page,
    size: size,
    sort: 'id,desc',
  });

  const teams: TeamTableRow[] =
    data?.content.map((team: Team) => ({
      key: String(team.id),
      name: team.name,
      description: team.description,
      branchHeadName: team.branchHeadName,
      status: team.status ? 'Active' : 'Disabled',
    })) || [];

  const pagination = {
    current: (data?.number || 0) + 1,
    pageSize: data?.size || 10,
    total: data?.totalElements || 0,
    showSizeChanger: true,
  };

  const handleTableChange = (pagination: TablePaginationConfig) => {
    setTeamSearchData({
      page: (pagination.current ?? 1) - 1,
    });
    setSize(pagination.pageSize ?? 10);
  };

  const handleEdit = (teamId: string) => {
    setSelectedTeamId(teamId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTeamId(null);
  };

  const handleStatusChange = (teamId: number, status: boolean) => {
    statusMutation.mutate({ id: teamId, status });
  };

  const columns = getColumns({
    onEdit: handleEdit,
    onStatusChange: handleStatusChange,
    isGeneralManager: hasRole('GENERAL_MANAGER'),
  });

  return (
    <div className="flex gap-4 flex-col">
      <Card>
        <Filter />
      </Card>
      <ResponsiveTable
        columns={columns}
        onChange={handleTableChange}
        dataSource={teams}
        loading={isLoading}
        pagination={pagination}
        mobileColumnsCount={2}
      />
      <CreateTeam
        mode="edit"
        teamId={selectedTeamId}
        open={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}
