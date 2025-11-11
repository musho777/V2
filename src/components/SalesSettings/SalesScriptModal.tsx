'use client';

import React, { useState } from 'react';

import { Input } from '@/components/Input';
import { Modal } from '@/components/Modal/Modal';
import { TextArea } from '@/components/TextArea';

export interface SalesScriptModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; content: string }) => void;
  loading?: boolean;
  mode?: 'create' | 'edit';
  initialData?: { name: string; content: string };
}

export const SalesScriptModal: React.FC<SalesScriptModalProps> = ({
  open,
  onClose,
  onSubmit,
  loading = false,
  mode = 'create',
  initialData,
}) => {
  const [name, setName] = useState(initialData?.name || '');
  const [content, setContent] = useState(initialData?.content || '');

  const handleSubmit = () => {
    onSubmit({ name, content });
    setName('');
    setContent('');
  };

  const handleCancel = () => {
    setName('');
    setContent('');
    onClose();
  };

  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      onSubmit={handleSubmit}
      title={mode === 'create' ? 'Add Sales Script' : 'Edit Sales Script'}
      submitButtonText={mode === 'create' ? 'Create' : 'Update'}
      closeButtonText="Cancel"
      submitButtonDisabled={!name || !content}
      loading={loading}
      width={600}
      showFooter={true}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Input
          label="Name"
          placeholder="Enter script name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          height={48}
        />
        <TextArea
          label="Content"
          placeholder="Enter script content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          height={120}
        />
      </div>
    </Modal>
  );
};
