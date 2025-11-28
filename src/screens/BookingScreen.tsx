import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { DatePicker } from '../components/booking/DatePicker';
import { TimeSlotGrid, TimeSlot } from '../components/booking/TimeSlotGrid';
import { SegmentControl } from '../components/booking/SegmentControl';
import { Button } from '../components/ui/Button';
import { facilitiesApi, bookingsApi, checkBookingLimit } from '../services/api';
import { useFacilityAvailability } from '../hooks/useFacilityAvailability';
import { formatDate } from '../utils/dateUtils';
import { Facility } from '../services/api';

type BookingStep = 'options' | 'time';

export const BookingScreen: React.FC = () => {
  const { facilityId } = useParams<{ facilityId: string }>();
  const navigate = useNavigate();

  const [facility, setFacility] = useState<Facility | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<BookingStep>('options');
  const [selectedOption, setSelectedOption] = useState(0);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [limitChecked, setLimitChecked] = useState(false);

  const { availability, loading: availabilityLoading } = useFacilityAvailability(
    facilityId || null,
    selectedDate
  );

  // Fetch facility on mount
  useEffect(() => {
    const fetchFacility = async () => {
      if (!facilityId) {
        setError('Facility ID is required');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      
      const response = await facilitiesApi.getById(facilityId);
      
      if (response.success && response.data) {
        setFacility(response.data);
      } else {
        setError(response.error || 'Facility not found');
      }
      
      setLoading(false);
    };

    fetchFacility();
  }, [facilityId]);

  // Check booking limit when date is selected
  useEffect(() => {
    const checkLimit = async () => {
      if (!facilityId || !selectedDate) {
        setLimitChecked(false);
        return;
      }

      const response = await checkBookingLimit(facilityId, selectedDate);
      if (!response.success || !response.data?.canBook) {
        setBookingError(response.data?.reason || 'Booking limit reached for this date');
      } else {
        setBookingError(null);
      }
      setLimitChecked(true);
    };

    checkLimit();
  }, [facilityId, selectedDate]);

  if (loading) {
    return (
      <AppShell topBarTitle="Booking" showBack onBack={() => navigate('/')}>
        <div className="pt-8 text-center">
          <p className="text-text-secondary">Loading...</p>
        </div>
      </AppShell>
    );
  }

  if (error || !facility) {
    return (
      <AppShell topBarTitle="Booking" showBack onBack={() => navigate('/')}>
        <div className="pt-8 text-center">
          <p className="text-status-booked">{error || 'Facility not found'}</p>
        </div>
      </AppShell>
    );
  }

  const isVRHeadset = facility.type === 'vr-headset';
  const options = isVRHeadset
    ? ['Headset Only', 'Headset + KAT VR Treadmill']
    : [];

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedSlots([]); // Reset slots when date changes
  };

  const handleNext = () => {
    if (step === 'options' && selectedDate && !bookingError) {
      setStep('time');
    }
  };

  const handleSlotToggle = (time: string) => {
    setSelectedSlots((prev) => {
      if (prev.includes(time)) {
        return prev.filter((t) => t !== time);
      } else {
        return [...prev, time].sort();
      }
    });
  };

  const handleConfirm = async () => {
    if (!facilityId || !selectedDate || selectedSlots.length === 0) {
      return;
    }

    setSubmitting(true);
    setBookingError(null);

    try {
      const bookingRequest = {
        facilityId,
        date: selectedDate,
        timeSlots: selectedSlots,
        options: isVRHeadset ? options[selectedOption] : undefined,
      };

      const response = await bookingsApi.create(bookingRequest);

      if (response.success && response.data) {
        // Navigate to bookings page
        navigate('/bookings', { state: { message: 'Booking created successfully!' } });
      } else {
        setBookingError(response.error || 'Failed to create booking');
      }
    } catch (err) {
      setBookingError('An unexpected error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  // Generate time slots from availability
  const generateTimeSlots = (): TimeSlot[] => {
    if (!availability) {
      // Default slots if availability not loaded yet
      const slots: TimeSlot[] = [];
      for (let hour = 9; hour <= 17; hour++) {
        const time = `${String(hour).padStart(2, '0')}:00`;
        slots.push({ time, available: false });
      }
      return slots;
    }

    const slots: TimeSlot[] = [];
    for (let hour = 9; hour <= 17; hour++) {
      const time = `${String(hour).padStart(2, '0')}:00`;
      const available = availability.availableSlots.includes(time);
      slots.push({ time, available });
    }

    return slots;
  };

  const timeSlots = generateTimeSlots();

  return (
    <AppShell
      topBarTitle={`Book ${facility.name}`}
      showBack
      onBack={() => (step === 'options' ? navigate('/') : setStep('options'))}
      showBottomNav={false}
    >
      <div className="pt-6 pb-6">
        {step === 'options' && (
          <div className="space-y-6">
            {/* Facility Options (only for VR) */}
            {isVRHeadset && (
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-4">
                  Pilih Opsi
                </h3>
                <SegmentControl
                  options={options}
                  selectedIndex={selectedOption}
                  onSelect={setSelectedOption}
                />
              </div>
            )}

            {/* Date Picker */}
            <div>
              <h3 className="text-lg font-semibold text-text-primary mb-4">
                Pilih Tanggal
              </h3>
              <DatePicker
                selectedDate={selectedDate}
                onDateSelect={handleDateSelect}
              />
            </div>

            {/* Booking Limit Error */}
            {bookingError && (
              <div className="bg-status-booked/20 border border-status-booked/50 rounded-card p-4">
                <p className="text-status-booked text-sm">{bookingError}</p>
              </div>
            )}

            {/* Next Button */}
            <div className="sticky bottom-4 pt-4">
              <Button
                variant="primary"
                fullWidth
                onClick={handleNext}
                disabled={!selectedDate || !!bookingError || !limitChecked}
              >
                Next: Pilih Jam
              </Button>
            </div>
          </div>
        )}

        {step === 'time' && selectedDate && (
          <div className="space-y-6">
            {/* Selected Date Display */}
            <div className="bg-bg-card rounded-card p-4 shadow-card">
              <p className="text-text-secondary text-sm mb-1">Tanggal Terpilih</p>
              <p className="text-xl font-semibold text-text-primary">
                {formatDate(selectedDate)}
              </p>
            </div>

            {/* Time Slot Grid */}
            {availabilityLoading ? (
              <div className="text-center py-8">
                <p className="text-text-secondary">Loading time slots...</p>
              </div>
            ) : (
              <TimeSlotGrid
                slots={timeSlots}
                selectedSlots={selectedSlots}
                onSlotToggle={handleSlotToggle}
              />
            )}

            {/* Confirm Button (sticky when slots selected) */}
            {selectedSlots.length > 0 && (
              <div className="sticky bottom-4 pt-4 bg-bg-main pb-4">
                <div className="bg-bg-card rounded-card p-4 shadow-card mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-text-secondary">
                        {selectedSlots.length} Slot Dipilih
                      </p>
                      <p className="text-lg font-semibold text-text-primary">
                        {selectedSlots[0]} - {selectedSlots[selectedSlots.length - 1]}
                      </p>
                    </div>
                    <Button 
                      variant="primary" 
                      onClick={handleConfirm}
                      disabled={submitting}
                    >
                      {submitting ? 'Submitting...' : 'Confirm Booking'}
                    </Button>
                  </div>
                  {bookingError && (
                    <p className="text-status-booked text-sm mt-2">{bookingError}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
};

