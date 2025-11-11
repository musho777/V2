export interface Team {
  id: number;
  name: string;
  description: string | null;
  branchHeadId: number;
  branchHeadName: string;
  members: unknown[];
  countOfDistricts: number;
  status: boolean;
  deletedAt: number | null;
}

export interface PageableSort {
  sorted: boolean;
  unsorted: boolean;
  empty: boolean;
}

export interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: PageableSort;
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

export interface TeamsResponse {
  content: Team[];
  pageable: Pageable;
  totalElements: number;
  totalPages: number;
  last: boolean;
  numberOfElements: number;
  size: number;
  number: number;
  sort: PageableSort;
  first: boolean;
  empty: boolean;
}

export interface TeamsParams {
  page: number;
  size: number;
}

export interface CreateTeamRequest {
  name: string;
  description: string;
  status: boolean;
  teamHead: {
    id: number;
  };
}
