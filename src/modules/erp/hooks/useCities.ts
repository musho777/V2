import { useEffect, useState } from 'react';

import type { City } from '../services/city.service';
import { cityService } from '../services/city.service';

export const useCities = (regionId?: number | null) => {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchCities = async (id: number) => {
    try {
      setLoading(true);
      const data = await cityService.getAll(id);
      setCities(data);
    } catch (error) {
      console.error('Failed to fetch cities:', error);
      setCities([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (regionId) {
      fetchCities(regionId);
    } else {
      setCities([]);
    }
  }, [regionId]);

  return { cities, loading, refetch: fetchCities };
};
