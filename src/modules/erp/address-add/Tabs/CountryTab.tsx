'use client';

import { useEffect, useState } from 'react';

import { Card } from 'antd';

import { Button } from '@/components/Button';
import { ErpDeleteIcon } from '@/components/Icons/ErpDeleteIcon';
import { ErpEditIcon } from '@/components/Icons/ErpEditIcon';
import { Input } from '@/components/Input';
import { Modal } from '@/components/Modal';

import type { Country } from '../../services/country.service';
import { countryService } from '../../services/country.service';

import styles from './TabContent.module.scss';

interface CountryTabProps {
  onCreateClick: () => void;
}

export const CountryTab: React.FC<CountryTabProps> = ({ onCreateClick }) => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [editFormData, setEditFormData] = useState({ name: '' });
  const [errors, setErrors] = useState<Record<number, string>>({});

  const fetchCountries = async () => {
    try {
      setLoading(true);
      const data = await countryService.getAll();
      setCountries(data);
    } catch (error) {
      console.error('Failed to fetch countries:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  const handleEdit = (country: Country) => {
    setSelectedCountry(country);
    setEditFormData({ name: country.name });
    setEditModalOpen(true);
  };

  const handleDelete = (country: Country) => {
    setSelectedCountry(country);
    setDeleteModalOpen(true);
  };

  const handleEditSubmit = async () => {
    if (!selectedCountry) return;

    setEditModalOpen(false);
    setSelectedCountry(null);
    setEditFormData({ name: '' });

    try {
      await countryService.update(selectedCountry.id, editFormData.name);
      await fetchCountries();
    } catch (error) {
      console.error('Failed to update country:', error);
      await fetchCountries();
    }
  };

  const handleDeleteSubmit = async () => {
    if (!selectedCountry) return;

    setDeleteModalOpen(false);
    const countryId = selectedCountry.id;
    setSelectedCountry(null);

    // Clear previous error for this item
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[countryId];
      return newErrors;
    });

    try {
      await countryService.delete(countryId);
      await fetchCountries();
    } catch (error: any) {
      console.error('Failed to delete country:', error);

      // Check if it's a relation error
      if (error?.error === 'object_has_relation' || error?.status === 403) {
        setErrors((prev) => ({
          ...prev,
          [countryId]:
            'Չի կարող ջնջվել, քանի որ օգտագործվում է այլ տվյալներում',
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          [countryId]: 'Սխալ է տեղի ունեցել ջնջելիս',
        }));
      }
      await fetchCountries();
    }
  };

  return (
    <div className={styles.tabContent}>
      <Button
        buttonType="action"
        onClick={onCreateClick}
        className={styles.createButton}
      >
        + Ստեղծել երկիր
      </Button>

      {loading ? (
        <div className={styles.emptyState}>
          <p>Բեռնվում է...</p>
        </div>
      ) : countries.length === 0 ? (
        <div className={styles.emptyState}>
          <p>Երկրների ցուցակ դատարկ է</p>
        </div>
      ) : (
        <div className={styles.countriesGrid}>
          {countries.map((country) => (
            <div key={country.id}>
              <Card className={styles.countryCard}>
                <div className={styles.countryCardContent}>
                  <span className={styles.countryName}>{country.name}</span>
                  <div className={styles.countryActions}>
                    <ErpEditIcon
                      className={styles.actionIcon}
                      onClick={() => handleEdit(country)}
                    />
                    <ErpDeleteIcon
                      className={styles.actionIcon}
                      onClick={() => handleDelete(country)}
                    />
                  </div>
                </div>
              </Card>
              {errors[country.id] && (
                <div className={styles.errorMessage}>{errors[country.id]}</div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      <Modal
        open={editModalOpen}
        onCancel={() => {
          setEditModalOpen(false);
          setSelectedCountry(null);
          setEditFormData({ name: '' });
        }}
        onSubmit={handleEditSubmit}
        title="Խմբագրել երկիրը"
        submitButtonText="Հաստատել"
        closeButtonText="Չեղարկել"
      >
        <Input
          label="Անվանում"
          placeholder="Մուտքագրեք երկրի անվանումը"
          value={editFormData.name}
          onChange={(e) => setEditFormData({ name: e.target.value })}
          height={48}
        />
      </Modal>

      {/* Delete Modal */}
      <Modal
        open={deleteModalOpen}
        onCancel={() => {
          setDeleteModalOpen(false);
          setSelectedCountry(null);
        }}
        onSubmit={handleDeleteSubmit}
        title="Ջնջել երկիրը"
        submitButtonText="Ջնջել"
        closeButtonText="Չեղարկել"
      >
        <p>
          Վստա՞հ եք, որ ցանկանում եք ջնջել "{selectedCountry?.name}" երկիրը:
        </p>
      </Modal>
    </div>
  );
};
