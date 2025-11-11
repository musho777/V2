'use client';

import { useState } from 'react';

import { Input } from '@/components/Input';
import { Modal } from '@/components/Modal';
import { Select } from '@/components/Select/Select';

import { useCities } from '../../hooks/useCities';
import { useCountries } from '../../hooks/useCountries';
import { useRegions } from '../../hooks/useRegions';
import { administrativeDistrictService } from '../../services/administrative-district.service';
import type { Street } from '../../services/street.service';
import { streetService } from '../../services/street.service';

interface DistrictModalProps {
  open: boolean;
  onCancel: () => void;
  onSuccess?: () => void;
}

export const DistrictModal: React.FC<DistrictModalProps> = ({
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
  const [districtName, setDistrictName] = useState('');
  const [streets, setStreets] = useState<Street[]>([]);
  const [streetsLoading, setStreetsLoading] = useState(false);
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
    setDistrictName('');
  };

  const handleCancel = () => {
    handleReset();
    onCancel();
  };

  const handleSubmit = async () => {
    if (!selectedCityId || !districtName.trim()) {
      return;
    }

    try {
      const city = cities.find((c) => c.id === selectedCityId);
      await administrativeDistrictService.create({
        name: districtName.trim(),
        city: {
          id: selectedCityId,
          name: city?.name || '',
        },
      });
      handleReset();
      onCancel();
      onSuccess?.();
    } catch (error) {
      console.error('Failed to create administrative district:', error);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      onSubmit={handleSubmit}
      title="Ստեղծել վարչական շրջան"
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
        placeholder="Ընտրել փողոցը"
        label="Ընտրել փողոցը"
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
            void fetchStreets(selectedCityId);
          }
        }}
      />
      <Input
        label="Անվանում"
        placeholder="Մուտքագրեք վարչական շրջանի անվանումը"
        value={districtName}
        onChange={(e) => setDistrictName(e.target.value)}
        height={48}
      />
    </Modal>
  );
};
