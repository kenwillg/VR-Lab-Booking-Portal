export type FacilityType = 'soldering' | 'development-pc' | 'vr-headset';

export type BookingStatus = 'upcoming' | 'completed' | 'cancelled';

export interface Facility {
  id: string;
  type: FacilityType;
  name: string;
  description: string;
  availableItems?: string;
  note?: string;
  icon: string;
}

export interface TimeSlot {
  id: string;
  time: string; // Format: "HH:MM"
  available: boolean;
}

export interface Booking {
  id: string;
  facilityId: string;
  facilityName: string;
  facilityType: FacilityType;
  date: string; // Format: "YYYY-MM-DD"
  startTime: string;
  endTime: string;
  duration: number; // in hours
  status: BookingStatus;
  location: string;
  options?: string; // e.g., "Headset + KAT VR Treadmill"
}

export interface FacilityAvailability {
  facilityId: string;
  date: string;
  availableSlots: string[]; // Array of time strings like "09:00"
  bookedSlots: string[];
}

