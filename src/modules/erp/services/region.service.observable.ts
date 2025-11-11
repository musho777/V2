import type { Observable } from 'rxjs';

import { httpService } from './api.config';
import type { Region, RegionCreateDto } from './region.service';

/**
 * Observable-based Region Service using RxJS
 */
export const regionServiceObservable = {
  /**
   * Get all regions by country ID
   */
  getAll: (countryId: number): Observable<Region[]> => {
    return httpService.get<Region[]>(`/region/get-all?countryId=${countryId}`);
  },

  /**
   * Create new region
   */
  create: (data: RegionCreateDto): Observable<Region> => {
    return httpService.post<Region>('/region/add', data);
  },

  /**
   * Update region
   */
  update: (id: number, data: RegionCreateDto): Observable<Region> => {
    return httpService.put<Region>(`/region/update/${id}`, data);
  },

  /**
   * Delete region
   */
  delete: (id: number): Observable<void> => {
    return httpService.delete<void>(`/region/delete/${id}`);
  },
};
