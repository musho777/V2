'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { CheckOutlined, EditOutlined, StopOutlined } from '@ant-design/icons';
import { Card } from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { firstValueFrom } from 'rxjs';

import { Button } from '@/components/Button';
import { Dropdown } from '@/components/Dropdown';
import { ThreeDotIcon } from '@/components/Icons/ThreeDotIcon';
import { Input } from '@/components/Input';
import { ResponsiveTable } from '@/components/Table';
import { Tag } from '@/components/Tag';
import { Typography } from '@/components/Typography';
import { useAuth } from '@/hooks/useAuth';
import { useBranches } from '@/hooks/useBranches';
import { useDepartments } from '@/hooks/useDepartments';
import { branchService } from '@/services/branch.service';
import type { Branch } from '@/types/branch.types';

import type { AddBranchFormData } from '../../branches/AddBranch';
import { AddBranch } from '../../branches/AddBranch';

interface BranchTableData extends Branch {
  key: string;
}

export default function DepartmentBranchesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const departmentId = searchParams.get('departmentId');

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [isAddBranchModalOpen, setIsAddBranchModalOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<BranchTableData | null>(
    null,
  );
  const [searchValues, setSearchValues] = useState({
    name: '',
    description: '',
  });

  const { user } = useAuth();

  // Redirect if no departmentId
  useEffect(() => {
    if (!departmentId) {
      router.push('/departments');
    }
  }, [departmentId, router]);

  const {
    data: branchesData,
    isLoading,
    refetch,
  } = useBranches({
    page,
    size: pageSize,
    departmentId: departmentId ? Number(departmentId) : undefined,
  });

  // Fetch department name
  const { data: departmentsData } = useDepartments({
    page: 0,
    size: 100,
  });

  const department = departmentsData?.content?.find(
    (dept) => dept.id === Number(departmentId),
  );

  const handleAddBranch = () => {
    setIsAddBranchModalOpen(true);
  };

  const handleCloseAddBranchModal = () => {
    setIsAddBranchModalOpen(false);
    setEditingBranch(null);
  };

  const handleSubmitAddBranch = async (data: AddBranchFormData) => {
    try {
      if (!user?.userId) {
        alert('User not authenticated. Please log in again.');
        return;
      }

      const requestBody = {
        name: data.name,
        description: data.description,
        status: editingBranch ? editingBranch.status : true,
        department: {
          id: Number(data.departmentId),
          departmentHead: {
            id: user.userId,
          },
        },
        branchHead: {
          id: Number(data.branchHeadId),
          role: {
            id: Number(data.branchHeadRoleId),
            role: 'BRANCH_HEAD',
          },
        },
        regions: [
          {
            id: Number(data.regionId),
          },
        ],
      };

      if (editingBranch) {
        await firstValueFrom(
          branchService.updateBranch(editingBranch.id, requestBody),
        );
        alert('Branch updated successfully!');
      } else {
        await firstValueFrom(branchService.createBranch(requestBody));
        alert('Branch created successfully!');
      }
      handleCloseAddBranchModal();
      void refetch();
    } catch (_error) {
      const errorMessage =
        (_error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ||
        `Failed to ${editingBranch ? 'update' : 'create'} branch. Please try again.`;
      alert(errorMessage);
    }
  };

  const handleEditBranch = (record: BranchTableData) => {
    setEditingBranch(record);
    setIsAddBranchModalOpen(true);
  };

  const handleToggleBranchStatus = async (record: BranchTableData) => {
    try {
      await firstValueFrom(
        branchService.updateBranchStatus(record.id, !record.status),
      );
      alert(`Branch ${record.status ? 'disabled' : 'enabled'} successfully!`);
      void refetch();
    } catch (_error) {
      alert('Failed to update branch status. Please try again.');
    }
  };

  const getDropdownItems = (record: BranchTableData) => [
    {
      key: 'edit',
      label: 'Edit',
      icon: <EditOutlined />,
      onClick: () => handleEditBranch(record),
    },
    {
      key: 'toggle',
      label: record.status ? 'Disable' : 'Enable',
      icon: record.status ? <StopOutlined /> : <CheckOutlined />,
      onClick: () => handleToggleBranchStatus(record),
      danger: record.status,
    },
  ];

  const columns: ColumnsType<BranchTableData> = [
    {
      title: 'NAME',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'DESCRIPTION',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'HEAD',
      dataIndex: 'branchHeadName',
      key: 'branchHeadName',
    },
    {
      title: 'REGIONS',
      dataIndex: 'countOfRegions',
      key: 'countOfRegions',
      align: 'center',
    },
    {
      title: 'TEAMS',
      dataIndex: 'countOfTeams',
      key: 'countOfTeams',
      align: 'center',
    },
    {
      title: 'STATUS',
      dataIndex: 'status',
      key: 'status',
      render: (status: boolean) => (
        <Tag tagType={status ? 'active' : 'inactive'}>
          <Typography variant="body3" as="span">
            {status ? 'Active' : 'Inactive'}
          </Typography>
        </Tag>
      ),
    },
    {
      title: '',
      key: 'action',
      width: 50,
      render: (_, record) => (
        <Dropdown
          items={getDropdownItems(record)}
          trigger={
            <button
              type="button"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              <ThreeDotIcon />
            </button>
          }
        />
      ),
    },
  ];

  const tableData: BranchTableData[] =
    branchesData?.content?.map((branch) => ({
      ...branch,
      key: String(branch.id),
    })) || [];

  const handleTableChange = (pagination: TablePaginationConfig) => {
    setPage((pagination.current ?? 1) - 1);
    setPageSize(pagination.pageSize ?? 10);
  };

  const pagination = {
    current: page + 1,
    pageSize: pageSize,
    total: branchesData?.totalElements || 0,
    showSizeChanger: true,
  };

  if (!departmentId) {
    return null;
  }

  return (
    <div className="flex gap-4 flex-col">
      <Card>
        <div className="flex gap-4 items-center justify-between">
          <div className="flex gap-4 items-center flex-1">
            <Button
              type="default"
              onClick={() => router.push('/departments')}
              style={{ marginRight: '8px' }}
            >
              ← Back to Departments
            </Button>
            {department && (
              <Typography variant="heading3" style={{ margin: 0 }}>
                {department.name} - Branches
              </Typography>
            )}
          </div>
        </div>
      </Card>
      <Card>
        <div className="flex gap-4 items-center justify-between">
          <div className="flex gap-4 items-center flex-1">
            <Input
              height={38}
              placeholder="Search by name"
              value={searchValues.name}
              onChange={(e) =>
                setSearchValues({ ...searchValues, name: e.target.value })
              }
            />
            <Input
              height={38}
              placeholder="Search by description"
              value={searchValues.description}
              onChange={(e) =>
                setSearchValues({
                  ...searchValues,
                  description: e.target.value,
                })
              }
            />
          </div>
          <Button type="primary" onClick={handleAddBranch}>
            + Add branch
          </Button>
        </div>
      </Card>
      <Card>
        <ResponsiveTable
          columns={columns}
          dataSource={tableData}
          loading={isLoading}
          pagination={pagination}
          onChange={handleTableChange}
          mobileColumnsCount={2}
        />
      </Card>

      <AddBranch
        open={isAddBranchModalOpen}
        onClose={handleCloseAddBranchModal}
        onSubmit={(data) => void handleSubmitAddBranch(data)}
        initialData={
          editingBranch
            ? {
                name: editingBranch.name,
                description: editingBranch.description,
                branchHeadId: String(editingBranch.branchHeadId),
                branchHeadRoleId: '5',
                departmentId: editingBranch.departmentId
                  ? String(editingBranch.departmentId)
                  : departmentId || '',
                regionId:
                  editingBranch.regionIds && editingBranch.regionIds.length > 0
                    ? String(editingBranch.regionIds[0])
                    : '',
              }
            : {
                name: '',
                description: '',
                branchHeadId: '',
                branchHeadRoleId: '5',
                departmentId: departmentId || '',
                regionId: '',
              }
        }
        isEditMode={!!editingBranch}
      />
    </div>
  );
}
