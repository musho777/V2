export interface ProjectType {
  id: number;
  name: string;
  description: string;
  status: boolean;
}

export interface ProjectTypeTableRow {
  key: string;
  id: number;
  name: string;
  description: string;
  status: 'Active' | 'Disabled';
}

export interface ProjectTypesResponse {
  content: ProjectType[];
  totalElements: number;
  totalPages: number;
  last: boolean;
  numberOfElements: number;
  size: number;
  number: number;
  first: boolean;
  empty: boolean;
}

export interface ProjectTypesQueryParams {
  name?: string;
  status?: boolean;
  page?: number;
  size?: number;
  sort?: string | string[];
}

export type ProjectTypeFilters = Omit<
  ProjectTypesQueryParams,
  'page' | 'size' | 'sort'
>;

export interface FilterProps {
  onFilterChange: (filters: ProjectTypeFilters) => void;
  onReset: () => void;
  onCreateSuccess?: () => void;
}

export interface CreateProjectTypeRequest {
  name: string;
  description?: string;
  status: boolean;
}

export interface UpdateProjectTypeRequest {
  id: number;
  name: string;
  description?: string;
}

export interface CreateEditProjectTypeProps {
  onSuccess?: () => void;
  editProjectType?: ProjectType | null;
  editModalOpen?: boolean;
  onEditClose?: () => void;
}
