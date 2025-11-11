import { API_CONFIG } from '@/config/api.config';
import { httpClient } from '@/utils/httpClient';

import type {
  OwnContactsRequest,
  UserContactDTO,
  UserContactsRequest,
} from '../types/contact.types';

const BASE_URL = API_CONFIG.BASE_URL;

export const contactService = {
  /**
   * Get user pending contacts by user ID
   * @param userId - User ID
   */
  getUserContacts: async (userId: number): Promise<UserContactDTO[]> => {
    const response = await httpClient.get<UserContactDTO[]>(
      `${BASE_URL}/user/pending-contacts/${userId}`,
    );
    return response;
  },

  /**
   * Create pending contacts for a user
   * @param data - User contacts request data
   */
  createUserContacts: async (
    data: UserContactsRequest,
  ): Promise<UserContactDTO[]> => {
    const response = await httpClient.post<UserContactDTO[]>(
      `${BASE_URL}/user/pending-contacts`,
      data,
    );
    return response;
  },

  /**
   * Create own pending contacts
   * @param data - Own contacts request data
   */
  createOwnContacts: async (
    data: OwnContactsRequest,
  ): Promise<UserContactDTO[]> => {
    const response = await httpClient.post<UserContactDTO[]>(
      `${BASE_URL}/user/pending-contacts/own`,
      data,
    );
    return response;
  },

  /**
   * Delete a pending contact
   * @param contactId - Contact ID
   */
  deleteContact: async (contactId: number): Promise<void> => {
    await httpClient.delete(`${BASE_URL}/user/pending-contacts/${contactId}`);
  },

  /**
   * Toggle contact status by updating it
   * @param userId - User ID
   * @param contactId - Contact ID
   * @param status - New status
   */
  toggleContactStatus: async (
    userId: number,
    contactId: number,
    status: boolean,
  ): Promise<UserContactDTO[]> => {
    // To toggle status, we need to get the current contact and update it
    const contacts = await contactService.getUserContacts(userId);
    const contact = contacts.find((c) => c.contactId === contactId);

    if (!contact) {
      throw new Error('Contact not found');
    }

    const updateData: UserContactsRequest = {
      userId,
      contactType: {
        id: contact.contactTypeId,
      },
      contacts: [
        {
          userContactId: contactId,
          contact: contact.contact,
          priority: {
            id: contact.priorityId,
            priority: contact.priorityName,
          },
          status: status,
        },
      ],
    };

    return contactService.createUserContacts(updateData);
  },
};
