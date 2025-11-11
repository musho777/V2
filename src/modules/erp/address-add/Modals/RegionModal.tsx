'use client';

import { Input } from '@/components/Input';
import { Modal } from '@/components/Modal';
import { Select } from '@/components/Select/Select';

import { useCountries } from '../../hooks/useCountries';

interface RegionModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: () => void;
  formData: { name: string; countryId: number };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCountryChange: (value: number) => void;
}

export const RegionModal: React.FC<RegionModalProps> = ({
  open,
  onCancel,
  onSubmit,
  formData,
  onChange,
  onCountryChange,
}) => {
  const { countries, loading, fetchCountries } = useCountries();

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      onSubmit={onSubmit}
      title="Ստեղծել շրջան"
      submitButtonText="Հաստատել"
      closeButtonText="Չեղարկել"
    >
      <Select
        placeholder="Ընտրել երկիրը"
        label="Ընտրել երկիրը"
        height={48}
        width={320}
        style={{ marginBottom: '16px', height: '48px' }}
        options={countries.map((country) => ({
          value: country.id,
          label: country.name,
        }))}
        loading={loading}
        value={formData.countryId}
        onChange={onCountryChange}
        onDropdownVisibleChange={(open) => {
          if (open) {
            void fetchCountries();
          }
        }}
      />
      <Input
        label="Անվանում"
        placeholder="Մուտքագրեք շրջանի անվանումը"
        value={formData.name}
        onChange={onChange}
        height={48}
      />
    </Modal>
  );
};
