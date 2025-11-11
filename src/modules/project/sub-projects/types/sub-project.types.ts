export interface SubProject {
  id: number;
  name: string;
  description: string;
  subprojectType: string;
  subprojectTypeName?: string;
  managementType?: string;
  managementTypeName?: string;
  timezone?: {
    id: number;
    name: string;
  };
  startTime?: string;
  endTime?: string;
  status: boolean;
}

export interface SubProjectTableRow {
  key: string;
  id: number;
  name: string;
  description: string;
  subprojectType: string;
  status: 'Active' | 'Disabled';
}

export interface SubProjectsResponse {
  content: SubProject[];
  totalElements: number;
  totalPages: number;
  last: boolean;
  numberOfElements: number;
  size: number;
  number: number;
  first: boolean;
  empty: boolean;
}

export interface SubProjectsQueryParamsApi {
  name?: string;
  status?: boolean;
  page?: number;
  size?: number;
  sort?: string | string[];
}
export interface SubProjectsQueryParams {
  name?: string;
  page?: number;
  size?: number;
  sort?: string;
}

export type SubProjectFilters = Omit<
  SubProjectsQueryParams,
  'page' | 'size' | 'sort'
>;

export interface FilterProps {
  onFilterChange: (filters: SubProjectFilters) => void;
  onReset: () => void;
}

export interface SubProjectSearchData {
  size: number;
  page: number;
  name: string;
  status?: boolean;
}

export interface CreateSubProjectProps {
  onSuccess?: () => void;
  editSubProject?: SubProject | null;
  editModalOpen?: boolean;
  onEditClose?: () => void;
  onUpdateSuccess?: () => void;
}
