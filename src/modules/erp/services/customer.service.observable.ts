import type { Observable } from 'rxjs';

import { httpService } from './api.config';
import type {
  Customer,
  CustomerCreateDto,
  CustomerSearchParams,
  CustomerSearchResponse,
} from './customer.service';

/**
 * Observable-based Customer Service using RxJS
 * All methods return Observables for reactive programming
 */
export const customerServiceObservable = {
  /**
   * Search customers with pagination and filters
   */
  search: (
    params: CustomerSearchParams,
  ): Observable<CustomerSearchResponse> => {
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

    return httpService.get<CustomerSearchResponse>(
      `/customer/search?${queryParams.toString()}`,
    );
  },

  /**
   * Search customer by ID
   */
  searchById: (id: number): Observable<Customer> => {
    return httpService.get<Customer>(`/customer/search-by-id/${id}`);
  },

  /**
   * Create new customer
   */
  create: (data: CustomerCreateDto): Observable<Customer> => {
    return httpService.post<Customer>('/customer/add', data);
  },

  /**
   * Update taxpayer registration number
   */
  updateTaxpayerRegistrationNumber: (
    id: number,
    taxpayerRegistrationNumber: string,
  ): Observable<void> => {
    return httpService.put<void>(
      `/customer/taxpayer-registration-number?id=${id}&taxpayerRegistrationNumber=${taxpayerRegistrationNumber}`,
      {},
    );
  },

  /**
   * Update social card number
   */
  updateSocialCardNumber: (
    id: number,
    socialCardNumber: string,
  ): Observable<void> => {
    return httpService.put<void>(
      `/customer/social-card-number?id=${id}&socialCardNumber=${socialCardNumber}`,
      {},
    );
  },

  /**
   * Update service addresses
   */
  updateServiceAddresses: (
    id: number,
    serviceAddresses: Array<{
      building: { id: number };
      flat?: number;
      room?: number;
      entrance?: number;
      floor?: number;
      comment?: string;
    }>,
  ): Observable<void> => {
    return httpService.put<void>(
      `/customer/service-addresses?id=${id}`,
      serviceAddresses,
    );
  },

  /**
   * Update phone numbers
   */
  updatePhoneNumbers: (
    id: number,
    phoneNumbers: Array<{
      number: string;
      comment?: string;
    }>,
  ): Observable<void> => {
    return httpService.put<void>(
      `/customer/phone-numbers?id=${id}`,
      phoneNumbers,
    );
  },

  /**
   * Update passport information
   */
  updatePassport: (
    id: number,
    passportInfo: {
      type: 'ARMENIAN_PASSPORT' | 'ARMENIAN_ID' | 'FOREIGN_PASSPORT';
      number: string;
      issueDate: string;
      issuerCode: string;
      address: string;
    },
  ): Observable<void> => {
    return httpService.put<void>(`/customer/passport?id=${id}`, passportInfo);
  },

  /**
   * Update notification address
   */
  updateNotificationAddress: (
    id: number,
    notificationAddress: string,
  ): Observable<void> => {
    return httpService.put<void>(
      `/customer/notification-address?id=${id}&notificationAddress=${notificationAddress}`,
      {},
    );
  },

  /**
   * Update customer name
   */
  updateName: (
    id: number,
    name: {
      firstName: string;
      lastName: string;
      patronymic: string;
    },
  ): Observable<void> => {
    return httpService.put<void>(`/customer/name?id=${id}`, name);
  },

  /**
   * Update location
   */
  updateLocation: (id: number, location: string): Observable<void> => {
    return httpService.put<void>(
      `/customer/location?id=${id}&location=${location}`,
      {},
    );
  },

  /**
   * Update external ID
   */
  updateExternalId: (id: number, externalId: number): Observable<void> => {
    return httpService.put<void>(
      `/customer/external-id?id=${id}&externalId=${externalId}`,
      {},
    );
  },

  /**
   * Update email
   */
  updateEmail: (id: number, email: string): Observable<void> => {
    return httpService.put<void>(`/customer/email?id=${id}&email=${email}`, {});
  },

  /**
   * Update customer type
   */
  updateCustomerType: (
    id: number,
    customerType: {
      id: number;
      name: string;
    },
  ): Observable<void> => {
    return httpService.put<void>(
      `/customer/customer-type?id=${id}`,
      customerType,
    );
  },

  /**
   * Update company name
   */
  updateCompanyName: (id: number, companyName: string): Observable<void> => {
    return httpService.put<void>(
      `/customer/company-name?id=${id}&companyName=${companyName}`,
      {},
    );
  },

  /**
   * Update birth date
   */
  updateBirthDate: (id: number, birthDate: string): Observable<void> => {
    return httpService.put<void>(
      `/customer/birth-date?id=${id}&birthDate=${birthDate}`,
      {},
    );
  },
};
