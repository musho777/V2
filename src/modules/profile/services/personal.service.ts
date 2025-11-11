import { API_CONFIG } from '@/config/api.config';
import { httpClient } from '@/utils/httpClient';

import type { ProfilePhoto } from '../types/personal.types';

const BASE_URL = API_CONFIG.BASE_URL;

export const personalService = {
  /**
   * Upload user avatar
   */
  uploadProfilePhoto: async (photo: ProfilePhoto): Promise<any> => {
    const formData = new FormData();
    formData.append('photo', photo.photo);

    const response = await httpClient.post<any>(
      `${BASE_URL}/users/profile-photo`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    return response;
  },
};
