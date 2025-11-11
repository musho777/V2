export interface Department {
  id: number;
  name: string;
  description: string;
  departmentHeadId: number;
  departmentHeadName: string;
  countOfBranches: number;
  status: boolean;
  deletedAt: number | null;
}

export interface DepartmentsQueryParams {
  page?: number;
  size?: number;
}

export interface CreateDepartmentRequest {
  name: string;
  description: string;
  status: boolean;
  departmentHead: {
    id: number;
  };
}

export interface DepartmentsResponse {
  content: Department[];
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
