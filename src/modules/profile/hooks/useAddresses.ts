import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';

import { addressService } from '../services/address.service';
import type {
  OwnAddressesRequest,
  UserAddressRequest,
} from '../types/address.types';

/**
 * Hook to fetch address types
 */
export const useAddressTypes = () => {
  return useQuery({
    queryKey: ['addressTypes'],
    queryFn: () => addressService.getAddressTypes(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to fetch user addresses
 * @param userId - User ID to fetch addresses for
 */
export const useUserAddresses = (userId: number | null | undefined) => {
  return useQuery({
    queryKey: ['userAddresses', userId],
    queryFn: () => {
      if (!userId) return Promise.resolve([]);
      return addressService.getUserAddresses(userId);
    },
    enabled: !!userId,
  });
};

/**
 * Hook to create addresses for a user
 */
export const useCreateUserAddresses = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UserAddressRequest) =>
      addressService.createUserAddresses(data),
    onSuccess: (_, variables) => {
      message.success('Address created successfully');
      void queryClient.invalidateQueries({
        queryKey: ['userAddresses', variables.userId],
      });
    },
    onError: (error: any) => {
      message.error(
        error?.response?.data?.message || 'Failed to create address',
      );
    },
  });
};

/**
 * Hook to create own addresses
 */
export const useCreateOwnAddresses = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: OwnAddressesRequest) =>
      addressService.createOwnAddresses(data),
    onSuccess: () => {
      message.success('Address created successfully');
      void queryClient.invalidateQueries({
        queryKey: ['userAddresses'],
      });
    },
    onError: (error: any) => {
      message.error(
        error?.response?.data?.message || 'Failed to create address',
      );
    },
  });
};

/**
 * Hook to delete an address
 */
export const useDeleteAddress = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ addressId }: { userId: number; addressId: number }) =>
      addressService.deleteAddress(addressId),
    onSuccess: (_, variables) => {
      message.success('Address deleted successfully');
      void queryClient.invalidateQueries({
        queryKey: ['userAddresses', variables.userId],
      });
    },
    onError: (error: any) => {
      message.error(
        error?.response?.data?.message || 'Failed to delete address',
      );
    },
  });
};

/**
 * Hook to toggle address status
 */
export const useToggleAddressStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      addressId,
      status,
    }: {
      userId: number;
      addressId: number;
      status: boolean;
    }) => addressService.toggleAddressStatus(userId, addressId, status),
    onSuccess: (_, variables) => {
      message.success('Address status updated successfully');
      void queryClient.invalidateQueries({
        queryKey: ['userAddresses', variables.userId],
      });
    },
    onError: (error: any) => {
      message.error(
        error?.response?.data?.message || 'Failed to update address status',
      );
    },
  });
};
