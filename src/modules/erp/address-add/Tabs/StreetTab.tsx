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
import type { Street } from '../../services/street.service';
import { streetService } from '../../services/street.service';

import styles from './TabContent.module.scss';

interface StreetTabProps {
  onCreateClick: () => void;
}

export const StreetTab = forwardRef<{ refresh: () => void }, StreetTabProps>(
  ({ onCreateClick }, ref) => {
    const {
      countries,
      loading: countriesLoading,
      fetchCountries,
    } = useCountries();
    const [streets, setStreets] = useState<Street[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedCountryId, setSelectedCountryId] = useState<number | null>(
      null,
    );
    const [selectedRegionId, setSelectedRegionId] = useState<number | null>(
      null,
    );
    const [selectedCityId, setSelectedCityId] = useState<number | null>(null);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedStreet, setSelectedStreet] = useState<Street | null>(null);
    const [editFormData, setEditFormData] = useState({
      name: '',
      cityId: 0,
    });
    const { regions, loading: regionsLoading } = useRegions(selectedCountryId);
    const { cities, loading: citiesLoading } = useCities(selectedRegionId);

    const fetchStreets = async (cityId: number) => {
      try {
        setLoading(true);
        const data = await streetService.getAll(cityId);
        setStreets(data);
      } catch (error) {
        console.error('Failed to fetch streets:', error);
        setStreets([]);
      } finally {
        setLoading(false);
      }
    };

    const handleCityChange = (value: number) => {
      setSelectedCityId(value);
      fetchStreets(value);
    };

    const handleEdit = (street: Street) => {
      setSelectedStreet(street);
      setEditFormData({
        name: street.name,
        cityId: selectedCityId || 0,
      });
      setEditModalOpen(true);
    };

    const handleDelete = (street: Street) => {
      setSelectedStreet(street);
      setDeleteModalOpen(true);
    };

    const handleEditSubmit = async () => {
      if (!selectedStreet || !selectedCityId) return;

      setEditModalOpen(false);
      setSelectedStreet(null);
      setEditFormData({ name: '', cityId: 0 });

      try {
        const city = cities.find((c) => c.id === editFormData.cityId);
        await streetService.update(selectedStreet.id, {
          name: editFormData.name,
          city: {
            id: editFormData.cityId,
            name: city?.name || '',
          },
        });
        await fetchStreets(selectedCityId);
      } catch (error) {
        console.error('Failed to update street:', error);
        await fetchStreets(selectedCityId);
      }
    };

    const handleDeleteSubmit = async () => {
      if (!selectedStreet || !selectedCityId) return;

      setDeleteModalOpen(false);
      setSelectedStreet(null);

      try {
        await streetService.delete(selectedStreet.id);
        await fetchStreets(selectedCityId);
      } catch (error) {
        console.error('Failed to delete street:', error);
        await fetchStreets(selectedCityId);
      }
    };

    const handleReset = () => {
      setSelectedCountryId(null);
      setSelectedRegionId(null);
      setSelectedCityId(null);
      setStreets([]);
    };

    useImperativeHandle(ref, () => ({
      refresh: () => {
        if (selectedCityId) {
          fetchStreets(selectedCityId);
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
          + Ստեղծել փողոց
        </Button>

        {!selectedCityId ? (
          <div className={styles.emptyState}>
            <p>Ընտրեք քաղաքը</p>
          </div>
        ) : loading ? (
          <div className={styles.emptyState}>
            <p>Բեռնվում է...</p>
          </div>
        ) : streets.length === 0 ? (
          <div className={styles.emptyState}>
            <p>Փողոցների ցուցակ դատարկ է</p>
          </div>
        ) : (
          <div className={styles.countriesGrid}>
            {streets.map((street) => (
              <Card key={street.id} className={styles.countryCard}>
                <div className={styles.countryCardContent}>
                  <span className={styles.countryName}>{street.name}</span>
                  <div className={styles.countryActions}>
                    <ErpEditIcon
                      className={styles.actionIcon}
                      onClick={() => handleEdit(street)}
                    />
                    <ErpDeleteIcon
                      className={styles.actionIcon}
                      onClick={() => handleDelete(street)}
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
            setSelectedStreet(null);
            setEditFormData({ name: '', cityId: 0 });
          }}
          onSubmit={handleEditSubmit}
          title="Խմբագրել փողոցը"
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
            placeholder="Մուտքագրեք փողոցի անվանումը"
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
            setSelectedStreet(null);
          }}
          onSubmit={handleDeleteSubmit}
          title="Ջնջել փողոցը"
          submitButtonText="Ջնջել"
          closeButtonText="Չեղարկել"
        >
          <p>
            Վստա՞հ եք, որ ցանկանում եք ջնջել "{selectedStreet?.name}" փողոցը:
          </p>
        </Modal>
      </div>
    );
  },
);

StreetTab.displayName = 'StreetTab';
