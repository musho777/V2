export interface SearchFormParams {
  id: string;
  name: string;
  streetId: number | null;
  buildingId: number | null;
  flat: string;
  phoneNumber: string;
}

export interface SearchParams {
  name?: string;
  streetId?: number;
  buildingId?: number;
  flat?: number;
  phoneNumber?: string;
  page?: number;
  size?: number;
}

export interface PaginationState {
  current: number;
  pageSize: number;
  total: number;
}
