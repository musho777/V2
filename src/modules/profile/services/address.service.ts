import { API_CONFIG } from '@/config/api.config';
import { httpClient } from '@/utils/httpClient';

import type {
  AddressType,
  OwnAddressesRequest,
  UserAddressDTO,
  UserAddressRequest,
} from '../types/address.types';

const BASE_URL = API_CONFIG.BASE_URL;

export const addressService = {
  /**
   * Get all address types
   */
  getAddressTypes: async (): Promise<AddressType[]> => {
    const response = await httpClient.get<AddressType[]>(
      `${BASE_URL}/address-types`,
    );
    return response;
  },

  /**
   * Get user pending addresses by user ID
   * @param userId - User ID
   */
  getUserAddresses: async (userId: number): Promise<UserAddressDTO[]> => {
    const response = await httpClient.get<UserAddressDTO[]>(
      `${BASE_URL}/user/pending-addresses/${userId}`,
    );
    return response;
  },

  /**
   * Create pending addresses for a user
   * @param data - User address request data
   */
  createUserAddresses: async (
    data: UserAddressRequest,
  ): Promise<UserAddressDTO[]> => {
    const response = await httpClient.post<UserAddressDTO[]>(
      `${BASE_URL}/user/pending-addresses`,
      data,
    );
    return response;
  },

  /**
   * Create own pending addresses
   * @param data - Own addresses request data
   */
  createOwnAddresses: async (
    data: OwnAddressesRequest,
  ): Promise<UserAddressDTO[]> => {
    const response = await httpClient.post<UserAddressDTO[]>(
      `${BASE_URL}/user/pending-addresses/own`,
      data,
    );
    return response;
  },

  /**
   * Delete a pending address
   * @param addressId - Address ID
   */
  deleteAddress: async (addressId: number): Promise<void> => {
    await httpClient.delete(`${BASE_URL}/user/pending-addresses/${addressId}`);
  },

  /**
   * Toggle address status by updating it
   * @param userId - User ID
   * @param addressId - Address ID
   * @param status - New status
   */
  toggleAddressStatus: async (
    userId: number,
    addressId: number,
    status: boolean,
  ): Promise<UserAddressDTO[]> => {
    // To toggle status, we need to get the current address and update it
    // Since API doesn't have a direct toggle endpoint, we'll use the create endpoint with the address ID
    const addresses = await addressService.getUserAddresses(userId);
    const address = addresses.find((a) => a.addressId === addressId);

    if (!address) {
      throw new Error('Address not found');
    }

    const updateData: UserAddressRequest = {
      userId,
      addressType: {
        id: address.addressTypeId,
        name: address.addressTypeName,
      },
      addresses: [
        {
          userAddressId: addressId,
          address1: address.address1,
          address2: address.address2,
          city: address.city,
          state: address.state,
          zip: address.zip,
          country: address.country,
          status: status,
        },
      ],
    };

    return addressService.createUserAddresses(updateData);
  },
};
