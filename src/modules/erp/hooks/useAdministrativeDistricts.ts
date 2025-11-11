import { useEffect, useState } from 'react';

import type { AdministrativeDistrict } from '../services/administrative-district.service';
import { administrativeDistrictService } from '../services/administrative-district.service';

export const useAdministrativeDistricts = (cityId?: number | null) => {
  const [districts, setDistricts] = useState<AdministrativeDistrict[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchDistricts = async (id: number) => {
    try {
      setLoading(true);
      const data = await administrativeDistrictService.getAll(id);
      setDistricts(data);
    } catch (error) {
      console.error('Failed to fetch administrative districts:', error);
      setDistricts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (cityId) {
      fetchDistricts(cityId);
    } else {
      setDistricts([]);
    }
  }, [cityId]);

  return { districts, loading, refetch: fetchDistricts };
};
