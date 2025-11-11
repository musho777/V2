import { erpApiClient } from './api.config';

export interface Building {
  id: number;
  name: string;
  comment?: string;
}

export interface BuildingCreateDto {
  name: string;
  street: {
    id: number;
    name: string;
  };
  administrativeDistrict: {
    id: number;
    name: string;
  };
  comment?: string;
}

export interface BuildingUpdateDto {
  name: string;
  street: {
    id: number;
    name: string;
  };
  administrativeDistrict: {
    id: number;
    name: string;
  };
  comment?: string;
}

export const buildingService = {
  getAll: async (streetId: number): Promise<Building[]> => {
    return erpApiClient.get(`/building?streetId=${streetId}`);
  },

  create: async (data: BuildingCreateDto): Promise<Building> => {
    return erpApiClient.post('/building/add', data);
  },

  update: async (id: number, data: BuildingUpdateDto): Promise<Building> => {
    return erpApiClient.put(`/building/update?id=${id}`, data);
  },

  delete: async (id: number): Promise<void> => {
    return erpApiClient.delete(`/building?id=${id}`);
  },
};
