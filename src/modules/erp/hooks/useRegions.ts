import { useEffect, useState } from 'react';

import type { Region } from '../services/region.service';
import { regionService } from '../services/region.service';

export const useRegions = (countryId?: number | null) => {
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchRegions = async (id: number) => {
    try {
      setLoading(true);
      const data = await regionService.getAll(id);
      setRegions(data);
    } catch (error) {
      console.error('Failed to fetch regions:', error);
      setRegions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (countryId) {
      fetchRegions(countryId);
    } else {
      setRegions([]);
    }
  }, [countryId]);

  return { regions, loading, refetch: fetchRegions };
};
