import { useState, useEffect } from 'react';
import { facilitiesApi, FacilityAvailability } from '../services/api';

export const useFacilityAvailability = (facilityId: string | null, date: string | null) => {
  const [availability, setAvailability] = useState<FacilityAvailability | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!facilityId || !date) {
      setAvailability(null);
      return;
    }

    const fetchAvailability = async () => {
      setLoading(true);
      setError(null);
      
      const response = await facilitiesApi.getAvailability(facilityId, date);
      
      if (response.success && response.data) {
        setAvailability(response.data);
      } else {
        setError(response.error || 'Failed to load availability');
        setAvailability(null);
      }
      
      setLoading(false);
    };

    fetchAvailability();
  }, [facilityId, date]);

  return { availability, loading, error };
};

