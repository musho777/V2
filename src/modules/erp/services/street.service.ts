import { erpApiClient } from './api.config';

export interface Street {
  id: number;
  name: string;
}

export interface StreetCreateDto {
  name: string;
  city: {
    id: number;
    name: string;
  };
}

export interface StreetUpdateDto {
  name: string;
  city: {
    id: number;
    name: string;
  };
}

export const streetService = {
  getAll: async (cityId: number, name?: string): Promise<Street[]> => {
    const params = new URLSearchParams({ cityId: cityId.toString() });
    if (name) {
      params.append('name', name);
    }
    return erpApiClient.get(`/street?${params.toString()}`);
  },

  create: async (data: StreetCreateDto): Promise<Street> => {
    return erpApiClient.post('/street/add', data);
  },

  update: async (id: number, data: StreetUpdateDto): Promise<Street> => {
    return erpApiClient.put(`/street/update?id=${id}`, data);
  },

  delete: async (id: number): Promise<void> => {
    return erpApiClient.delete(`/street?id=${id}`);
  },
};
