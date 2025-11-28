import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { FacilityCard } from '../components/facilities/FacilityCard';
import { InstallPrompt } from '../components/pwa/InstallPrompt';
import { useFacilities } from '../hooks/useFacilities';
import { facilitiesApi, Facility } from '../services/api';
import { useProfile } from '../hooks/useProfile';

export const HomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { facilities, loading: facilitiesLoading, error: facilitiesError } = useFacilities();
  const { profile } = useProfile();
  const [availabilityMap, setAvailabilityMap] = useState<Record<string, { status: 'available' | 'booked' | 'full', text: string }>>({});

  // Fetch today's availability for all facilities
  const fetchTodayAvailability = useCallback(async () => {
    if (facilities.length === 0) return;
    
    const today = new Date().toISOString().split('T')[0];
    const availabilityPromises = facilities.map(async (facility) => {
      const response = await facilitiesApi.getAvailability(facility.id, today);
      if (response.success && response.data) {
        const avail = response.data;
        if (facility.type === 'development-pc') {
          const availableCount = avail.availableCount ?? 0;
          const totalCount = avail.totalCount ?? 3;
          const status = availableCount > 0 ? 'available' : 'full';
          return {
            id: facility.id,
            status,
            text: availableCount > 0 ? `${availableCount} / ${totalCount} Unit Tersedia` : 'Full Booked saat ini',
          };
        } else {
          const status = avail.availableSlots.length > 0 ? 'available' : 'full';
          return {
            id: facility.id,
            status,
            text: status === 'available' ? 'Available Now' : 'Full Booked saat ini',
          };
        }
      }
      return { id: facility.id, status: 'available' as const, text: 'Available Now' };
    });

    const results = await Promise.all(availabilityPromises);
    const map: Record<string, { status: 'available' | 'booked' | 'full', text: string }> = {};
    results.forEach((result) => {
      map[result.id] = { 
        status: result.status as 'available' | 'booked' | 'full', 
        text: result.text 
      };
    });
    setAvailabilityMap(map);
  }, [facilities]);

  // Fetch availability on mount and when facilities change
  useEffect(() => {
    fetchTodayAvailability();
  }, [fetchTodayAvailability]);

  // Refresh availability when returning to this page (e.g., after booking)
  useEffect(() => {
    const handleFocus = () => {
      fetchTodayAvailability();
    };
    
    // Refresh when page becomes visible
    document.addEventListener('visibilitychange', handleFocus);
    window.addEventListener('focus', handleFocus);
    
    // Also refresh when location changes (user navigates back)
    if (location.pathname === '/') {
      fetchTodayAvailability();
    }

    return () => {
      document.removeEventListener('visibilitychange', handleFocus);
      window.removeEventListener('focus', handleFocus);
    };
  }, [location.pathname, fetchTodayAvailability]);

  const handleBook = (facility: Facility) => {
    navigate(`/booking/${facility.id}`);
  };

  const userName = profile?.name || 'User';

  if (facilitiesLoading) {
    return (
      <AppShell>
        <div className="pt-8 text-center">
          <p className="text-text-secondary">Loading facilities...</p>
        </div>
      </AppShell>
    );
  }

  if (facilitiesError) {
    return (
      <AppShell>
        <div className="pt-8 text-center">
          <p className="text-status-booked">{facilitiesError}</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      {/* Hero Section */}
      <div className="pt-6 pb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-2">
          Hai, {userName} 👋
        </h1>
        <p className="text-lg text-text-secondary">
          Mau pakai fasilitas apa hari ini?
        </p>
      </div>

      {/* Facilities Section */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-text-primary mb-4">Fasilitas</h2>
        <div>
          {facilities.length === 0 ? (
            <p className="text-text-secondary text-center py-8">No facilities available</p>
          ) : (
            facilities.map((facility) => {
              const availability = availabilityMap[facility.id] || { status: 'available' as const, text: 'Available Now' };
              return (
                <FacilityCard
                  key={facility.id}
                  facility={facility}
                  onBook={handleBook}
                  availabilityStatus={availability.status}
                  availabilityText={availability.text}
                />
              );
            })
          )}
        </div>
      </div>

      {/* PWA Install Prompt */}
      <InstallPrompt />
    </AppShell>
  );
};

