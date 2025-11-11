'use client';

import React, { useState } from 'react';

import { Input } from '@/components/Input';
import { Modal } from '@/components/Modal/Modal';

export interface OfferModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; discount: string }) => void;
  loading?: boolean;
  mode?: 'create' | 'edit';
  initialData?: { name: string; discount: string };
}

export const OfferModal: React.FC<OfferModalProps> = ({
  open,
  onClose,
  onSubmit,
  loading = false,
  mode = 'create',
  initialData,
}) => {
  const [name, setName] = useState(initialData?.name || '');
  const [discount, setDiscount] = useState(initialData?.discount || '');

  const handleSubmit = () => {
    onSubmit({ name, discount });
    setName('');
    setDiscount('');
  };

  const handleCancel = () => {
    setName('');
    setDiscount('');
    onClose();
  };

  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      onSubmit={handleSubmit}
      title={mode === 'create' ? 'Add Offer' : 'Edit Offer'}
      submitButtonText={mode === 'create' ? 'Create' : 'Update'}
      closeButtonText="Cancel"
      submitButtonDisabled={!name || !discount}
      loading={loading}
      width={500}
      showFooter={true}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Input
          label="Name"
          placeholder="Enter offer name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          height={48}
        />
        <Input
          label="Discount"
          placeholder="Enter discount (e.g., 20%)"
          value={discount}
          onChange={(e) => setDiscount(e.target.value)}
          height={48}
        />
      </div>
    </Modal>
  );
};
