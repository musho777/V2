import type { Observable } from 'rxjs';

import { httpService } from './api.config';
import type { Building, BuildingCreateDto } from './building.service';

/**
 * Observable-based Building Service using RxJS
 */
export const buildingServiceObservable = {
  /**
   * Get all buildings by street ID
   */
  getAll: (streetId: number): Observable<Building[]> => {
    return httpService.get<Building[]>(
      `/building/get-all?streetId=${streetId}`,
    );
  },

  /**
   * Create new building
   */
  create: (data: BuildingCreateDto): Observable<Building> => {
    return httpService.post<Building>('/building/add', data);
  },

  /**
   * Update building
   */
  update: (id: number, data: BuildingCreateDto): Observable<Building> => {
    return httpService.put<Building>(`/building/update/${id}`, data);
  },

  /**
   * Delete building
   */
  delete: (id: number): Observable<void> => {
    return httpService.delete<void>(`/building/delete/${id}`);
  },
};
