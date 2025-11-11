// Common archive item interface
export interface ArchivedItem {
  id: number;
  name: string;
  archivedBy: string;
  archivedDate: string;
  archivedAt: number;
}

// Archived Department
export interface ArchivedDepartment extends ArchivedItem {
  description: string;
  departmentHeadName: string;
  countOfBranches: number;
}

// Archived Branch
export interface ArchivedBranch extends ArchivedItem {
  description: string;
  branchHeadName: string;
  departmentName: string;
  countOfRegions: number;
  countOfTeams: number;
}

// Archived Team
export interface ArchivedTeam extends ArchivedItem {
  description: string;
  teamLeadName: string;
  branchName: string;
  memberCount: number;
}

// Archived User
export interface ArchivedUser extends ArchivedItem {
  email: string;
  phone: string;
  role: string;
  department?: string;
  branch?: string;
}

// Paginated response for archive items
export interface ArchiveResponse<T> {
  content: T[];
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

// Query params for archive endpoints
export interface ArchiveQueryParams {
  timezone?: string;
  search?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  size?: number;
  sort?: string[];
}

// Archive type enum
export enum ArchiveType {
  DEPARTMENTS = 'departments',
  BRANCHES = 'branches',
  TEAMS = 'teams',
  USERS = 'users',
}
