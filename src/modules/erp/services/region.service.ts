import { erpApiClient } from './api.config';

export interface Region {
  id: number;
  name: string;
}

export interface RegionCreateDto {
  name: string;
  country: {
    id: number;
    name: string;
  };
}

export interface RegionUpdateDto {
  name: string;
  country: {
    id: number;
    name: string;
  };
}

export const regionService = {
  getAll: async (countryId: number): Promise<Region[]> => {
    return erpApiClient.get(`/region?countryId=${countryId}`);
  },

  create: async (data: RegionCreateDto): Promise<Region> => {
    return erpApiClient.post('/region/add', data);
  },

  update: async (id: number, data: RegionUpdateDto): Promise<Region> => {
    return erpApiClient.put(`/region/update?id=${id}`, data);
  },

  delete: async (id: number): Promise<void> => {
    return erpApiClient.delete(`/region?id=${id}`);
  },
};
