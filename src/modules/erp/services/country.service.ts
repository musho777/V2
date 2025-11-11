import { erpApiClient } from './api.config';

export interface Country {
  id: number;
  name: string;
}

export const countryService = {
  getAll: async (): Promise<Country[]> => {
    return erpApiClient.get('/country');
  },

  create: async (name: string): Promise<Country> => {
    return erpApiClient.post('/country/add', { name });
  },

  update: async (id: number, name: string): Promise<Country> => {
    return erpApiClient.put(`/country/update?id=${id}`, { name });
  },

  delete: async (id: number): Promise<void> => {
    return erpApiClient.delete(`/country?id=${id}`);
  },
};
