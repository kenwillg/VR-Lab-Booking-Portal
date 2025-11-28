import { Facility, Booking, FacilityAvailability } from '../types';

export const mockFacilities: Facility[] = [
  {
    id: 'soldering-1',
    type: 'soldering',
    name: 'Soldering Workstation',
    description: 'Tersedia: Iron, Multimeter, Helping Hand.',
    note: 'Harap bawa timah & flux sendiri.',
    icon: '🔧',
  },
  {
    id: 'dev-pc-1',
    type: 'development-pc',
    name: 'Development PCs',
    description: '3 PC tersedia untuk development',
    icon: '💻',
  },
  {
    id: 'vr-1',
    type: 'vr-headset',
    name: 'VR Headsets',
    description: 'Meta Quest 3. Opsi tambahan: KAT VR Treadmill.',
    icon: '🥽',
  },
];

export const mockBookings: Booking[] = [
  {
    id: 'booking-1',
    facilityId: 'vr-1',
    facilityName: 'VR Zone',
    facilityType: 'vr-headset',
    date: '2024-10-28',
    startTime: '14:00',
    endTime: '16:00',
    duration: 2,
    status: 'upcoming',
    location: 'Lab Lt. 3',
    options: 'Headset + KAT VR Treadmill',
  },
  {
    id: 'booking-2',
    facilityId: 'dev-pc-1',
    facilityName: 'Development PC',
    facilityType: 'development-pc',
    date: '2024-10-25',
    startTime: '10:00',
    endTime: '12:00',
    duration: 2,
    status: 'completed',
    location: 'Lab Lt. 3',
  },
];

export const mockAvailability: FacilityAvailability[] = [
  {
    facilityId: 'vr-1',
    date: '2024-10-27',
    availableSlots: ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'],
    bookedSlots: ['12:00', '17:00'],
  },
  {
    facilityId: 'dev-pc-1',
    date: '2024-10-27',
    availableSlots: ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'],
    bookedSlots: ['12:00'],
  },
  {
    facilityId: 'soldering-1',
    date: '2024-10-27',
    availableSlots: ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'],
    bookedSlots: [],
  },
];

// Helper function to get availability for a facility on a specific date
export const getAvailability = (facilityId: string, date: string): FacilityAvailability | undefined => {
  return mockAvailability.find(
    (avail) => avail.facilityId === facilityId && avail.date === date
  );
};

// Helper function to get facility by ID
export const getFacilityById = (id: string): Facility | undefined => {
  return mockFacilities.find((facility) => facility.id === id);
};

// Helper function to format date
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]}`;
};

// Helper function to get relative date string
export const getRelativeDate = (dateString: string): string => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const date = new Date(dateString);
  date.setHours(0, 0, 0, 0);
  
  const diffTime = date.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Hari ini';
  if (diffDays === 1) return 'Besok';
  if (diffDays === -1) return 'Kemarin';
  if (diffDays > 1 && diffDays <= 7) return `${diffDays} hari lagi`;
  return formatDate(dateString);
};

