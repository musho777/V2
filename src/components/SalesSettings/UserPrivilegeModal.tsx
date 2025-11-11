'use client';

import React, { useState } from 'react';

import { Input } from '@/components/Input';
import { Modal } from '@/components/Modal/Modal';
import { Select } from '@/components/Select/Select';

export interface UserPrivilegeModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { userName: string; role: string }) => void;
  loading?: boolean;
  mode?: 'create' | 'edit';
  initialData?: { userName: string; role: string };
}

export const UserPrivilegeModal: React.FC<UserPrivilegeModalProps> = ({
  open,
  onClose,
  onSubmit,
  loading = false,
  mode = 'create',
  initialData,
}) => {
  const [userName, setUserName] = useState(initialData?.userName || '');
  const [role, setRole] = useState(initialData?.role || '');

  const roleOptions = [
    { value: 'Sales Manager', label: 'Sales Manager' },
    { value: 'Sales Rep', label: 'Sales Rep' },
    { value: 'Team Lead', label: 'Team Lead' },
  ];

  const handleSubmit = () => {
    onSubmit({ userName, role });
    setUserName('');
    setRole('');
  };

  const handleCancel = () => {
    setUserName('');
    setRole('');
    onClose();
  };

  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      onSubmit={handleSubmit}
      title={mode === 'create' ? 'Add User Privilege' : 'Edit User Privilege'}
      submitButtonText={mode === 'create' ? 'Create' : 'Update'}
      closeButtonText="Cancel"
      submitButtonDisabled={!userName || !role}
      loading={loading}
      width={500}
      showFooter={true}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Input
          label="User Name"
          placeholder="Enter user name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          height={48}
        />
        <Select
          label="Role"
          placeholder="Select role"
          options={roleOptions}
          value={role}
          onChange={(value) => setRole(value as string)}
          height={48}
        />
      </div>
    </Modal>
  );
};
