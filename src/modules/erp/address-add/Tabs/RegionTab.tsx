'use client';

import { useEffect, useState } from 'react';

import { Card } from 'antd';

import { Button } from '@/components/Button';
import { ErpDeleteIcon } from '@/components/Icons/ErpDeleteIcon';
import { ErpEditIcon } from '@/components/Icons/ErpEditIcon';
import { Input } from '@/components/Input';
import { Modal } from '@/components/Modal';
import { Select } from '@/components/Select/Select';

import { useCountries } from '../../hooks/useCountries';
import type { Region } from '../../services/region.service';
import { regionService } from '../../services/region.service';

import styles from './TabContent.module.scss';

interface RegionTabProps {
  onCreateClick: () => void;
}

export const RegionTab: React.FC<RegionTabProps> = ({ onCreateClick }) => {
  const {
    countries,
    loading: countriesLoading,
    fetchCountries,
  } = useCountries();
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCountryId, setSelectedCountryId] = useState<number | null>(
    null,
  );
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    countryId: 0,
  });

  const fetchRegions = async (countryId: number) => {
    try {
      setLoading(true);
      const data = await regionService.getAll(countryId);
      setRegions(data);
    } catch (error) {
      console.error('Failed to fetch regions:', error);
      setRegions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCountryChange = (value: number) => {
    setSelectedCountryId(value);
    fetchRegions(value);
  };

  const handleEdit = (region: Region) => {
    setSelectedRegion(region);
    setEditFormData({
      name: region.name,
      countryId: selectedCountryId || 0,
    });
    setEditModalOpen(true);
  };

  const handleDelete = (region: Region) => {
    setSelectedRegion(region);
    setDeleteModalOpen(true);
  };

  const handleEditSubmit = async () => {
    if (!selectedRegion || !selectedCountryId) return;

    setEditModalOpen(false);
    setSelectedRegion(null);
    setEditFormData({ name: '', countryId: 0 });

    try {
      const country = countries.find((c) => c.id === editFormData.countryId);
      await regionService.update(selectedRegion.id, {
        name: editFormData.name,
        country: {
          id: editFormData.countryId,
          name: country?.name || '',
        },
      });
      await fetchRegions(selectedCountryId);
    } catch (error) {
      console.error('Failed to update region:', error);
      await fetchRegions(selectedCountryId);
    }
  };

  const handleDeleteSubmit = async () => {
    if (!selectedRegion || !selectedCountryId) return;

    setDeleteModalOpen(false);
    setSelectedRegion(null);

    try {
      await regionService.delete(selectedRegion.id);
      await fetchRegions(selectedCountryId);
    } catch (error) {
      console.error('Failed to delete region:', error);
      await fetchRegions(selectedCountryId);
    }
  };

  const handleReset = () => {
    setSelectedCountryId(null);
    setRegions([]);
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
          onChange={handleCountryChange}
          value={selectedCountryId}
          onDropdownVisibleChange={(open) => {
            if (open) fetchCountries();
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
        + Ստեղծել շրջան
      </Button>

      {!selectedCountryId ? (
        <div className={styles.emptyState}>
          <p>Ընտրեք երկիրը</p>
        </div>
      ) : loading ? (
        <div className={styles.emptyState}>
          <p>Բեռնվում է...</p>
        </div>
      ) : regions.length === 0 ? (
        <div className={styles.emptyState}>
          <p>Շրջանների ցուցակ դատարկ է</p>
        </div>
      ) : (
        <div className={styles.countriesGrid}>
          {regions.map((region) => (
            <Card key={region.id} className={styles.countryCard}>
              <div className={styles.countryCardContent}>
                <span className={styles.countryName}>{region.name}</span>
                <div className={styles.countryActions}>
                  <ErpEditIcon
                    className={styles.actionIcon}
                    onClick={() => handleEdit(region)}
                  />
                  <ErpDeleteIcon
                    className={styles.actionIcon}
                    onClick={() => handleDelete(region)}
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
          setSelectedRegion(null);
          setEditFormData({ name: '', countryId: 0 });
        }}
        onSubmit={handleEditSubmit}
        title="Խմբագրել շրջանը"
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
          value={editFormData.countryId}
          onChange={(value) =>
            setEditFormData({ ...editFormData, countryId: value })
          }
        />
        <Input
          label="Անվանում"
          placeholder="Մուտքագրեք շրջանի անվանումը"
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
          setSelectedRegion(null);
        }}
        onSubmit={handleDeleteSubmit}
        title="Ջնջել շրջանը"
        submitButtonText="Ջնջել"
        closeButtonText="Չեղարկել"
      >
        <p>Վստա՞հ եք, որ ցանկանում եք ջնջել "{selectedRegion?.name}" շրջանը:</p>
      </Modal>
    </div>
  );
};
