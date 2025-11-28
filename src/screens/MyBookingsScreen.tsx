import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useBookings } from '../hooks/useBookings';
import { bookingsApi } from '../services/api';
import { getRelativeDate } from '../utils/dateUtils';

export const MyBookingsScreen: React.FC = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'history'>('upcoming');
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const filter: 'upcoming' | 'history' = activeTab;
  const { bookings, loading, error, refetch } = useBookings(filter);

  // Show success message from navigation state
  useEffect(() => {
    if (location.state?.message) {
      setMessage(location.state.message);
      setTimeout(() => setMessage(null), 5000);
      // Clear the state
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const getFacilityIcon = (type: string) => {
    switch (type) {
      case 'vr-headset':
        return '🥽';
      case 'development-pc':
        return '💻';
      case 'soldering':
        return '🔧';
      default:
        return '📦';
    }
  };

  const handleCancel = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    setCancellingId(bookingId);
    
    try {
      const response = await bookingsApi.cancel(bookingId);
      
      if (response.success) {
        setMessage('Booking cancelled successfully');
        refetch(); // Refresh the list
      } else {
        setMessage(response.error || 'Failed to cancel booking');
      }
    } catch (err) {
      setMessage('An error occurred while cancelling the booking');
    } finally {
      setCancellingId(null);
      setTimeout(() => setMessage(null), 5000);
    }
  };

  return (
    <AppShell topBarTitle="Jadwal Saya">
      <div className="pt-6 pb-6">
        {/* Success/Error Message */}
        {message && (
          <div className={`mb-4 p-4 rounded-card ${
            message.includes('success') || message.includes('cancelled')
              ? 'bg-status-available/20 border border-status-available/50 text-status-available'
              : 'bg-status-booked/20 border border-status-booked/50 text-status-booked'
          }`}>
            <p className="text-sm">{message}</p>
          </div>
        )}

        {/* Tab Switcher */}
        <div className="flex gap-2 mb-6 bg-bg-card p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'upcoming'
                ? 'gradient-primary text-white'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'history'
                ? 'gradient-primary text-white'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            History
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-text-secondary">Loading bookings...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-12">
            <p className="text-status-booked">{error}</p>
            <Button
              variant="outline"
              onClick={() => refetch()}
              className="mt-4"
            >
              Retry
            </Button>
          </div>
        )}

        {/* Bookings List */}
        {!loading && !error && bookings.length === 0 && (
          <div className="text-center py-12">
            <p className="text-text-secondary">
              {activeTab === 'upcoming'
                ? 'Tidak ada booking yang akan datang'
                : 'Tidak ada riwayat booking'}
            </p>
          </div>
        )}

        {!loading && !error && bookings.length > 0 && (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <Card key={booking.id}>
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{getFacilityIcon(booking.facilityType)}</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-text-primary mb-2">
                      {booking.facilityName}
                      {booking.options && (
                        <span className="text-sm font-normal text-text-secondary ml-2">
                          + {booking.options}
                        </span>
                      )}
                    </h3>
                    <div className="space-y-1 mb-4">
                      <p className="text-sm text-text-secondary flex items-center gap-2">
                        <span>📅</span>
                        <span>{getRelativeDate(booking.date)}</span>
                      </p>
                      <p className="text-sm text-text-secondary flex items-center gap-2">
                        <span>⏰</span>
                        <span>
                          {booking.startTime} - {booking.endTime} ({booking.duration} Jam)
                        </span>
                      </p>
                      <p className="text-sm text-text-secondary flex items-center gap-2">
                        <span>📍</span>
                        <span>{booking.location}</span>
                      </p>
                    </div>
                    {activeTab === 'upcoming' && booking.status === 'upcoming' && (
                      <Button
                        variant="danger"
                        onClick={() => handleCancel(booking.id)}
                        disabled={cancellingId === booking.id}
                        className="w-full sm:w-auto"
                      >
                        {cancellingId === booking.id ? 'Cancelling...' : 'Cancel Booking'}
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
};

