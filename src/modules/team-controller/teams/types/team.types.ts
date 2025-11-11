export interface Team {
  id: number;
  name: string;
  description: string;
  branchHeadName: string;
  status: boolean;
}

export interface TeamTableRow {
  key: string;
  name: string;
  description: string;
  branchHeadName: string;
  status: 'Active' | 'Disabled';
}

export interface TeamsResponse {
  content: Team[];
  totalElements: number;
  totalPages: number;
  last: boolean;
  numberOfElements: number;
  size: number;
  number: number;
  first: boolean;
  empty: boolean;
}

export interface TeamsQueryParams {
  page?: number;
  size?: number;
  sort?: string;
}
export interface TeamsQueryParamsApi {
  name?: string;
  status?: boolean;
  page?: number;
  size?: number;
  sort?: string | string[];
}

export type TeamFilters = Omit<TeamsQueryParams, 'page' | 'size' | 'sort'>;

export interface FilterProps {
  onFilterChange: (filters: TeamFilters) => void;
  onReset: () => void;
}

export interface TeamSearchData {
  size: number;
  page: number;
  name: string;
  status?: boolean;
}

export interface TeamLead {
  id: number;
  name: string;
  role?: {
    id: number;
    role: string;
    default: boolean;
  };
}

export interface CreateTeamProps {
  onSuccess?: () => void;
  teamId?: string | null;
  mode?: 'create' | 'edit';
  open?: boolean;
  onClose?: () => void;
}

export interface CreateTeamData {
  id?: number;
  name: string;
  description: string;
  status: boolean;
  teamLead: {
    id: number;
    role: {
      id: number;
      role: string;
      default: boolean;
    };
  };
  timezone: {
    id: number;
    name: string;
  };
  department: {
    id: number;
    departmentHead?: {
      id: number;
      role: {
        id: number;
        role: string;
        default: boolean;
      };
    };
  };
}
