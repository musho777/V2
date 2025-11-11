'use client';

import { useEffect, useState } from 'react';

import { Input } from '@/components/Input';
import { Modal } from '@/components/Modal';
import { Select } from '@/components/Select/Select';

import { useCities } from '../../hooks/useCities';
import { useCountries } from '../../hooks/useCountries';
import { useRegions } from '../../hooks/useRegions';
import type { Street } from '../../services/street.service';
import { streetService } from '../../services/street.service';

interface StreetModalProps {
  open: boolean;
  onCancel: () => void;
  onSuccess?: () => void;
}

export const StreetModal: React.FC<StreetModalProps> = ({
  open,
  onCancel,
  onSuccess,
}) => {
  const {
    countries,
    loading: countriesLoading,
    fetchCountries,
  } = useCountries();
  const [selectedCountryId, setSelectedCountryId] = useState<number | null>(
    null,
  );
  const [selectedRegionId, setSelectedRegionId] = useState<number | null>(null);
  const [selectedCityId, setSelectedCityId] = useState<number | null>(null);
  const [selectedStreetId, setSelectedStreetId] = useState<number | null>(null);
  const [streets, setStreets] = useState<Street[]>([]);
  const [streetsLoading, setStreetsLoading] = useState(false);
  const [streetName, setStreetName] = useState('');
  const { regions, loading: regionsLoading } = useRegions(selectedCountryId);
  const { cities, loading: citiesLoading } = useCities(selectedRegionId);

  const fetchStreets = async (cityId: number) => {
    try {
      setStreetsLoading(true);
      const data = await streetService.getAll(cityId);
      setStreets(data);
    } catch (error) {
      console.error('Failed to fetch streets:', error);
      setStreets([]);
    } finally {
      setStreetsLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedCountryId(null);
    setSelectedRegionId(null);
    setSelectedCityId(null);
    setSelectedStreetId(null);
    setStreets([]);
    setStreetName('');
  };

  const handleCancel = () => {
    handleReset();
    onCancel();
  };

  const handleSubmit = async () => {
    if (!selectedCityId || !streetName.trim()) {
      return;
    }

    try {
      const city = cities.find((c) => c.id === selectedCityId);
      await streetService.create({
        name: streetName.trim(),
        city: {
          id: selectedCityId,
          name: city?.name || '',
        },
      });
      handleReset();
      onCancel();
      onSuccess?.();
    } catch (error) {
      console.error('Failed to create street:', error);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      onSubmit={handleSubmit}
      title="Ստեղծել փողոց"
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
        onChange={setSelectedRegionId}
        value={selectedRegionId}
      />
      <Select
        placeholder="Ընտրել քաղաքը/գյուղը"
        label="Ընտրել քաղաքը/գյուղը"
        height={48}
        width={320}
        style={{ marginBottom: '16px', height: '48px' }}
        options={cities.map((city) => ({
          value: city.id,
          label: city.name,
        }))}
        loading={citiesLoading}
        disabled={!selectedRegionId}
        onChange={setSelectedCityId}
        value={selectedCityId}
      />
      <Select
        placeholder="Ընտրել փողոց"
        label="Ընտրել փողոց"
        height={48}
        width={320}
        style={{ marginBottom: '16px', height: '48px' }}
        options={streets.map((street) => ({
          value: street.id,
          label: street.name,
        }))}
        loading={streetsLoading}
        disabled={!selectedCityId}
        onChange={setSelectedStreetId}
        value={selectedStreetId}
        onDropdownVisibleChange={(open) => {
          if (open && selectedCityId) {
            fetchStreets(selectedCityId);
          }
        }}
      />
      <Input
        label="Անվանում"
        placeholder="Մուտքագրեք փողոցի անվանումը"
        value={streetName}
        onChange={(e) => setStreetName(e.target.value)}
        height={48}
      />
    </Modal>
  );
};
