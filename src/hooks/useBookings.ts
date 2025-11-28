import { useState, useEffect } from 'react';
import { bookingsApi, Booking } from '../services/api';

type BookingFilter = 'all' | 'upcoming' | 'history';

export const useBookings = (filter: BookingFilter = 'all') => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      setError(null);
      
      let response;
      if (filter === 'upcoming') {
        response = await bookingsApi.getUpcoming();
      } else if (filter === 'history') {
        response = await bookingsApi.getHistory();
      } else {
        response = await bookingsApi.getAll();
      }
      
      if (response.success && response.data) {
        setBookings(response.data);
      } else {
        setError(response.error || 'Failed to load bookings');
      }
      
      setLoading(false);
    };

    fetchBookings();
  }, [filter]);

  const refetch = async () => {
    setLoading(true);
    setError(null);
    
    let response;
    if (filter === 'upcoming') {
      response = await bookingsApi.getUpcoming();
    } else if (filter === 'history') {
      response = await bookingsApi.getHistory();
    } else {
      response = await bookingsApi.getAll();
    }
    
    if (response.success && response.data) {
      setBookings(response.data);
    } else {
      setError(response.error || 'Failed to load bookings');
    }
    
    setLoading(false);
  };

  return { bookings, loading, error, refetch };
};

