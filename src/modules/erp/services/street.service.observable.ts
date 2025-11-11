import type { Observable } from 'rxjs';

import { httpService } from './api.config';
import type { Street, StreetCreateDto } from './street.service';

/**
 * Observable-based Street Service using RxJS
 */
export const streetServiceObservable = {
  /**
   * Get all streets by city ID
   */
  getAll: (cityId: number): Observable<Street[]> => {
    return httpService.get<Street[]>(`/street/get-all?cityId=${cityId}`);
  },

  /**
   * Create new street
   */
  create: (data: StreetCreateDto): Observable<Street> => {
    return httpService.post<Street>('/street/add', data);
  },

  /**
   * Update street
   */
  update: (id: number, data: StreetCreateDto): Observable<Street> => {
    return httpService.put<Street>(`/street/update/${id}`, data);
  },

  /**
   * Delete street
   */
  delete: (id: number): Observable<void> => {
    return httpService.delete<void>(`/street/delete/${id}`);
  },
};
