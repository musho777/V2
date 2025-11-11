import type { Observable } from 'rxjs';

import { httpService } from './api.config';
import type { Country } from './country.service';

/**
 * Observable-based Country Service using RxJS
 */
export const countryServiceObservable = {
  /**
   * Get all countries
   */
  getAll: (): Observable<Country[]> => {
    return httpService.get<Country[]>('/country/get-all');
  },

  /**
   * Create new country
   */
  create: (name: string): Observable<Country> => {
    return httpService.post<Country>('/country/add', { name });
  },

  /**
   * Update country
   */
  update: (id: number, name: string): Observable<Country> => {
    return httpService.put<Country>(`/country/update/${id}`, { name });
  },

  /**
   * Delete country
   */
  delete: (id: number): Observable<void> => {
    return httpService.delete<void>(`/country/delete/${id}`);
  },
};
