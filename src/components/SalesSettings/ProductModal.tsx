'use client';

import React, { useState } from 'react';

import { Input } from '@/components/Input';
import { Modal } from '@/components/Modal/Modal';

export interface ProductModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; price: number }) => void;
  loading?: boolean;
  mode?: 'create' | 'edit';
  initialData?: { name: string; price: number };
}

export const ProductModal: React.FC<ProductModalProps> = ({
  open,
  onClose,
  onSubmit,
  loading = false,
  mode = 'create',
  initialData,
}) => {
  const [name, setName] = useState(initialData?.name || '');
  const [price, setPrice] = useState(initialData?.price?.toString() || '');

  const handleSubmit = () => {
    onSubmit({ name, price: parseFloat(price) });
    setName('');
    setPrice('');
  };

  const handleCancel = () => {
    setName('');
    setPrice('');
    onClose();
  };

  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      onSubmit={handleSubmit}
      title={mode === 'create' ? 'Add Product' : 'Edit Product'}
      submitButtonText={mode === 'create' ? 'Create' : 'Update'}
      closeButtonText="Cancel"
      submitButtonDisabled={!name || !price}
      loading={loading}
      width={500}
      showFooter={true}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Input
          label="Name"
          placeholder="Enter product name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          height={48}
        />
        <Input
          label="Price"
          type="number"
          placeholder="Enter price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          height={48}
        />
      </div>
    </Modal>
  );
};
