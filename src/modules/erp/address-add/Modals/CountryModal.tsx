'use client';

import { Input } from '@/components/Input';
import { Modal } from '@/components/Modal';

interface CountryModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: () => void;
  formData: { name: string };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const CountryModal: React.FC<CountryModalProps> = ({
  open,
  onCancel,
  onSubmit,
  formData,
  onChange,
}) => {
  return (
    <Modal
      open={open}
      onCancel={onCancel}
      onSubmit={onSubmit}
      title="Ստեղծել երկիր"
      submitButtonText="Հաստատել"
      closeButtonText="Չեղարկել"
    >
      <Input
        label="Անվանում"
        placeholder="Մուտքագրեք երկրի անվանումը"
        value={formData.name}
        onChange={onChange}
        height={48}
      />
    </Modal>
  );
};
