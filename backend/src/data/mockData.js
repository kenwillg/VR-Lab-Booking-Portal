// In-memory data storage
// In a real app, this would be replaced with a database

export let facilities = [
  {
    id: 'soldering-1',
    type: 'soldering',
    name: 'Soldering Workstation',
    description: 'Tersedia: Iron, Multimeter, Helping Hand.',
    note: 'Harap bawa timah & flux sendiri.',
    icon: '🔧',
    location: 'Lab Lt. 3',
  },
  {
    id: 'dev-pc-1',
    type: 'development-pc',
    name: 'Development PCs',
    description: '3 PC tersedia untuk development',
    icon: '💻',
    location: 'Lab Lt. 3',
    maxCapacity: 3,
  },
  {
    id: 'vr-1',
    type: 'vr-headset',
    name: 'VR Headsets',
    description: 'Meta Quest 3. Opsi tambahan: KAT VR Treadmill.',
    icon: '🥽',
    location: 'Lab Lt. 3',
  },
];

export let bookings = [
  {
    id: 'booking-1',
    userId: 'user-1',
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
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export let users = [
  {
    id: 'user-1',
    email: 'user@pradita.ac.id',
    password: '$2a$10$rOzJqZqZqZqZqZqZqZqZqO', // bcrypt hash of "password123"
    name: 'User Name',
    nim: '2310101008',
    programStudi: 'Informatika',
    fakultas: 'Fakultas Sains dan Teknologi',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Helper functions
export const getFacilityById = (id) => {
  return facilities.find((f) => f.id === id);
};

export const getBookingById = (id) => {
  return bookings.find((b) => b.id === id);
};

export const getUserById = (id) => {
  return users.find((u) => u.id === id);
};

export const getUserByEmail = (email) => {
  return users.find((u) => u.email === email);
};

export const getBookingsByUserId = (userId) => {
  return bookings.filter((b) => b.userId === userId);
};

export const getBookingsByFacilityAndDate = (facilityId, date) => {
  return bookings.filter(
    (b) => b.facilityId === facilityId && b.date === date && b.status === 'upcoming'
  );
};

export const generateTimeSlots = (startHour = 9, endHour = 17) => {
  const slots = [];
  for (let hour = startHour; hour <= endHour; hour++) {
    slots.push(`${String(hour).padStart(2, '0')}:00`);
  }
  return slots;
};

