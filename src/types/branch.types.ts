export interface Branch {
  id: number;
  name: string;
  description: string;
  branchHeadId: number;
  branchHeadName: string;
  departmentId?: number;
  regionIds?: number[];
  countOfRegions: number;
  countOfTeams: number;
  status: boolean;
  deletedAt: number | null;
}

export interface BranchesResponse {
  content: Branch[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  numberOfElements: number;
  size: number;
  number: number;
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  first: boolean;
  empty: boolean;
}

export interface BranchesParams {
  page: number;
  size: number;
  departmentId?: number;
}

export interface CreateBranchRequest {
  name: string;
  description: string;
  status: boolean;
  department: {
    id: number;
    departmentHead: {
      id: number;
    };
  };
  branchHead: {
    id: number;
    role: {
      id: number;
      role: string;
    };
  };
  regions: Array<{
    id: number;
  }>;
}
