'use client';

import { useState } from 'react';

import { Card } from 'antd';

import { Button } from '@/components/Button';
import { ErpDeleteIcon } from '@/components/Icons/ErpDeleteIcon';
import { ErpEditIcon } from '@/components/Icons/ErpEditIcon';
import { Input } from '@/components/Input';
import { Modal } from '@/components/Modal';
import { Select } from '@/components/Select/Select';

import { useCountries } from '../../hooks/useCountries';
import { useRegions } from '../../hooks/useRegions';
import type { City } from '../../services/city.service';
import { cityService } from '../../services/city.service';

import styles from './TabContent.module.scss';

interface CityTabProps {
  onCreateClick: () => void;
}

export const CityTab: React.FC<CityTabProps> = ({ onCreateClick }) => {
  const {
    countries,
    loading: countriesLoading,
    fetchCountries,
  } = useCountries();
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCountryId, setSelectedCountryId] = useState<number | null>(
    null,
  );
  const [selectedRegionId, setSelectedRegionId] = useState<number | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    regionId: 0,
  });
  const { regions, loading: regionsLoading } = useRegions(selectedCountryId);

  const fetchCities = async (regionId: number) => {
    try {
      setLoading(true);
      const data = await cityService.getAll(regionId);
      setCities(data);
    } catch (error) {
      console.error('Failed to fetch cities:', error);
      setCities([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRegionChange = (value: number) => {
    setSelectedRegionId(value);
    fetchCities(value);
  };

  const handleEdit = (city: City) => {
    setSelectedCity(city);
    setEditFormData({
      name: city.name,
      regionId: selectedRegionId || 0,
    });
    setEditModalOpen(true);
  };

  const handleDelete = (city: City) => {
    setSelectedCity(city);
    setDeleteModalOpen(true);
  };

  const handleEditSubmit = async () => {
    if (!selectedCity || !selectedRegionId) return;

    setEditModalOpen(false);
    setSelectedCity(null);
    setEditFormData({ name: '', regionId: 0 });

    try {
      const region = regions.find((r) => r.id === editFormData.regionId);
      await cityService.update(selectedCity.id, {
        name: editFormData.name,
        region: {
          id: editFormData.regionId,
          name: region?.name || '',
        },
      });
      await fetchCities(selectedRegionId);
    } catch (error) {
      console.error('Failed to update city:', error);
      await fetchCities(selectedRegionId);
    }
  };

  const handleDeleteSubmit = async () => {
    if (!selectedCity || !selectedRegionId) return;

    setDeleteModalOpen(false);
    setSelectedCity(null);

    try {
      await cityService.delete(selectedCity.id);
      await fetchCities(selectedRegionId);
    } catch (error) {
      console.error('Failed to delete city:', error);
      await fetchCities(selectedRegionId);
    }
  };

  const handleReset = () => {
    setSelectedCountryId(null);
    setSelectedRegionId(null);
    setCities([]);
  };

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
          onChange={handleRegionChange}
          value={selectedRegionId}
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
        + Ստեղծել քաղաք/գյուղ
      </Button>

      {!selectedRegionId ? (
        <div className={styles.emptyState}>
          <p>Ընտրեք շրջանը</p>
        </div>
      ) : loading ? (
        <div className={styles.emptyState}>
          <p>Բեռնվում է...</p>
        </div>
      ) : cities.length === 0 ? (
        <div className={styles.emptyState}>
          <p>Քաղաքների/գյուղերի ցուցակ դատարկ է</p>
        </div>
      ) : (
        <div className={styles.countriesGrid}>
          {cities.map((city) => (
            <Card key={city.id} className={styles.countryCard}>
              <div className={styles.countryCardContent}>
                <span className={styles.countryName}>{city.name}</span>
                <div className={styles.countryActions}>
                  <ErpEditIcon
                    className={styles.actionIcon}
                    onClick={() => handleEdit(city)}
                  />
                  <ErpDeleteIcon
                    className={styles.actionIcon}
                    onClick={() => handleDelete(city)}
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
          setSelectedCity(null);
          setEditFormData({ name: '', regionId: 0 });
        }}
        onSubmit={handleEditSubmit}
        title="Խմբագրել քաղաքը/գյուղը"
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
          value={editFormData.regionId}
          onChange={(value) =>
            setEditFormData({ ...editFormData, regionId: value })
          }
        />
        <Input
          label="Անվանում"
          placeholder="Մուտքագրեք քաղաքի/գյուղի անվանումը"
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
          setSelectedCity(null);
        }}
        onSubmit={handleDeleteSubmit}
        title="Ջնջել քաղաքը/գյուղը"
        submitButtonText="Ջնջել"
        closeButtonText="Չեղարկել"
      >
        <p>
          Վստա՞հ եք, որ ցանկանում եք ջնջել "{selectedCity?.name}" քաղաքը/գյուղը:
        </p>
      </Modal>
    </div>
  );
};
