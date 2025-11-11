import { useCallback, useEffect, useState } from 'react';

import { cityService } from '../services/city.service';
import type { Country } from '../services/country.service';
import { countryService } from '../services/country.service';
import { regionService } from '../services/region.service';
import type {
  AddressTab,
  CityFormData,
  FormData,
  ModalState,
  RegionFormData,
} from '../types/address.types';

export const useAddressAdd = () => {
  // Active tab state with localStorage persistence
  const [activeTab, setActiveTab] = useState<AddressTab>(() => {
    if (typeof window !== 'undefined') {
      return (
        (localStorage.getItem('address-add-active-tab') as AddressTab) ||
        'country'
      );
    }
    return 'country';
  });

  // Modal states
  const [modals, setModals] = useState<ModalState>({
    country: false,
    region: false,
    city: false,
    street: false,
    district: false,
    building: false,
  });

  // Form data states
  const [countryFormData, setCountryFormData] = useState<FormData>({
    name: '',
  });

  const [regionFormData, setRegionFormData] = useState<RegionFormData>({
    name: '',
    countryId: 0,
  });

  const [cityFormData, setCityFormData] = useState<CityFormData>({
    name: '',
    regionId: 0,
  });

  const [buildingFormData, setBuildingFormData] = useState<FormData>({
    name: '',
  });

  // Countries state
  const [countries, setCountries] = useState<Country[]>([]);

  // Refresh trigger for tabs
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Persist active tab to localStorage
  useEffect(() => {
    localStorage.setItem('address-add-active-tab', activeTab);
  }, [activeTab]);

  // Fetch countries on mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const data = await countryService.getAll();
        setCountries(data);
      } catch (error) {
        console.error('Failed to fetch countries:', error);
      }
    };
    fetchCountries();
  }, []);

  // Modal open/close handlers
  const openModal = useCallback((modal: keyof ModalState) => {
    setModals((prev) => ({ ...prev, [modal]: true }));
  }, []);

  const closeModal = useCallback((modal: keyof ModalState) => {
    setModals((prev) => ({ ...prev, [modal]: false }));
  }, []);

  // Country handlers
  const handleCountryChange = useCallback((value: string) => {
    setCountryFormData({ name: value });
  }, []);

  const handleCountrySubmit = useCallback(async () => {
    closeModal('country');
    const tempData = { ...countryFormData };
    setCountryFormData({ name: '' });

    try {
      await countryService.create(tempData.name);
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      console.error('Failed to create country:', error);
      setRefreshTrigger((prev) => prev + 1);
    }
  }, [countryFormData, closeModal]);

  const handleCountryCancel = useCallback(() => {
    closeModal('country');
    setCountryFormData({ name: '' });
  }, [closeModal]);

  // Region handlers
  const handleRegionNameChange = useCallback((value: string) => {
    setRegionFormData((prev) => ({ ...prev, name: value }));
  }, []);

  const handleRegionCountryChange = useCallback((value: number) => {
    setRegionFormData((prev) => ({ ...prev, countryId: value }));
  }, []);

  const handleRegionSubmit = useCallback(async () => {
    closeModal('region');
    const tempFormData = { ...regionFormData };
    setRegionFormData({ name: '', countryId: 0 });

    try {
      const country = countries.find((c) => c.id === tempFormData.countryId);
      await regionService.create({
        name: tempFormData.name,
        country: {
          id: tempFormData.countryId,
          name: country?.name || '',
        },
      });
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      console.error('Failed to create region:', error);
      setRefreshTrigger((prev) => prev + 1);
    }
  }, [regionFormData, countries, closeModal]);

  const handleRegionCancel = useCallback(() => {
    closeModal('region');
    setRegionFormData({ name: '', countryId: 0 });
  }, [closeModal]);

  // City handlers
  const handleCityNameChange = useCallback((value: string) => {
    setCityFormData((prev) => ({ ...prev, name: value }));
  }, []);

  const handleCityRegionChange = useCallback((value: number) => {
    setCityFormData((prev) => ({ ...prev, regionId: value }));
  }, []);

  const handleCitySubmit = useCallback(async () => {
    closeModal('city');
    const tempFormData = { ...cityFormData };
    setCityFormData({ name: '', regionId: 0 });

    try {
      const region = await regionService
        .getAll(1)
        .then((regions) => regions.find((r) => r.id === tempFormData.regionId));
      await cityService.create({
        name: tempFormData.name,
        region: {
          id: tempFormData.regionId,
          name: region?.name || '',
        },
      });
      setRefreshTrigger((prev) => prev + 1);
    } catch (error) {
      console.error('Failed to create city:', error);
      setRefreshTrigger((prev) => prev + 1);
    }
  }, [cityFormData, closeModal]);

  const handleCityCancel = useCallback(() => {
    closeModal('city');
    setCityFormData({ name: '', regionId: 0 });
  }, [closeModal]);

  // Tab change handler
  const handleTabChange = useCallback((key: string) => {
    setActiveTab(key as AddressTab);
  }, []);

  return {
    // State
    activeTab,
    modals,
    countryFormData,
    regionFormData,
    cityFormData,
    buildingFormData,
    countries,
    refreshTrigger,

    // Actions
    openModal,
    closeModal,
    handleTabChange,

    // Country
    handleCountryChange,
    handleCountrySubmit,
    handleCountryCancel,

    // Region
    handleRegionNameChange,
    handleRegionCountryChange,
    handleRegionSubmit,
    handleRegionCancel,

    // City
    handleCityNameChange,
    handleCityRegionChange,
    handleCitySubmit,
    handleCityCancel,
  };
};
