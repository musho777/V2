import type { Observable } from 'rxjs';

import { httpService } from './api.config';
import type { City, CityCreateDto } from './city.service';

/**
 * Observable-based City Service using RxJS
 */
export const cityServiceObservable = {
  /**
   * Get all cities by region ID
   */
  getAll: (regionId: number): Observable<City[]> => {
    return httpService.get<City[]>(`/city/get-all?regionId=${regionId}`);
  },

  /**
   * Create new city
   */
  create: (data: CityCreateDto): Observable<City> => {
    return httpService.post<City>('/city/add', data);
  },

  /**
   * Update city
   */
  update: (id: number, data: CityCreateDto): Observable<City> => {
    return httpService.put<City>(`/city/update/${id}`, data);
  },

  /**
   * Delete city
   */
  delete: (id: number): Observable<void> => {
    return httpService.delete<void>(`/city/delete/${id}`);
  },
};
