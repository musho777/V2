import { useEffect, useState } from 'react';

import type { Building } from '../services/building.service';
import { buildingService } from '../services/building.service';

export const useBuildings = (streetId?: number | null) => {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchBuildings = async (id: number) => {
    try {
      setLoading(true);
      const data = await buildingService.getAll(id);
      setBuildings(data);
    } catch (error) {
      console.error('Failed to fetch buildings:', error);
      setBuildings([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (streetId) {
      fetchBuildings(streetId);
    } else {
      setBuildings([]);
    }
  }, [streetId]);

  return { buildings, loading, refetch: fetchBuildings };
};
