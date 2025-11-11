'use client';

import React, { useState } from 'react';

import { Input } from '@/components/Input';
import { Modal } from '@/components/Modal/Modal';

export interface WorkflowStatusModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; order: number }) => void;
  loading?: boolean;
  mode?: 'create' | 'edit';
  initialData?: { name: string; order: number };
}

export const WorkflowStatusModal: React.FC<WorkflowStatusModalProps> = ({
  open,
  onClose,
  onSubmit,
  loading = false,
  mode = 'create',
  initialData,
}) => {
  const [name, setName] = useState(initialData?.name || '');
  const [order, setOrder] = useState(initialData?.order?.toString() || '');

  const handleSubmit = () => {
    onSubmit({ name, order: parseInt(order) });
    setName('');
    setOrder('');
  };

  const handleCancel = () => {
    setName('');
    setOrder('');
    onClose();
  };

  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      onSubmit={handleSubmit}
      title={mode === 'create' ? 'Add Workflow Status' : 'Edit Workflow Status'}
      submitButtonText={mode === 'create' ? 'Create' : 'Update'}
      closeButtonText="Cancel"
      submitButtonDisabled={!name || !order}
      loading={loading}
      width={500}
      showFooter={true}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Input
          label="Name"
          placeholder="Enter status name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          height={48}
        />
        <Input
          label="Order"
          type="number"
          placeholder="Enter order number"
          value={order}
          onChange={(e) => setOrder(e.target.value)}
          height={48}
        />
      </div>
    </Modal>
  );
};
