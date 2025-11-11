export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: string;
  occupation: string | null;
  status: 'Active' | 'Inactive';
  accessToAction: boolean;
  accessToRead: boolean;
  waitingApproval: boolean;
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

export interface UsersResponse {
  content: User[];
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

export interface UsersQueryParams {
  page?: number;
  size?: number;
}

export interface UserStatus {
  status: string;
}

export type UserStatusesResponse = UserStatus[];

export interface Role {
  id: number;
  name: string;
  status: boolean;
}

export type RolesResponse = Role[];

export interface Occupation {
  id: number;
  name: string;
}

export type OccupationsResponse = Occupation[];

export interface DepartmentHead {
  id: number;
  name: string;
}

export type DepartmentHeadsResponse = DepartmentHead[];

export interface BranchHead {
  id: number;
  name: string;
}

export type BranchHeadsResponse = BranchHead[];

export interface Timezone {
  id: number;
  name: string;
}

export type TimezonesResponse = Timezone[];

export interface Holiday {
  id: number;
  name: string;
}

export type HolidaysResponse = Holiday[];

export interface OfficeLocation {
  id: number;
  name: string;
}

export type OfficeLocationsResponse = OfficeLocation[];

export interface Commission {
  id: number;
  name: string;
}

export type CommissionsResponse = Commission[];

export interface MoneyUnit {
  id: number;
  name: string;
  code: string;
}

export type MoneyUnitsResponse = MoneyUnit[];

export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  privilege: {
    id: number;
  };
  role: {
    id: number;
    role: string;
    default: boolean;
  };
  email: string;
  phoneNumber: string;
  occupation: {
    id: number;
  };
  commission: {
    id: number;
  };
  calendarOfHolidays: {
    id: number;
  };
  officeLocation: {
    id: number;
  };
  timezone: {
    id: number;
    name: string;
  };
  emailVerifyUrl: string;
}

export interface CreateUserResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: string;
  occupation: string | null;
  status: 'Active' | 'Inactive';
}
