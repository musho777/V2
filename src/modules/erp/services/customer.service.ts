import { erpApiClient } from './api.config';

export interface Customer {
  id: number;
  name: string;
  serviceAddresses: string;
  phoneNumbers: string;
}

export interface CustomerSearchParams {
  name?: string;
  streetId?: number;
  buildingId?: number;
  flat?: number;
  phoneNumber?: string;
  page?: number;
  size?: number;
  sort?: string[];
}

export interface CustomerSearchResponse {
  content: Customer[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      unsorted: boolean;
      sorted: boolean;
      empty: boolean;
    };
    offset: number;
    unpaged: boolean;
    paged: boolean;
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  numberOfElements: number;
  size: number;
  number: number;
  sort: {
    unsorted: boolean;
    sorted: boolean;
    empty: boolean;
  };
  first: boolean;
  empty: boolean;
}

export interface CustomerCreateDto {
  name: {
    firstName: string;
    lastName: string;
    patronymic: string;
  };
  customerType: {
    id: number;
    name: string;
  };
  passportInfo: {
    type: 'ARMENIAN_PASSPORT' | 'ARMENIAN_ID' | 'FOREIGN_PASSPORT';
    number: string;
    issueDate: string;
    issuerCode: string;
    address: string;
  };
  socialCardNumber?: string;
  notificationAddress?: string;
  location?: string;
  email?: string;
  externalId?: number;
  birthDate?: string;
  taxpayerRegistrationNumber?: string;
  companyName?: string;
  serviceAddresses: Array<{
    building: {
      id: number;
    };
    flat?: number;
    room?: number;
    entrance?: number;
    floor?: number;
    comment?: string;
  }>;
  phoneNumbers: Array<{
    number: string;
    comment?: string;
  }>;
}

export interface CustomerUpdateDto {
  id: number;
  [key: string]: unknown;
}

export const customerService = {
  search: async (
    params: CustomerSearchParams,
  ): Promise<CustomerSearchResponse> => {
    const queryParams = new URLSearchParams();

    // Add pagination params with defaults
    queryParams.append('page', String(params.page ?? 0));
    queryParams.append('size', String(params.size ?? 10));

    // Add optional search params
    if (params.name) {
      queryParams.append('name', params.name);
    }
    if (params.streetId !== undefined) {
      queryParams.append('streetId', String(params.streetId));
    }
    if (params.buildingId !== undefined) {
      queryParams.append('buildingId', String(params.buildingId));
    }
    if (params.flat !== undefined) {
      queryParams.append('flat', String(params.flat));
    }
    if (params.phoneNumber) {
      queryParams.append('phoneNumber', params.phoneNumber);
    }
    if (params.sort && params.sort.length > 0) {
      params.sort.forEach((sortParam) => {
        queryParams.append('sort', sortParam);
      });
    }

    return erpApiClient.get(`/customer/search?${queryParams.toString()}`);
  },

  searchById: async (id: number): Promise<Customer> => {
    return erpApiClient.get(`/customer/search-by-id/${id}`);
  },

  create: async (data: CustomerCreateDto): Promise<Customer> => {
    return erpApiClient.post('/customer/add', data);
  },

  // Update endpoints for customer fields
  updateTaxpayerRegistrationNumber: async (
    id: number,
    taxpayerRegistrationNumber: string,
  ): Promise<void> => {
    return erpApiClient.put(
      `/customer/taxpayer-registration-number?id=${id}&taxpayerRegistrationNumber=${taxpayerRegistrationNumber}`,
      {},
    );
  },

  updateSocialCardNumber: async (
    id: number,
    socialCardNumber: string,
  ): Promise<void> => {
    return erpApiClient.put(
      `/customer/social-card-number?id=${id}&socialCardNumber=${socialCardNumber}`,
      {},
    );
  },

  updateServiceAddresses: async (
    id: number,
    serviceAddresses: Array<{
      building: { id: number };
      flat?: number;
      room?: number;
      entrance?: number;
      floor?: number;
      comment?: string;
    }>,
  ): Promise<void> => {
    return erpApiClient.put(
      `/customer/service-addresses?id=${id}`,
      serviceAddresses,
    );
  },

  updatePhoneNumbers: async (
    id: number,
    phoneNumbers: Array<{
      number: string;
      comment?: string;
    }>,
  ): Promise<void> => {
    return erpApiClient.put(`/customer/phone-numbers?id=${id}`, phoneNumbers);
  },

  updatePassport: async (
    id: number,
    passportInfo: {
      type: 'ARMENIAN_PASSPORT' | 'ARMENIAN_ID' | 'FOREIGN_PASSPORT';
      number: string;
      issueDate: string;
      issuerCode: string;
      address: string;
    },
  ): Promise<void> => {
    return erpApiClient.put(`/customer/passport?id=${id}`, passportInfo);
  },

  updateNotificationAddress: async (
    id: number,
    notificationAddress: string,
  ): Promise<void> => {
    return erpApiClient.put(
      `/customer/notification-address?id=${id}&notificationAddress=${notificationAddress}`,
      {},
    );
  },

  updateName: async (
    id: number,
    name: {
      firstName: string;
      lastName: string;
      patronymic: string;
    },
  ): Promise<void> => {
    return erpApiClient.put(`/customer/name?id=${id}`, name);
  },

  updateLocation: async (id: number, location: string): Promise<void> => {
    return erpApiClient.put(
      `/customer/location?id=${id}&location=${location}`,
      {},
    );
  },

  updateExternalId: async (id: number, externalId: number): Promise<void> => {
    return erpApiClient.put(
      `/customer/external-id?id=${id}&externalId=${externalId}`,
      {},
    );
  },

  updateEmail: async (id: number, email: string): Promise<void> => {
    return erpApiClient.put(`/customer/email?id=${id}&email=${email}`, {});
  },

  updateCustomerType: async (
    id: number,
    customerType: {
      id: number;
      name: string;
    },
  ): Promise<void> => {
    return erpApiClient.put(`/customer/customer-type?id=${id}`, customerType);
  },

  updateCompanyName: async (id: number, companyName: string): Promise<void> => {
    return erpApiClient.put(
      `/customer/company-name?id=${id}&companyName=${companyName}`,
      {},
    );
  },

  updateBirthDate: async (id: number, birthDate: string): Promise<void> => {
    return erpApiClient.put(
      `/customer/birth-date?id=${id}&birthDate=${birthDate}`,
      {},
    );
  },
};
