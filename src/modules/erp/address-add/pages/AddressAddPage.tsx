'use client';

import { useRef } from 'react';

import { PageTabs } from '@/components/PageTabs';

import { useAddressAdd } from '../../hooks/useAddressAdd';
import { BuildingModal } from '../Modals/BuildingModal';
import { CityModal } from '../Modals/CityModal';
import { CountryModal } from '../Modals/CountryModal';
import { DistrictModal } from '../Modals/DistrictModal';
import { RegionModal } from '../Modals/RegionModal';
import { StreetModal } from '../Modals/StreetModal';
import { BuildingTab } from '../Tabs/BuildingTab';
import { CityTab } from '../Tabs/CityTab';
import { CountryTab } from '../Tabs/CountryTab';
import { DistrictTab } from '../Tabs/DistrictTab';
import { RegionTab } from '../Tabs/RegionTab';
import { StreetTab } from '../Tabs/StreetTab';

import styles from './AddressAddPage.module.scss';

export default function AddressAddPage() {
  const {
    activeTab,
    modals,
    countryFormData,
    regionFormData,
    cityFormData,
    refreshTrigger,
    openModal,
    closeModal,
    handleTabChange,
    handleCountryChange,
    handleCountrySubmit,
    handleCountryCancel,
    handleRegionNameChange,
    handleRegionCountryChange,
    handleRegionSubmit,
    handleRegionCancel,
    handleCityNameChange,
    handleCityRegionChange,
    handleCitySubmit,
    handleCityCancel,
  } = useAddressAdd();

  const streetTabRef = useRef<{ refresh: () => void }>(null);
  const districtTabRef = useRef<{ refresh: () => void }>(null);
  const buildingTabRef = useRef<{ refresh: () => void }>(null);

  const handleStreetSuccess = () => {
    streetTabRef.current?.refresh();
  };

  const handleDistrictSuccess = () => {
    districtTabRef.current?.refresh();
  };

  const handleBuildingSuccess = () => {
    buildingTabRef.current?.refresh();
  };

  const tabs = [
    {
      key: 'country',
      label: 'Երկիր',
      children: (
        <CountryTab
          key={refreshTrigger}
          onCreateClick={() => openModal('country')}
        />
      ),
    },
    {
      key: 'region',
      label: 'Շրջան',
      children: <RegionTab onCreateClick={() => openModal('region')} />,
    },
    {
      key: 'city',
      label: 'Քաղաք/Գյուղ',
      children: <CityTab onCreateClick={() => openModal('city')} />,
    },
    {
      key: 'street',
      label: 'Փողոց',
      children: (
        <StreetTab
          ref={streetTabRef}
          onCreateClick={() => openModal('street')}
        />
      ),
    },
    {
      key: 'district',
      label: 'Վարչական շրջան',
      children: (
        <DistrictTab
          ref={districtTabRef}
          onCreateClick={() => openModal('district')}
        />
      ),
    },
    {
      key: 'building',
      label: 'Շենք/տուն',
      children: (
        <BuildingTab
          ref={buildingTabRef}
          onCreateClick={() => openModal('building')}
        />
      ),
    },
  ];

  return (
    <div className={styles.addressAddPage}>
      <div className={styles.pageWrapper}>
        <PageTabs
          tabs={tabs}
          activeKey={activeTab}
          onChange={handleTabChange}
        />

        <CountryModal
          open={modals.country}
          onCancel={handleCountryCancel}
          onSubmit={handleCountrySubmit}
          formData={countryFormData}
          onChange={(e) => handleCountryChange(e.target.value)}
        />

        <RegionModal
          open={modals.region}
          onCancel={handleRegionCancel}
          onSubmit={handleRegionSubmit}
          formData={regionFormData}
          onChange={(e) => handleRegionNameChange(e.target.value)}
          onCountryChange={handleRegionCountryChange}
        />

        <CityModal
          open={modals.city}
          onCancel={handleCityCancel}
          onSubmit={handleCitySubmit}
          formData={cityFormData}
          onChange={(e) => handleCityNameChange(e.target.value)}
          onRegionChange={handleCityRegionChange}
        />

        <StreetModal
          open={modals.street}
          onCancel={() => closeModal('street')}
          onSuccess={handleStreetSuccess}
        />

        <DistrictModal
          open={modals.district}
          onCancel={() => closeModal('district')}
          onSuccess={handleDistrictSuccess}
        />

        <BuildingModal
          open={modals.building}
          onCancel={() => closeModal('building')}
          onSuccess={handleBuildingSuccess}
        />
      </div>
    </div>
  );
}
