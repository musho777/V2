import { API_CONFIG } from '@/config/api.config';
import { httpClient } from '@/utils/httpClient';

import type {
  OwnLanguagesRequest,
  UserLanguageRequest,
} from '../types/language.types';

const BASE_URL = API_CONFIG.BASE_URL;

export const languageService = {
  /**
   * Get user pending languages by user ID
   * @param userId - User ID
   */
  getUserLanguages: async (userId: number): Promise<any> => {
    const response = await httpClient.get<any>(
      `${BASE_URL}/user/pending-languages/${userId}`,
    );
    return response;
  },

  /**
   * Create pending languages for a user
   * @param data - User languages request data
   */
  createUserLanguages: async (data: UserLanguageRequest): Promise<any> => {
    const response = await httpClient.post<any>(
      `${BASE_URL}/user/pending-languages`,
      data,
    );
    return response;
  },

  /**
   * Create own pending languages
   * @param data - Own languages request data
   */
  createOwnLanguages: async (data: OwnLanguagesRequest): Promise<any> => {
    const response = await httpClient.post<any>(
      `${BASE_URL}/user/pending-languages/own`,
      data,
    );
    return response;
  },

  /**
   * Delete a pending language
   * @param languageId - Language ID
   */
  deleteLanguage: async (languageId: number): Promise<void> => {
    await httpClient.delete(`${BASE_URL}/user/pending-languages/${languageId}`);
  },
};
