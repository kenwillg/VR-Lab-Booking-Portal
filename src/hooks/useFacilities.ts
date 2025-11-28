import { useState, useEffect } from 'react';
import { facilitiesApi, Facility } from '../services/api';

export const useFacilities = () => {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFacilities = async () => {
      setLoading(true);
      setError(null);
      
      const response = await facilitiesApi.getAll();
      
      if (response.success && response.data) {
        setFacilities(response.data);
      } else {
        setError(response.error || 'Failed to load facilities');
      }
      
      setLoading(false);
    };

    fetchFacilities();
  }, []);

  return { facilities, loading, error };
};

