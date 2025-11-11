'use client';

import { useState } from 'react';

import { Input } from '@/components/Input';
import { Modal } from '@/components/Modal';
import { Select } from '@/components/Select/Select';

import { useCities } from '../../hooks/useCities';
import { useCountries } from '../../hooks/useCountries';
import { useRegions } from '../../hooks/useRegions';
import type { AdministrativeDistrict } from '../../services/administrative-district.service';
import { administrativeDistrictService } from '../../services/administrative-district.service';
import { buildingService } from '../../services/building.service';
import type { Street } from '../../services/street.service';
import { streetService } from '../../services/street.service';

interface BuildingModalProps {
  open: boolean;
  onCancel: () => void;
  onSuccess?: () => void;
}

export const BuildingModal: React.FC<BuildingModalProps> = ({
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
  const [selectedDistrictId, setSelectedDistrictId] = useState<number | null>(
    null,
  );
  const [buildingName, setBuildingName] = useState('');
  const [comment, setComment] = useState('');
  const [streets, setStreets] = useState<Street[]>([]);
  const [streetsLoading, setStreetsLoading] = useState(false);
  const [districts, setDistricts] = useState<AdministrativeDistrict[]>([]);
  const [districtsLoading, setDistrictsLoading] = useState(false);
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

  const fetchDistricts = async (cityId: number) => {
    try {
      setDistrictsLoading(true);
      const data = await administrativeDistrictService.getAll(cityId);
      setDistricts(data);
    } catch (error) {
      console.error('Failed to fetch administrative districts:', error);
      setDistricts([]);
    } finally {
      setDistrictsLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedCountryId(null);
    setSelectedRegionId(null);
    setSelectedCityId(null);
    setSelectedStreetId(null);
    setSelectedDistrictId(null);
    setStreets([]);
    setDistricts([]);
    setBuildingName('');
    setComment('');
  };

  const handleCancel = () => {
    handleReset();
    onCancel();
  };

  const handleSubmit = async () => {
    if (!selectedStreetId || !selectedDistrictId || !buildingName.trim()) {
      return;
    }

    try {
      const street = streets.find((s) => s.id === selectedStreetId);
      const district = districts.find((d) => d.id === selectedDistrictId);
      await buildingService.create({
        name: buildingName.trim(),
        street: {
          id: selectedStreetId,
          name: street?.name || '',
        },
        administrativeDistrict: {
          id: selectedDistrictId,
          name: district?.name || '',
        },
        comment: comment.trim() || undefined,
      });
      handleReset();
      onCancel();
      onSuccess?.();
    } catch (error) {
      console.error('Failed to create building:', error);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      onSubmit={handleSubmit}
      title="Ստեղծել շենք/տուն"
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
      <Select
        placeholder="Ընտրել վարչական շրջանը"
        label="Ընտրել վարչական շրջանը"
        height={48}
        width={320}
        style={{ marginBottom: '16px', height: '48px' }}
        options={districts.map((district) => ({
          value: district.id,
          label: district.name,
        }))}
        loading={districtsLoading}
        disabled={!selectedCityId}
        onChange={setSelectedDistrictId}
        value={selectedDistrictId}
        onDropdownVisibleChange={(open) => {
          if (open && selectedCityId) {
            void fetchDistricts(selectedCityId);
          }
        }}
      />
      <Input
        label="Անվանում"
        placeholder="Մուտքագրեք շենքի/տան անվանումը"
        value={buildingName}
        onChange={(e) => setBuildingName(e.target.value)}
        height={48}
        style={{ marginBottom: '16px' }}
      />
      <Input
        label="Մեկնաբանություն"
        placeholder="Մուտքագրեք մեկնաբանություն"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        height={48}
      />
    </Modal>
  );
};
