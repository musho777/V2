export interface Project {
  id?: number;
  name?: string;
  description?: string;
  projectTypeId?: number;
  projectTypeName?: string;
  projectOwnerId?: number;
  projectOwnerName?: string;
  status?: boolean;
  color?: string;
}

export interface ProjectTableRow {
  key: string;
  id: number;
  name: string;
  description: string;
  projectTypeName: string;
  status: 'Active' | 'Disabled';
}

export interface ProjectsResponse {
  content: Project[];
  totalElements: number;
  totalPages: number;
  last: boolean;
  numberOfElements: number;
  size: number;
  number: number;
  first: boolean;
  empty: boolean;
}

export interface ProjectsQueryParams {
  page?: number;
  size?: number;
  sort?: string;
}

export interface ProjectsQueryParamsForApi {
  page?: number;
  size?: number;
  name?: string;
  status?: string;
  sort?: string;
}

export type ProjectFilters = Omit<
  ProjectsQueryParams,
  'page' | 'size' | 'sort'
>;

export interface FilterProps {
  onFilterChange: (filters: ProjectFilters) => void;
  onReset: () => void;
}

export interface ProjectSearchData {
  size: number;
  page: number;
  name: string;
  status?: boolean;
}
export interface ApiErrorResponse {
  message: string;
}

export interface CreateProjectProps {
  onSuccess?: () => void;
  editProject?: Project | null;
  editModalOpen?: boolean;
  onEditClose?: () => void;
  onUpdateSuccess?: () => void;
}
