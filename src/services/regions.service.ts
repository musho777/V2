import { ajax } from 'rxjs/ajax';

import { API_CONFIG } from '@/config/api.config';
import type { Region } from '@/hooks/useRegions';

const BASE_URL = API_CONFIG.BASE_URL;

export const regionService = {
  getRegions: () => {
    const token = localStorage.getItem('accessToken'); // <-- твой токен

    return ajax.getJSON<Region[]>(`${BASE_URL}/regions`, {
      Authorization: `Bearer ${token}`,
    });
  },
};
