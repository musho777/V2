import { erpApiClient } from './api.config';

export interface AdministrativeDistrict {
  id: number;
  name: string;
}

export interface AdministrativeDistrictCreateDto {
  name: string;
  city: {
    id: number;
    name: string;
  };
}

export interface AdministrativeDistrictUpdateDto {
  name: string;
  city: {
    id: number;
    name: string;
  };
}

export const administrativeDistrictService = {
  getAll: async (cityId: number): Promise<AdministrativeDistrict[]> => {
    return erpApiClient.get(`/administrative-district?cityId=${cityId}`);
  },

  create: async (
    data: AdministrativeDistrictCreateDto,
  ): Promise<AdministrativeDistrict> => {
    return erpApiClient.post('/administrative-district/add', data);
  },

  update: async (
    id: number,
    data: AdministrativeDistrictUpdateDto,
  ): Promise<AdministrativeDistrict> => {
    return erpApiClient.put(`/administrative-district/update?id=${id}`, data);
  },

  delete: async (id: number): Promise<void> => {
    return erpApiClient.delete(`/administrative-district?id=${id}`);
  },
};
