import express from 'express';
import {
  facilities,
  getFacilityById,
  getBookingsByFacilityAndDate,
  generateTimeSlots,
} from '../data/mockData.js';

const router = express.Router();

// Get all facilities
router.get('/', (req, res) => {
  res.json({
    success: true,
    data: facilities,
  });
});

// Get facility by ID
router.get('/:id', (req, res) => {
  const facility = getFacilityById(req.params.id);

  if (!facility) {
    return res.status(404).json({
      success: false,
      error: 'Facility not found',
    });
  }

  res.json({
    success: true,
    data: facility,
  });
});

// Get facility availability for a specific date
router.get('/:id/availability', (req, res) => {
  const { id } = req.params;
  const { date } = req.query;

  if (!date) {
    return res.status(400).json({
      success: false,
      error: 'Date parameter is required',
    });
  }

  const facility = getFacilityById(id);
  if (!facility) {
    return res.status(404).json({
      success: false,
      error: 'Facility not found',
    });
  }

  // Get all bookings for this facility on this date
  const existingBookings = getBookingsByFacilityAndDate(id, date);
  
  // Generate all possible time slots
  const allSlots = generateTimeSlots(9, 17);
  
  // Get booked slots
  const bookedSlots = existingBookings.flatMap((booking) => {
    const slots = [];
    const [startHour] = booking.startTime.split(':').map(Number);
    const [endHour] = booking.endTime.split(':').map(Number);
    for (let hour = startHour; hour < endHour; hour++) {
      slots.push(`${String(hour).padStart(2, '0')}:00`);
    }
    return slots;
  });

  // Available slots are those not booked
  const availableSlots = allSlots.filter((slot) => !bookedSlots.includes(slot));

  // For Development PCs, calculate available count
  let availableCount = null;
  let totalCount = null;
  if (facility.type === 'development-pc') {
    totalCount = facility.maxCapacity || 3;
    // Count unique bookings (each booking uses one PC)
    // Only count 'upcoming' bookings (cancelled/completed don't count)
    const activeBookings = existingBookings.filter(b => b.status === 'upcoming');
    const bookedCount = activeBookings.length;
    availableCount = Math.max(0, totalCount - bookedCount);
    
    // Debug logging in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Availability] Facility: ${facility.name}, Date: ${date}`);
      console.log(`  Total PCs: ${totalCount}, Booked: ${bookedCount}, Available: ${availableCount}`);
    }
  }

  res.json({
    success: true,
    data: {
      facilityId: id,
      date,
      availableSlots,
      bookedSlots,
      availableCount,
      totalCount,
    },
  });
});

export default router;

