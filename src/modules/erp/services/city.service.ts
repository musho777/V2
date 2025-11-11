import { erpApiClient } from './api.config';

export interface City {
  id: number;
  name: string;
}

export interface CityCreateDto {
  name: string;
  region: {
    id: number;
    name: string;
  };
}

export interface CityUpdateDto {
  name: string;
  region: {
    id: number;
    name: string;
  };
}

export const cityService = {
  getAll: async (regionId: number): Promise<City[]> => {
    return erpApiClient.get(`/city?regionId=${regionId}`);
  },

  create: async (data: CityCreateDto): Promise<City> => {
    return erpApiClient.post('/city/add', data);
  },

  update: async (id: number, data: CityUpdateDto): Promise<City> => {
    return erpApiClient.put(`/city/update?id=${id}`, data);
  },

  delete: async (id: number): Promise<void> => {
    return erpApiClient.delete(`/city?id=${id}`);
  },
};
