import { useEffect, useState } from 'react';

import type { Street } from '../services/street.service';
import { streetService } from '../services/street.service';

export const useStreets = (cityId?: number | null, name?: string) => {
  const [streets, setStreets] = useState<Street[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchStreets = async (id: number, searchName?: string) => {
    try {
      setLoading(true);
      const data = await streetService.getAll(id, searchName);
      setStreets(data);
    } catch (error) {
      console.error('Failed to fetch streets:', error);
      setStreets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (cityId) {
      fetchStreets(cityId, name);
    } else {
      setStreets([]);
    }
  }, [cityId, name]);

  return { streets, loading, refetch: fetchStreets };
};
