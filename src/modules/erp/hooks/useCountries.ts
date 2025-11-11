import { useState } from 'react';

import type { Country } from '../services/country.service';
import { countryService } from '../services/country.service';

export const useCountries = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);

  const fetchCountries = async () => {
    if (fetched) return;
    try {
      setLoading(true);
      const data = await countryService.getAll();
      setCountries(data);
      setFetched(true);
    } catch (error) {
      console.error('Failed to fetch countries:', error);
    } finally {
      setLoading(false);
    }
  };

  return { countries, loading, fetchCountries };
};
