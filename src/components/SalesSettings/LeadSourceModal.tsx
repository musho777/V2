'use client';

import React, { useState } from 'react';

import { Input } from '@/components/Input';
import { Modal } from '@/components/Modal/Modal';

export interface LeadSourceModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string }) => void;
  loading?: boolean;
  mode?: 'create' | 'edit';
  initialData?: { name: string };
}

export const LeadSourceModal: React.FC<LeadSourceModalProps> = ({
  open,
  onClose,
  onSubmit,
  loading = false,
  mode = 'create',
  initialData,
}) => {
  const [name, setName] = useState(initialData?.name || '');

  const handleSubmit = () => {
    onSubmit({ name });
    setName('');
  };

  const handleCancel = () => {
    setName('');
    onClose();
  };

  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      onSubmit={handleSubmit}
      title={mode === 'create' ? 'Add Lead Source' : 'Edit Lead Source'}
      submitButtonText={mode === 'create' ? 'Create' : 'Update'}
      closeButtonText="Cancel"
      submitButtonDisabled={!name}
      loading={loading}
      width={500}
      showFooter={true}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Input
          label="Name"
          placeholder="Enter lead source name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          height={48}
        />
      </div>
    </Modal>
  );
};
