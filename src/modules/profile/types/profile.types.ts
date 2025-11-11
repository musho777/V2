export interface UserProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: {
    id: number;
    name: string;
  };
  occupation: {
    id: number;
    name: string;
  } | null;
  timezone: {
    id: number;
    name: string;
  };
  holidays: {
    id: number;
    name: string;
  };
  officeLocation: {
    id: number;
    name: string;
  };
  commission: {
    id: number;
    name: string;
  };
  status: 'Active' | 'Inactive' | 'Pending';
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateUserProfileRequest {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  occupation?: {
    id: number;
  };
  timezone: {
    id: number;
  };
  holidays: {
    id: number;
  };
  officeLocation: {
    id: number;
  };
  commission: {
    id: number;
  };
}
