'use client';

import { useState } from 'react';

import { Input } from '@/components/Input';
import { Modal } from '@/components/Modal';
import { Select } from '@/components/Select/Select';

import { useCountries } from '../../hooks/useCountries';
import { useRegions } from '../../hooks/useRegions';

interface CityModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: () => void;
  formData: { name: string; regionId: number };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRegionChange: (value: number) => void;
}

export const CityModal: React.FC<CityModalProps> = ({
  open,
  onCancel,
  onSubmit,
  formData,
  onChange,
  onRegionChange,
}) => {
  const {
    countries,
    loading: countriesLoading,
    fetchCountries,
  } = useCountries();
  const [selectedCountryId, setSelectedCountryId] = useState<number | null>(
    null,
  );
  const { regions, loading: regionsLoading } = useRegions(selectedCountryId);

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      onSubmit={onSubmit}
      title="Ստեղծել քաղաք/գյուղ"
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
        loading={countriesLoading}
        onChange={setSelectedCountryId}
        value={selectedCountryId}
        onDropdownVisibleChange={(open) => {
          if (open) {
            void fetchCountries();
          }
        }}
      />
      <Select
        placeholder="Ընտրել շրջանը"
        label="Ընտրել շրջանը"
        height={48}
        width={320}
        style={{ marginBottom: '16px', height: '48px' }}
        options={regions.map((region) => ({
          value: region.id,
          label: region.name,
        }))}
        loading={regionsLoading}
        disabled={!selectedCountryId}
        onChange={onRegionChange}
        value={formData.regionId}
      />
      <Input
        label="Անվանում"
        placeholder="Մուտքագրեք քաղաքի/գյուղի անվանումը"
        value={formData.name}
        onChange={onChange}
        height={48}
      />
    </Modal>
  );
};
