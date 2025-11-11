'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { CheckOutlined, EditOutlined, StopOutlined } from '@ant-design/icons';
import { Card } from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import { firstValueFrom } from 'rxjs';

import { Button } from '@/components/Button';
import { Dropdown } from '@/components/Dropdown';
import { ThreeDotIcon } from '@/components/Icons/ThreeDotIcon';
import { Input } from '@/components/Input';
import { ResponsiveTable } from '@/components/Table/Table';
import { Tag } from '@/components/Tag';
import { Typography } from '@/components/Typography';
import { useDepartments } from '@/hooks/useDepartments';
import { departmentService } from '@/services/department.service';
import type { Department } from '@/types/department.types';

import type { AddDepartmentFormData } from '../AddDepartment';
import { AddDepartment } from '../AddDepartment';

interface DepartmentTableData extends Department {
  key: string;
}

export default function DepartmentsPage() {
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [isAddDepartmentModalOpen, setIsAddDepartmentModalOpen] =
    useState(false);
  const [editingDepartment, setEditingDepartment] =
    useState<DepartmentTableData | null>(null);
  const [searchValues, setSearchValues] = useState({
    name: '',
    description: '',
  });

  const {
    data: departmentsData,
    isLoading,
    error,
    refetch,
  } = useDepartments({ page, size: pageSize });

  const handleToggleDepartmentStatus = async (record: DepartmentTableData) => {
    try {
      const newStatus = !record.status;
      await firstValueFrom(
        departmentService.updateDepartmentStatus(record.id, newStatus),
      );
      void refetch();
    } catch (error) {
      console.error('Error updating department status:', error);
      alert('Failed to update department status. Please try again.');
    }
  };

  const handleEditDepartment = (record: DepartmentTableData) => {
    setEditingDepartment(record);
    setIsAddDepartmentModalOpen(true);
  };

  const getDropdownItems = (record: DepartmentTableData) => [
    {
      key: 'edit',
      label: 'Edit',
      icon: <EditOutlined />,
      onClick: () => handleEditDepartment(record),
    },
    {
      key: 'toggle',
      label: record.status ? 'Disable' : 'Enable',
      icon: record.status ? <StopOutlined /> : <CheckOutlined />,
      onClick: () => handleToggleDepartmentStatus(record),
      danger: record.status,
    },
  ];

  const columns: ColumnsType<DepartmentTableData> = [
    {
      title: 'NAME',
      dataIndex: 'name',
      key: 'name',
      width: '20%',
    },
    {
      title: 'DESCRIPTION',
      dataIndex: 'description',
      key: 'description',
      width: '25%',
    },
    {
      title: 'HEAD',
      dataIndex: 'departmentHeadName',
      key: 'departmentHeadName',
      width: '20%',
    },
    {
      title: 'BRANCHES',
      dataIndex: 'countOfBranches',
      key: 'countOfBranches',
      width: '15%',
      align: 'center',
      render: (count: number, record) => {
        if (count > 0) {
          return (
            <Button
              type="link"
              onClick={() =>
                router.push(`/departments/branches?departmentId=${record.id}`)
              }
              style={{ padding: 0 }}
            >
              <Typography variant="body2" as="span">
                {count}
              </Typography>
            </Button>
          );
        }
        return <Typography variant="body2">{count}</Typography>;
      },
    },
    {
      title: 'STATUS',
      dataIndex: 'status',
      key: 'status',
      width: '15%',
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
      width: '5%',
      render: (_, record) => (
        <Dropdown
          items={getDropdownItems(record)}
          trigger={
            <Button
              type="text"
              icon={<ThreeDotIcon />}
              style={{ padding: 0 }}
            />
          }
        />
      ),
    },
  ];

  const tableData: DepartmentTableData[] =
    departmentsData?.content?.map((dept) => ({
      ...dept,
      key: String(dept.id),
    })) || [];

  const handleTableChange = (pagination: TablePaginationConfig) => {
    setPage((pagination.current ?? 1) - 1);
    setPageSize(pagination.pageSize ?? 10);
  };

  const handleAddDepartment = () => {
    setIsAddDepartmentModalOpen(true);
  };

  const handleCloseAddDepartmentModal = () => {
    setIsAddDepartmentModalOpen(false);
    setEditingDepartment(null);
  };

  const handleSubmitAddDepartment = async (data: AddDepartmentFormData) => {
    try {
      const requestBody = {
        name: data.name,
        description: data.description,
        status: editingDepartment ? editingDepartment.status : true,
        departmentHead: {
          id: Number(data.departmentHeadId),
        },
      };

      if (editingDepartment) {
        await firstValueFrom(
          departmentService.updateDepartment(editingDepartment.id, requestBody),
        );
        alert('Department updated successfully!');
      } else {
        await firstValueFrom(departmentService.createDepartment(requestBody));
        alert('Department created successfully!');
      }
      handleCloseAddDepartmentModal();
      void refetch();
    } catch (error) {
      console.error(
        `Error ${editingDepartment ? 'updating' : 'creating'} department:`,
        error,
      );
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ||
        `Failed to ${editingDepartment ? 'update' : 'create'} department. Please try again.`;
      alert(errorMessage);
    }
  };

  const _handleReset = () => {
    setSearchValues({
      name: '',
      description: '',
    });
  };

  const pagination = {
    current: page + 1,
    pageSize: pageSize,
    total: departmentsData?.totalElements || 0,
    showSizeChanger: true,
  };

  if (error) {
    return (
      <Typography variant="body1" as="div">
        Error loading departments
      </Typography>
    );
  }

  return (
    <div className="flex gap-4 flex-col">
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
          <Button type="primary" onClick={handleAddDepartment}>
            + Add department
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

      <AddDepartment
        open={isAddDepartmentModalOpen}
        onClose={handleCloseAddDepartmentModal}
        onSubmit={(data) => {
          void handleSubmitAddDepartment(data);
        }}
        initialData={
          editingDepartment
            ? {
                name: editingDepartment.name,
                description: editingDepartment.description,
                departmentHeadId: String(editingDepartment.departmentHeadId),
              }
            : undefined
        }
        isEditMode={!!editingDepartment}
      />
    </div>
  );
}
