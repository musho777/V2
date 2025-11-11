import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';

import { contactService } from '../services/contact.service';
import type {
  OwnContactsRequest,
  UserContactsRequest,
} from '../types/contact.types';

/**
 * Hook to fetch user contacts
 * @param userId - User ID to fetch contacts for
 */
export const useUserContacts = (userId: number | null | undefined) => {
  return useQuery({
    queryKey: ['userContacts', userId],
    queryFn: () => {
      if (!userId) return Promise.resolve([]);
      return contactService.getUserContacts(userId);
    },
    enabled: !!userId,
  });
};

/**
 * Hook to create contacts for a user
 */
export const useCreateUserContacts = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UserContactsRequest) =>
      contactService.createUserContacts(data),
    onSuccess: (_, variables) => {
      message.success('Contact created successfully');
      void queryClient.invalidateQueries({
        queryKey: ['userContacts', variables.userId],
      });
    },
    onError: (error: any) => {
      message.error(
        error?.response?.data?.message || 'Failed to create contact',
      );
    },
  });
};

/**
 * Hook to create own contacts
 */
export const useCreateOwnContacts = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: OwnContactsRequest) =>
      contactService.createOwnContacts(data),
    onSuccess: () => {
      message.success('Contact created successfully');
      void queryClient.invalidateQueries({
        queryKey: ['userContacts'],
      });
    },
    onError: (error: any) => {
      message.error(
        error?.response?.data?.message || 'Failed to create contact',
      );
    },
  });
};

/**
 * Hook to delete a contact
 */
export const useDeleteContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ contactId }: { userId: number; contactId: number }) =>
      contactService.deleteContact(contactId),
    onSuccess: (_, variables) => {
      message.success('Contact deleted successfully');
      void queryClient.invalidateQueries({
        queryKey: ['userContacts', variables.userId],
      });
    },
    onError: (error: any) => {
      message.error(
        error?.response?.data?.message || 'Failed to delete contact',
      );
    },
  });
};

/**
 * Hook to toggle contact status
 */
export const useToggleContactStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      contactId,
      status,
    }: {
      userId: number;
      contactId: number;
      status: boolean;
    }) => contactService.toggleContactStatus(userId, contactId, status),
    onSuccess: (_, variables) => {
      message.success('Contact status updated successfully');
      void queryClient.invalidateQueries({
        queryKey: ['userContacts', variables.userId],
      });
    },
    onError: (error: any) => {
      message.error(
        error?.response?.data?.message || 'Failed to update contact status',
      );
    },
  });
};
