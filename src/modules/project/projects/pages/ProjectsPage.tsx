import { useState } from 'react';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card } from 'antd';
import type { TablePaginationConfig } from 'antd/es/table';

import { MessageModal } from '@/components/MessageModal/MessageModal';
import { ResponsiveTable } from '@/components/Table/Table';
import { useAuth } from '@/hooks/useAuth';

import { useProjects } from '../../../../hooks/useProjects';
import { createColumns } from '../components/columns';
import CreateProject from '../components/CreateProject';
import Filter from '../components/Filter';
import { useProjectSearchParams } from '../hooks/useSearch';
import { projectService } from '../services/project.service';
import type { Project, ProjectTableRow } from '../types/project.types';

export default function ProjectsPage() {
  const { searchData, setProjectSearchData } = useProjectSearchParams();
  const { hasRole } = useAuth();
  const [size, setSize] = useState(searchData.size);
  const [messageModalOpen, setMessageModalOpen] = useState(false);
  const [messageModalType, setMessageModalType] = useState<'success' | 'error'>(
    'success',
  );
  const [messageModalText, setMessageModalText] = useState('');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const { data, isLoading, refetch } = useProjects({
    ...searchData,
    page: searchData.page,
    size: size,
    sort: 'id,desc',
  });
  const queryClient = useQueryClient();

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: boolean }) =>
      projectService.updateProjectStatus(id, status),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['projects'] });
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
      const project = await projectService.getProjectById(id);
      setSelectedProject(project);
      setEditModalOpen(true);
    } catch (error) {
      const err = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const errMsg =
        err?.response?.data?.message ||
        err?.message ||
        'Failed to fetch project';
      setMessageModalType('error');
      setMessageModalText(errMsg);
      setMessageModalOpen(true);
    }
  };

  const handleEditClose = () => {
    setEditModalOpen(false);
    setSelectedProject(null);
  };

  const handleUpdateSuccess = () => {
    void refetch();
  };

  const projects: ProjectTableRow[] =
    data?.content.map((project: Project) => ({
      key: String(project.id),
      id: project.id ?? 0,
      name: project.name ?? '',
      description: project.description ?? '',
      projectTypeName: project.projectTypeName ?? '',
      status: project.status ? 'Active' : 'Disabled',
    })) || [];

  const pagination = {
    current: (data?.number || 0) + 1,
    pageSize: data?.size || 10,
    total: data?.totalElements || 0,
    showSizeChanger: true,
  };

  const handleTableChange = (pagination: TablePaginationConfig) => {
    setSize(pagination.pageSize ?? 10);
    setProjectSearchData({
      page: (pagination.current ?? 1) - 1,
    });
  };

  const handleCreateSuccess = () => {
    void refetch();
  };

  const columns = createColumns({
    handleEdit: (id: number) => void handleEdit(id),
    handleStatusChange,
    isGeneralManager: hasRole('GENERAL_MANAGER'),
  });

  return (
    <div className="flex gap-4 flex-col">
      <Card>
        <div className="flex gap-4 items-center justify-between">
          <Filter />
          <CreateProject
            onSuccess={handleCreateSuccess}
            editProject={selectedProject}
            editModalOpen={editModalOpen}
            onEditClose={handleEditClose}
            onUpdateSuccess={handleUpdateSuccess}
          />
        </div>
      </Card>
      <ResponsiveTable
        columns={columns}
        onChange={handleTableChange}
        dataSource={projects}
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
