export interface FormData {
  name: string;
}

export interface RegionFormData {
  name: string;
  countryId: number;
}

export interface CityFormData {
  name: string;
  regionId: number;
}

export type AddressTab =
  | 'country'
  | 'region'
  | 'city'
  | 'street'
  | 'district'
  | 'building';

export interface ModalState {
  country: boolean;
  region: boolean;
  city: boolean;
  street: boolean;
  district: boolean;
  building: boolean;
}

export interface TabRefreshHandlers {
  country: () => void;
  street: () => void;
  district: () => void;
  building: () => void;
}
