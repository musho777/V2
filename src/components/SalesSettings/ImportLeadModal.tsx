'use client';

import React, { useState } from 'react';

import { Input } from '@/components/Input';
import { Modal } from '@/components/Modal/Modal';

export interface ImportLeadModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: { fileName: string }) => void;
  loading?: boolean;
}

export const ImportLeadModal: React.FC<ImportLeadModalProps> = ({
  open,
  onClose,
  onSubmit,
  loading = false,
}) => {
  const [fileName, setFileName] = useState('');

  const handleSubmit = () => {
    onSubmit({ fileName });
    setFileName('');
  };

  const handleCancel = () => {
    setFileName('');
    onClose();
  };

  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      onSubmit={handleSubmit}
      title="Import Lead"
      submitButtonText="Import"
      closeButtonText="Cancel"
      submitButtonDisabled={!fileName}
      loading={loading}
      width={500}
      showFooter={true}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Input
          label="File Name"
          type="file"
          placeholder="Select CSV file"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          height={48}
        />
      </div>
    </Modal>
  );
};
