import { useState } from 'react';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card } from 'antd';
import type { TablePaginationConfig } from 'antd/es/table';

import { MessageModal } from '@/components/MessageModal/MessageModal';
import { ResponsiveTable } from '@/components/Table/Table';
import { useAuth } from '@/hooks/useAuth';

import { createColumns } from '../components/columns';
import CreateEditProjectType from '../components/CreateEditProjectType';
import Filter from '../components/Filter';
import { useProjectTypes } from '../hooks/useProjectTypes';
import { projectTypeService } from '../services/project-type.service';
import type {
  ProjectType,
  ProjectTypeFilters,
  ProjectTypeTableRow,
} from '../types/project-type.types';

export default function ProjectTypesPage() {
  const { hasRole } = useAuth();
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [filters, setFilters] = useState<ProjectTypeFilters>({});
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [messageModalType, setMessageModalType] = useState<'success' | 'error'>(
    'success',
  );
  const [messageModalText, setMessageModalText] = useState('');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedProjectType, setSelectedProjectType] =
    useState<ProjectType | null>(null);
  const { data, isLoading, refetch } = useProjectTypes({
    page,
    size,
    ...filters,
  });
  const queryClient = useQueryClient();

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: boolean }) =>
      projectTypeService.updateProjectTypeStatus(id, status),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['project-types'] });
      setMessageModalType('success');
      setMessageModalText('Status updated successfully');
      setMessageModalOpen(true);
    },
    onError: (error: unknown) => {
      const err = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const errMsg =
        err?.response?.data?.message ||
        err?.message ||
        'Failed to update status';
      setMessageModalType('error');
      setMessageModalText(errMsg);
      setMessageModalOpen(true);
    },
  });

  const handleStatusChange = (id: number, status: boolean) => {
    statusMutation.mutate({ id, status });
  };

  const handleEdit = (id: number) => {
    const projectType = data?.content.find((pt) => pt.id === id);
    if (projectType) {
      setSelectedProjectType(projectType);
      setEditModalOpen(true);
    }
  };

  const handleEditClose = () => {
    setEditModalOpen(false);
    setSelectedProjectType(null);
  };

  const handleUpdateSuccess = () => {
    void refetch();
  };

  const columns = createColumns({
    handleStatusChange,
    handleEdit,
    isGeneralManager: hasRole('GENERAL_MANAGER'),
  });

  const projectTypes: ProjectTypeTableRow[] =
    data?.content.map((projectType: ProjectType) => ({
      key: String(projectType.id),
      name: projectType.name,
      description: projectType.description,
      status: projectType.status ? 'Active' : 'Disabled',
      id: projectType.id,
    })) || [];

  const pagination = {
    current: (data?.number || 0) + 1,
    pageSize: data?.size || 10,
    total: data?.totalElements || 0,
    showSizeChanger: true,
  };

  const handleTableChange = (pagination: TablePaginationConfig) => {
    setPage((pagination.current ?? 1) - 1);
    setSize(pagination.pageSize ?? 10);
  };

  const handleFilterChange = (newFilters: ProjectTypeFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPage(0);
  };

  const handleReset = () => {
    setFilters({});
    setPage(0);
  };

  return (
    <div className="flex gap-4 flex-col">
      <Card>
        <div className="flex gap-4 items-center justify-between">
          <Filter onFilterChange={handleFilterChange} onReset={handleReset} />
          <CreateEditProjectType
            editProjectType={selectedProjectType}
            editModalOpen={editModalOpen}
            onEditClose={handleEditClose}
            onSuccess={handleUpdateSuccess}
          />
        </div>
      </Card>
      <ResponsiveTable
        columns={columns}
        onChange={handleTableChange}
        dataSource={projectTypes}
        loading={isLoading}
        pagination={pagination}
        mobileColumnsCount={3}
      />
      <MessageModal
        open={messageModalOpen}
        type={messageModalType}
        message={messageModalText}
        onSubmit={() => setMessageModalOpen(false)}
        onCancel={() => setMessageModalOpen(false)}
      />
    </div>
  );
}
