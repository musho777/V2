import { useState } from 'react';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card } from 'antd';
import type { TablePaginationConfig } from 'antd/es/table';

import { MessageModal } from '@/components/MessageModal/MessageModal';
import { ResponsiveTable } from '@/components/Table/Table';
import { useAuth } from '@/hooks/useAuth';

import { createColumns } from '../components/columns';
import CreateSubProject from '../components/CreateSubProject';
import Filter from '../components/Filter';
import { useSubProjectSearchParams } from '../hooks/useSearch';
import { useSubProjects } from '../hooks/useSubProjects';
import { subProjectService } from '../services/sub-project.service';
import type {
  SubProject,
  SubProjectTableRow,
} from '../types/sub-project.types';

export default function SubProjectsPage() {
  const { searchData, setSubProjectSearchData } = useSubProjectSearchParams();
  const { hasRole } = useAuth();
  const [size, setSize] = useState(10);
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [messageModalType, setMessageModalType] = useState<'success' | 'error'>(
    'success',
  );
  const [messageModalText, setMessageModalText] = useState('');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedSubProject, setSelectedSubProject] =
    useState<SubProject | null>(null);
  const { data, isLoading, refetch } = useSubProjects({
    ...searchData,
    page: searchData.page,
    size: size,
    sort: 'id,desc',
  });
  const queryClient = useQueryClient();

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: boolean }) =>
      subProjectService.updateSubProjectStatus(id, status),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['sub-projects'] });
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

  const handleEdit = async (id: number) => {
    try {
      const subProject = await subProjectService.getSubProjectById(id);
      setSelectedSubProject(subProject);
      setEditModalOpen(true);
    } catch (error) {
      const err = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const errMsg =
        err?.response?.data?.message ||
        err?.message ||
        'Failed to fetch subproject';
      setMessageModalType('error');
      setMessageModalText(errMsg);
      setMessageModalOpen(true);
    }
  };

  const handleEditClose = () => {
    setEditModalOpen(false);
    setSelectedSubProject(null);
  };

  const handleUpdateSuccess = () => {
    void refetch();
  };

  const subProjects: SubProjectTableRow[] =
    data?.content.map((subProject: SubProject) => ({
      key: String(subProject.id),
      id: subProject.id,
      name: subProject.name,
      description: subProject.description,
      subprojectType: subProject.subprojectType,
      status: subProject.status ? 'Active' : 'Disabled',
    })) || [];

  const pagination = {
    current: (data?.number || 0) + 1,
    pageSize: data?.size || 10,
    total: data?.totalElements || 0,
    showSizeChanger: true,
  };

  const handleTableChange = (pagination: TablePaginationConfig) => {
    setSize(pagination.pageSize ?? 10);
    setSubProjectSearchData({
      page: (pagination.current ?? 1) - 1,
    });
  };

  const handleCreateSuccess = () => {
    void refetch();
  };

  const columns = createColumns({
    handleEdit: (id: number) => {
      void handleEdit(id);
    },
    handleStatusChange,
    isGeneralManager: hasRole('GENERAL_MANAGER'),
  });

  return (
    <div className="flex gap-4 flex-col">
      <Card>
        <div className="flex gap-4 items-center justify-between">
          <Filter />
          <CreateSubProject
            onSuccess={handleCreateSuccess}
            editSubProject={selectedSubProject}
            editModalOpen={editModalOpen}
            onEditClose={handleEditClose}
            onUpdateSuccess={handleUpdateSuccess}
          />
        </div>
      </Card>
      <ResponsiveTable
        columns={columns}
        onChange={handleTableChange}
        dataSource={subProjects}
        loading={isLoading}
        pagination={pagination}
        mobileColumnsCount={4}
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
