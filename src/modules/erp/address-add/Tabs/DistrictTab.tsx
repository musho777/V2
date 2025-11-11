'use client';

import { forwardRef, useImperativeHandle, useState } from 'react';

import { Card } from 'antd';

import { Button } from '@/components/Button';
import { ErpDeleteIcon } from '@/components/Icons/ErpDeleteIcon';
import { ErpEditIcon } from '@/components/Icons/ErpEditIcon';
import { Input } from '@/components/Input';
import { Modal } from '@/components/Modal';
import { Select } from '@/components/Select/Select';

import { useCities } from '../../hooks/useCities';
import { useCountries } from '../../hooks/useCountries';
import { useRegions } from '../../hooks/useRegions';
import type { AdministrativeDistrict } from '../../services/administrative-district.service';
import { administrativeDistrictService } from '../../services/administrative-district.service';
import type { Street } from '../../services/street.service';
import { streetService } from '../../services/street.service';

import styles from './TabContent.module.scss';

interface DistrictTabProps {
  onCreateClick: () => void;
}

export const DistrictTab = forwardRef<
  { refresh: () => void },
  DistrictTabProps
>(({ onCreateClick }, ref) => {
  const {
    countries,
    loading: countriesLoading,
    fetchCountries,
  } = useCountries();
  const [districts, setDistricts] = useState<AdministrativeDistrict[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCountryId, setSelectedCountryId] = useState<number | null>(
    null,
  );
  const [selectedRegionId, setSelectedRegionId] = useState<number | null>(null);
  const [selectedCityId, setSelectedCityId] = useState<number | null>(null);
  const [selectedStreetId, setSelectedStreetId] = useState<number | null>(null);
  const [streets, setStreets] = useState<Street[]>([]);
  const [streetsLoading, setStreetsLoading] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedDistrict, setSelectedDistrict] =
    useState<AdministrativeDistrict | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    cityId: 0,
  });
  const { regions, loading: regionsLoading } = useRegions(selectedCountryId);
  const { cities, loading: citiesLoading } = useCities(selectedRegionId);

  const fetchDistricts = async (cityId: number) => {
    try {
      setLoading(true);
      const data = await administrativeDistrictService.getAll(cityId);
      setDistricts(data);
    } catch (error) {
      console.error('Failed to fetch administrative districts:', error);
      setDistricts([]);
    } finally {
      setLoading(false);
    }
  };

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

  const handleCityChange = (value: number) => {
    setSelectedCityId(value);
    fetchDistricts(value);
  };

  const handleEdit = (district: AdministrativeDistrict) => {
    setSelectedDistrict(district);
    setEditFormData({
      name: district.name,
      cityId: selectedCityId || 0,
    });
    setEditModalOpen(true);
  };

  const handleDelete = (district: AdministrativeDistrict) => {
    setSelectedDistrict(district);
    setDeleteModalOpen(true);
  };

  const handleEditSubmit = async () => {
    if (!selectedDistrict || !selectedCityId) return;

    setEditModalOpen(false);
    setSelectedDistrict(null);
    setEditFormData({ name: '', cityId: 0 });

    try {
      const city = cities.find((c) => c.id === editFormData.cityId);
      await administrativeDistrictService.update(selectedDistrict.id, {
        name: editFormData.name,
        city: {
          id: editFormData.cityId,
          name: city?.name || '',
        },
      });
      await fetchDistricts(selectedCityId);
    } catch (error) {
      console.error('Failed to update administrative district:', error);
      await fetchDistricts(selectedCityId);
    }
  };

  const handleDeleteSubmit = async () => {
    if (!selectedDistrict || !selectedCityId) return;

    setDeleteModalOpen(false);
    setSelectedDistrict(null);

    try {
      await administrativeDistrictService.delete(selectedDistrict.id);
      await fetchDistricts(selectedCityId);
    } catch (error) {
      console.error('Failed to delete administrative district:', error);
      await fetchDistricts(selectedCityId);
    }
  };

  const handleReset = () => {
    setSelectedCountryId(null);
    setSelectedRegionId(null);
    setSelectedCityId(null);
    setSelectedStreetId(null);
    setStreets([]);
    setDistricts([]);
  };

  useImperativeHandle(ref, () => ({
    refresh: () => {
      if (selectedCityId) {
        fetchDistricts(selectedCityId);
      }
    },
  }));

  return (
    <div className={styles.tabContent}>
      <div className={styles.filtersRow}>
        <Select
          placeholder="Ընտրել երկիրը"
          label="Ընտրել երկիրը"
          height={48}
          width={320}
          options={countries.map((country) => ({
            value: country.id,
            label: country.name,
          }))}
          loading={countriesLoading}
          onChange={setSelectedCountryId}
          value={selectedCountryId}
          onDropdownVisibleChange={(open) => {
            if (open) fetchCountries();
          }}
        />
        <Select
          placeholder="Ընտրել շրջան"
          label="Ընտրել շրջան"
          height={48}
          width={320}
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
          placeholder="Ընտրել քաղաք"
          label="Ընտրել քաղաք"
          height={48}
          width={320}
          options={cities.map((city) => ({
            value: city.id,
            label: city.name,
          }))}
          loading={citiesLoading}
          disabled={!selectedRegionId}
          onChange={handleCityChange}
          value={selectedCityId}
        />
        <Select
          placeholder="Ընտրել փողոց"
          label="Ընտրել փողոց"
          height={48}
          width={320}
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
        <Button
          buttonType="primary"
          variant="link"
          onClick={handleReset}
          className={styles.resetButton}
        >
          Մաքրել
        </Button>
      </div>
      <Button
        buttonType="action"
        onClick={onCreateClick}
        className={styles.createButton}
      >
        + Ստեղծել վարչական շրջան
      </Button>

      {!selectedCityId ? (
        <div className={styles.emptyState}>
          <p>Ընտրեք քաղաքը</p>
        </div>
      ) : loading ? (
        <div className={styles.emptyState}>
          <p>Բեռնվում է...</p>
        </div>
      ) : districts.length === 0 ? (
        <div className={styles.emptyState}>
          <p>Վարչական շրջանների ցուցակ դատարկ է</p>
        </div>
      ) : (
        <div className={styles.countriesGrid}>
          {districts.map((district) => (
            <Card key={district.id} className={styles.countryCard}>
              <div className={styles.countryCardContent}>
                <span className={styles.countryName}>{district.name}</span>
                <div className={styles.countryActions}>
                  <ErpEditIcon
                    className={styles.actionIcon}
                    onClick={() => handleEdit(district)}
                  />
                  <ErpDeleteIcon
                    className={styles.actionIcon}
                    onClick={() => handleDelete(district)}
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      <Modal
        open={editModalOpen}
        onCancel={() => {
          setEditModalOpen(false);
          setSelectedDistrict(null);
          setEditFormData({ name: '', cityId: 0 });
        }}
        onSubmit={handleEditSubmit}
        title="Խմբագրել վարչական շրջանը"
        submitButtonText="Հաստատել"
        closeButtonText="Չեղարկել"
      >
        <Select
          placeholder="Ընտրել երկիրը"
          label="Ընտրել երկիրը"
          height={48}
          width={320}
          style={{ marginBottom: '16px' }}
          options={countries.map((country) => ({
            value: country.id,
            label: country.name,
          }))}
          value={selectedCountryId}
          disabled
        />
        <Select
          placeholder="Ընտրել շրջանը"
          label="Ընտրել շրջանը"
          height={48}
          width={320}
          style={{ marginBottom: '16px' }}
          options={regions.map((region) => ({
            value: region.id,
            label: region.name,
          }))}
          value={selectedRegionId}
          disabled
        />
        <Select
          placeholder="Ընտրել քաղաքը"
          label="Ընտրել քաղաքը"
          height={48}
          width={320}
          style={{ marginBottom: '16px' }}
          options={cities.map((city) => ({
            value: city.id,
            label: city.name,
          }))}
          value={editFormData.cityId}
          onChange={(value) =>
            setEditFormData({ ...editFormData, cityId: value })
          }
        />
        <Input
          label="Անվանում"
          placeholder="Մուտքագրեք վարչական շրջանի անվանումը"
          value={editFormData.name}
          onChange={(e) =>
            setEditFormData({ ...editFormData, name: e.target.value })
          }
          height={48}
        />
      </Modal>

      {/* Delete Modal */}
      <Modal
        open={deleteModalOpen}
        onCancel={() => {
          setDeleteModalOpen(false);
          setSelectedDistrict(null);
        }}
        onSubmit={handleDeleteSubmit}
        title="Ջնջել վարչական շրջանը"
        submitButtonText="Ջնջել"
        closeButtonText="Չեղարկել"
      >
        <p>
          Վստա՞հ եք, որ ցանկանում եք ջնջել "{selectedDistrict?.name}" վարչական
          շրջանը:
        </p>
      </Modal>
    </div>
  );
});

DistrictTab.displayName = 'DistrictTab';
