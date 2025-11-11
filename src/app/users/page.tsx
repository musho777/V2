'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { CheckOutlined, EyeOutlined, StopOutlined } from '@ant-design/icons';
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
import { OCCUPATION_COLOR, ROLE_COLORS } from '@/constants/constants';
import { useCommissions } from '@/hooks/useCommissions';
import { useHolidays } from '@/hooks/useHolidays';
import { useOccupations } from '@/hooks/useOccupations';
import { useOfficeLocations } from '@/hooks/useOfficeLocations';
import { useRoles } from '@/hooks/useRoles';
import { useTimezones } from '@/hooks/useTimezones';
import { useUsers } from '@/hooks/useUsers';
import { useUserStatuses } from '@/hooks/useUserStatuses';
import { userService } from '@/services/user.service';
import type { CreateUserRequest, User } from '@/types/user.types';

import type { AddNewUserFormData } from './AddNewUser';
import { AddNewUser } from './AddNewUser';

interface UserTableData extends User {
  key: string;
}

export default function UserManagementPage() {
  const router = useRouter();
  const [_activeTab, _setActiveTab] = useState<'grid' | 'list'>('list');
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [shouldFetchStatuses, setShouldFetchStatuses] = useState(false);
  const [shouldFetchRoles, setShouldFetchRoles] = useState(false);
  const [shouldFetchOccupations, setShouldFetchOccupations] = useState(false);
  const [shouldFetchTimezones, setShouldFetchTimezones] = useState(false);
  const [shouldFetchHolidays, setShouldFetchHolidays] = useState(false);
  const [shouldFetchOfficeLocations, setShouldFetchOfficeLocations] =
    useState(false);
  const [shouldFetchCommissions, setShouldFetchCommissions] = useState(false);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [searchValues, setSearchValues] = useState({
    name: '',
    surname: '',
    email: '',
    phoneNumber: '',
  });

  const {
    data: usersData,
    isLoading,
    error,
  } = useUsers({ page, size: pageSize });
  const { data: statusesData } = useUserStatuses(shouldFetchStatuses);
  const { data: rolesData } = useRoles(shouldFetchRoles);
  const { data: occupationsData } = useOccupations(shouldFetchOccupations);
  const { data: timezonesData } = useTimezones(shouldFetchTimezones);
  const { data: holidaysData } = useHolidays(shouldFetchHolidays);
  const { data: officeLocationsData } = useOfficeLocations(
    shouldFetchOfficeLocations,
  );
  const { data: commissionsData } = useCommissions(shouldFetchCommissions);

  // Transform statuses from API to Select options format
  const _statusOptions =
    statusesData?.map((item) => ({
      value: item.status.toLowerCase(),
      label: item.status,
    })) || [];

  // Transform roles from API to Select options format
  const rolesOptions =
    rolesData?.map((item) => ({
      value: String(item.id),
      label: item.name,
    })) || [];

  // Transform occupations from API to Select options format
  const occupationOptions =
    occupationsData?.map((item) => ({
      value: String(item.id),
      label: item.name,
    })) || [];

  // Transform timezones from API to Select options format
  const timezoneOptions =
    timezonesData?.map((item) => ({
      value: String(item.id),
      label: item.name,
    })) || [];

  // Transform holidays from API to Select options format
  const holidayOptions =
    holidaysData?.map((item) => ({
      value: String(item.id),
      label: item.name,
    })) || [];

  // Transform office locations from API to Select options format
  const officeLocationOptions =
    officeLocationsData?.map((item) => ({
      value: String(item.id),
      label: item.name,
    })) || [];

  // Transform commissions from API to Select options format
  const commissionOptions =
    commissionsData?.map((item) => ({
      value: String(item.id),
      label: item.name,
    })) || [];

  // Handler to fetch statuses when dropdown opens
  const _handleStatusDropdownOpen = () => {
    if (!shouldFetchStatuses) {
      setShouldFetchStatuses(true);
    }
  };

  // Handler to fetch roles when dropdown opens
  const handleRolesDropdownOpen = () => {
    if (!shouldFetchRoles) {
      setShouldFetchRoles(true);
    }
  };

  // Handler to fetch occupations when dropdown opens
  const handleOccupationDropdownOpen = () => {
    if (!shouldFetchOccupations) {
      setShouldFetchOccupations(true);
    }
  };

  // Handler to fetch timezones when dropdown opens
  const handleTimezoneDropdownOpen = () => {
    if (!shouldFetchTimezones) {
      setShouldFetchTimezones(true);
    }
  };

  // Handler to fetch holidays when dropdown opens
  const handleHolidaysDropdownOpen = () => {
    if (!shouldFetchHolidays) {
      setShouldFetchHolidays(true);
    }
  };

  // Handler to fetch office locations when dropdown opens
  const handleOfficeLocationDropdownOpen = () => {
    if (!shouldFetchOfficeLocations) {
      setShouldFetchOfficeLocations(true);
    }
  };

  // Handler to fetch commissions when dropdown opens
  const handleCommissionsDropdownOpen = () => {
    if (!shouldFetchCommissions) {
      setShouldFetchCommissions(true);
    }
  };

  const handleAddUser = () => {
    setIsAddUserModalOpen(true);
  };

  const handleCloseAddUserModal = () => {
    setIsAddUserModalOpen(false);
  };

  const handleSubmitAddUser = async (data: AddNewUserFormData) => {
    try {
      // Validate required fields
      if (
        !data.roleId ||
        !data.occupationId ||
        !data.timeZone ||
        !data.holidays ||
        !data.officeLocation ||
        !data.commissions
      ) {
        alert('Please fill in all required fields');
        return;
      }

      // Find the selected role name from rolesOptions
      const selectedRole = rolesData?.find(
        (role) => String(role.id) === data.roleId,
      );
      const selectedTimezone = timezonesData?.find(
        (tz) => String(tz.id) === data.timeZone,
      );

      // Construct proper email verification URL
      const emailVerifyUrl = `${window.location.origin}/register`;

      // Format the request body according to API requirements
      const requestBody: CreateUserRequest = {
        firstName: data.firstName,
        lastName: data.surname,
        privilege: {
          id: 1,
        },
        role: {
          id: Number(data.roleId),
          role: selectedRole?.name || '',
          default: true,
        },
        email: data.email,
        phoneNumber: data.phoneNumber,
        occupation: {
          id: Number(data.occupationId),
        },
        commission: {
          id: Number(data.commissions),
        },
        calendarOfHolidays: {
          id: Number(data.holidays),
        },
        officeLocation: {
          id: Number(data.officeLocation),
        },
        timezone: {
          id: Number(data.timeZone),
          name: selectedTimezone?.name || '',
        },
        emailVerifyUrl: emailVerifyUrl,
      };

      // Call the API to create user - convert Observable to Promise
      await firstValueFrom(userService.createUser(requestBody));

      alert('User invited successfully!');
      handleCloseAddUserModal();
    } catch (error) {
      console.error('Error creating user:', error);
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message || 'Failed to invite user. Please try again.';
      alert(errorMessage);
    }
  };

  const _handleReset = () => {
    setSearchValues({
      name: '',
      surname: '',
      email: '',
      phoneNumber: '',
    });
  };

  const getDropdownItems = (record: UserTableData) => {
    const items = [];

    // Show View if accessToRead is true
    if (record.accessToRead) {
      items.push({
        key: 'view',
        label: 'View',
        icon: <EyeOutlined />,
        onClick: () => {
          // Store user permission in sessionStorage for the profile page
          sessionStorage.setItem(
            `user_${record.id}_permissions`,
            JSON.stringify({
              accessToAction: record.accessToAction,
              accessToRead: record.accessToRead,
            }),
          );
          router.push(`/users/${record.id}/profile`);
        },
      });
    }

    // Show Enable/Disable if accessToAction is true
    if (record.accessToAction) {
      items.push({
        key: 'toggle',
        label: record.status === 'Active' ? 'Disable' : 'Enable',
        icon: record.status === 'Active' ? <StopOutlined /> : <CheckOutlined />,
        onClick: () => {
          /* Toggle status */
        },
        danger: record.status === 'Active',
      });
    }

    return items;
  };

  // Check if user should show dropdown (has any access)
  const shouldShowDropdown = (record: UserTableData) => {
    return record.accessToAction || record.accessToRead;
  };

  const columns: ColumnsType<UserTableData> = [
    {
      title: 'NAME',
      dataIndex: 'firstName',
      key: 'firstName',
    },
    {
      title: 'SURNAME',
      dataIndex: 'lastName',
      key: 'lastName',
    },
    {
      title: 'EMAIL',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'PHONE NUMBER',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',
    },
    {
      title: 'ROLE',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => {
        const tagType = ROLE_COLORS[role] || 'default';
        return (
          <Tag tagType={tagType}>
            <Typography variant="body3" as="span">
              {role}
            </Typography>
          </Tag>
        );
      },
    },
    {
      title: 'OCCUPATION',
      dataIndex: 'occupation',
      key: 'occupation',
      render: (occupation: string | null) =>
        occupation ? (
          <Tag tagType={OCCUPATION_COLOR}>
            <Typography variant="body3" as="span">
              {occupation}
            </Typography>
          </Tag>
        ) : (
          <Typography variant="body2">-</Typography>
        ),
    },
    {
      title: 'STATUS',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const getTagType = (statusValue: string) => {
          const statusLower = statusValue.toLowerCase();
          if (statusLower === 'active') return 'active';
          if (statusLower === 'pending') return 'pending';
          return 'inactive';
        };

        return (
          <Tag tagType={getTagType(status)}>
            <Typography variant="body3" as="span">
              {status}
            </Typography>
          </Tag>
        );
      },
    },
    {
      title: '',
      key: 'action',
      width: 50,
      render: (_, record) => {
        if (!shouldShowDropdown(record)) {
          return null;
        }

        return (
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
        );
      },
    },
  ];

  // Transform API data to table data
  const tableData: UserTableData[] =
    usersData?.content?.map((user) => ({
      ...user,
      key: String(user.id),
    })) || [];

  const handleTableChange = (pagination: TablePaginationConfig) => {
    setPage((pagination.current ?? 1) - 1);
    setPageSize(pagination.pageSize ?? 10);
  };

  const pagination = {
    current: page + 1,
    pageSize: pageSize,
    total: usersData?.totalElements || 0,
    showSizeChanger: true,
  };

  return (
    <div className="flex gap-4 flex-col">
      <Card>
        <div className="flex gap-4 items-center justify-between">
          <div className="flex gap-4 items-center flex-1 flex-wrap">
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
              placeholder="Search by surname"
              value={searchValues.surname}
              onChange={(e) =>
                setSearchValues({ ...searchValues, surname: e.target.value })
              }
            />
            <Input
              height={38}
              placeholder="Search by email"
              value={searchValues.email}
              onChange={(e) =>
                setSearchValues({ ...searchValues, email: e.target.value })
              }
            />
            <Input
              height={38}
              placeholder="Search by phone"
              value={searchValues.phoneNumber}
              onChange={(e) =>
                setSearchValues({
                  ...searchValues,
                  phoneNumber: e.target.value,
                })
              }
            />
          </div>
          <Button type="primary" onClick={handleAddUser}>
            + Add new user
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
        {error && (
          <Typography variant="body1" style={{ marginTop: 16, color: 'red' }}>
            Error loading users:{' '}
            {error instanceof Error ? error.message : 'Unknown error'}
          </Typography>
        )}
      </Card>

      <AddNewUser
        open={isAddUserModalOpen}
        onClose={handleCloseAddUserModal}
        onSubmit={(data) => {
          void handleSubmitAddUser(data);
        }}
        rolesOptions={rolesOptions}
        occupationOptions={occupationOptions}
        timeZoneOptions={timezoneOptions}
        holidaysOptions={holidayOptions}
        officeLocationOptions={officeLocationOptions}
        commissionsOptions={commissionOptions}
        onRolesDropdownOpen={handleRolesDropdownOpen}
        onOccupationDropdownOpen={handleOccupationDropdownOpen}
        onTimezoneDropdownOpen={handleTimezoneDropdownOpen}
        onHolidaysDropdownOpen={handleHolidaysDropdownOpen}
        onOfficeLocationDropdownOpen={handleOfficeLocationDropdownOpen}
        onCommissionsDropdownOpen={handleCommissionsDropdownOpen}
      />
    </div>
  );
}
