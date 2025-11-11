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
import type { Building } from '../../services/building.service';
import { buildingService } from '../../services/building.service';
import type { Street } from '../../services/street.service';
import { streetService } from '../../services/street.service';

import styles from './TabContent.module.scss';

interface BuildingTabProps {
  onCreateClick: () => void;
}

export const BuildingTab = forwardRef<
  { refresh: () => void },
  BuildingTabProps
>(({ onCreateClick }, ref) => {
  const {
    countries,
    loading: countriesLoading,
    fetchCountries,
  } = useCountries();
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCountryId, setSelectedCountryId] = useState<number | null>(
    null,
  );
  const [selectedRegionId, setSelectedRegionId] = useState<number | null>(null);
  const [selectedCityId, setSelectedCityId] = useState<number | null>(null);
  const [selectedStreetId, setSelectedStreetId] = useState<number | null>(null);
  const [selectedDistrictId, setSelectedDistrictId] = useState<number | null>(
    null,
  );
  const [streets, setStreets] = useState<Street[]>([]);
  const [streetsLoading, setStreetsLoading] = useState(false);
  const [districts, setDistricts] = useState<AdministrativeDistrict[]>([]);
  const [districtsLoading, setDistrictsLoading] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedBuilding, setSelectedBuilding] = useState<Building | null>(
    null,
  );
  const [editFormData, setEditFormData] = useState({
    name: '',
    streetId: 0,
    districtId: 0,
    comment: '',
  });
  const { regions, loading: regionsLoading } = useRegions(selectedCountryId);
  const { cities, loading: citiesLoading } = useCities(selectedRegionId);

  const fetchBuildings = async (streetId: number) => {
    try {
      setLoading(true);
      const data = await buildingService.getAll(streetId);
      setBuildings(data);
    } catch (error) {
      console.error('Failed to fetch buildings:', error);
      setBuildings([]);
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

  const handleStreetChange = (value: number) => {
    setSelectedStreetId(value);
    fetchBuildings(value);
  };

  const handleEdit = (building: Building) => {
    setSelectedBuilding(building);
    setEditFormData({
      name: building.name,
      streetId: selectedStreetId || 0,
      districtId: selectedDistrictId || 0,
      comment: building.comment || '',
    });
    setEditModalOpen(true);
  };

  const handleDelete = (building: Building) => {
    setSelectedBuilding(building);
    setDeleteModalOpen(true);
  };

  const handleEditSubmit = async () => {
    if (!selectedBuilding || !selectedStreetId) return;

    setEditModalOpen(false);
    setSelectedBuilding(null);
    setEditFormData({ name: '', streetId: 0, districtId: 0, comment: '' });

    try {
      const street = streets.find((s) => s.id === editFormData.streetId);
      const district = districts.find((d) => d.id === editFormData.districtId);
      await buildingService.update(selectedBuilding.id, {
        name: editFormData.name,
        street: {
          id: editFormData.streetId,
          name: street?.name || '',
        },
        administrativeDistrict: {
          id: editFormData.districtId,
          name: district?.name || '',
        },
        comment: editFormData.comment,
      });
      await fetchBuildings(selectedStreetId);
    } catch (error) {
      console.error('Failed to update building:', error);
      await fetchBuildings(selectedStreetId);
    }
  };

  const handleDeleteSubmit = async () => {
    if (!selectedBuilding || !selectedStreetId) return;

    setDeleteModalOpen(false);
    setSelectedBuilding(null);

    try {
      await buildingService.delete(selectedBuilding.id);
      await fetchBuildings(selectedStreetId);
    } catch (error) {
      console.error('Failed to delete building:', error);
      await fetchBuildings(selectedStreetId);
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
    setBuildings([]);
  };

  useImperativeHandle(ref, () => ({
    refresh: () => {
      if (selectedStreetId) {
        fetchBuildings(selectedStreetId);
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
          onChange={setSelectedCityId}
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
          onChange={handleStreetChange}
          value={selectedStreetId}
          onDropdownVisibleChange={(open) => {
            if (open && selectedCityId) {
              void fetchStreets(selectedCityId);
            }
          }}
        />
        <Select
          placeholder="Ընտրել Վարչական շրջանը"
          label="Ընտրել Վարչական շրջանը"
          height={48}
          width={320}
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
        + Ստեղծել շենք/տուն
      </Button>

      {!selectedStreetId ? (
        <div className={styles.emptyState}>
          <p>Ընտրեք փողոցը</p>
        </div>
      ) : loading ? (
        <div className={styles.emptyState}>
          <p>Բեռնվում է...</p>
        </div>
      ) : buildings.length === 0 ? (
        <div className={styles.emptyState}>
          <p>Շենքերի/տների ցուցակ դատարկ է</p>
        </div>
      ) : (
        <div className={styles.countriesGrid}>
          {buildings.map((building) => (
            <Card key={building.id} className={styles.countryCard}>
              <div className={styles.countryCardContent}>
                <span className={styles.countryName}>{building.name}</span>
                <div className={styles.countryActions}>
                  <ErpEditIcon
                    className={styles.actionIcon}
                    onClick={() => handleEdit(building)}
                  />
                  <ErpDeleteIcon
                    className={styles.actionIcon}
                    onClick={() => handleDelete(building)}
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
          setSelectedBuilding(null);
          setEditFormData({
            name: '',
            streetId: 0,
            districtId: 0,
            comment: '',
          });
        }}
        onSubmit={handleEditSubmit}
        title="Խմբագրել շենքը/տունը"
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
          value={selectedCityId}
          disabled
        />
        <Select
          placeholder="Ընտրել փողոցը"
          label="Ընտրել փողոցը"
          height={48}
          width={320}
          style={{ marginBottom: '16px' }}
          options={streets.map((street) => ({
            value: street.id,
            label: street.name,
          }))}
          value={editFormData.streetId}
          onChange={(value) =>
            setEditFormData({ ...editFormData, streetId: value })
          }
        />
        <Select
          placeholder="Ընտրել վարչական շրջանը"
          label="Ընտրել վարչական շրջանը"
          height={48}
          width={320}
          style={{ marginBottom: '16px' }}
          options={districts.map((district) => ({
            value: district.id,
            label: district.name,
          }))}
          value={editFormData.districtId}
          onChange={(value) =>
            setEditFormData({ ...editFormData, districtId: value })
          }
        />
        <Input
          label="Անվանում"
          placeholder="Մուտքագրեք շենքի/տան անվանումը"
          value={editFormData.name}
          onChange={(e) =>
            setEditFormData({ ...editFormData, name: e.target.value })
          }
          height={48}
          style={{ marginBottom: '16px' }}
        />
        <Input
          label="Մեկնաբանություն"
          placeholder="Մուտքագրեք մեկնաբանություն"
          value={editFormData.comment}
          onChange={(e) =>
            setEditFormData({ ...editFormData, comment: e.target.value })
          }
          height={48}
        />
      </Modal>

      {/* Delete Modal */}
      <Modal
        open={deleteModalOpen}
        onCancel={() => {
          setDeleteModalOpen(false);
          setSelectedBuilding(null);
        }}
        onSubmit={handleDeleteSubmit}
        title="Ջնջել շենքը/տունը"
        submitButtonText="Ջնջել"
        closeButtonText="Չեղարկել"
      >
        <p>
          Վստա՞հ եք, որ ցանկանում եք ջնջել "{selectedBuilding?.name}"
          շենքը/տունը:
        </p>
      </Modal>
    </div>
  );
});

BuildingTab.displayName = 'BuildingTab';
