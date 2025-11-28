import express from 'express';
import {
  bookings,
  getBookingById,
  getBookingsByUserId,
  getFacilityById,
  getBookingsByFacilityAndDate,
  generateTimeSlots,
} from '../data/mockData.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All booking routes require authentication
router.use(authenticateToken);

// Check booking limit
router.get('/check-limit', (req, res) => {
  const { facilityId, date } = req.query;
  const userId = req.user.userId;

  if (!facilityId || !date) {
    return res.status(400).json({
      success: false,
      error: 'facilityId and date are required',
    });
  }

  // Check how many bookings user has for this date
  const userBookingsToday = bookings.filter(
    (b) => b.userId === userId && b.date === date && b.status === 'upcoming'
  );

  // Limit: max 2 bookings per day
  const maxBookingsPerDay = 2;
  const canBook = userBookingsToday.length < maxBookingsPerDay;

  res.json({
    success: true,
    data: {
      canBook,
      reason: canBook
        ? null
        : `Maximum ${maxBookingsPerDay} bookings per day allowed`,
    },
  });
});

// Create a new booking
router.post('/', (req, res) => {
  try {
    const { facilityId, date, timeSlots, options } = req.body;
    const userId = req.user.userId;

    if (!facilityId || !date || !timeSlots || timeSlots.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'facilityId, date, and timeSlots are required',
      });
    }

    // Validate time slots are consecutive
    const sortedSlots = [...timeSlots].sort();
    for (let i = 1; i < sortedSlots.length; i++) {
      const [prevHour] = sortedSlots[i - 1].split(':').map(Number);
      const [currHour] = sortedSlots[i].split(':').map(Number);
      if (currHour !== prevHour + 1) {
        return res.status(400).json({
          success: false,
          error: 'Time slots must be consecutive',
        });
      }
    }

    // Check booking limit
    const userBookingsToday = bookings.filter(
      (b) => b.userId === userId && b.date === date && b.status === 'upcoming'
    );
    if (userBookingsToday.length >= 2) {
      return res.status(400).json({
        success: false,
        error: 'Maximum 2 bookings per day allowed',
      });
    }

    // Check if slots are available
    const facility = getFacilityById(facilityId);
    if (!facility) {
      return res.status(404).json({
        success: false,
        error: 'Facility not found',
      });
    }

    const existingBookings = getBookingsByFacilityAndDate(facilityId, date);
    const bookedSlots = existingBookings.flatMap((booking) => {
      const slots = [];
      const [startHour] = booking.startTime.split(':').map(Number);
      const [endHour] = booking.endTime.split(':').map(Number);
      for (let hour = startHour; hour < endHour; hour++) {
        slots.push(`${String(hour).padStart(2, '0')}:00`);
      }
      return slots;
    });

    const requestedSlots = timeSlots;
    const conflictSlots = requestedSlots.filter((slot) => bookedSlots.includes(slot));

    if (conflictSlots.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Time slots ${conflictSlots.join(', ')} are already booked`,
      });
    }

    // Create booking
    const startTime = sortedSlots[0];
    const endTime = `${String(
      parseInt(sortedSlots[sortedSlots.length - 1].split(':')[0]) + 1
    ).padStart(2, '0')}:00`;
    const duration = sortedSlots.length;

    const newBooking = {
      id: `booking-${Date.now()}`,
      userId,
      facilityId,
      facilityName: facility.name,
      facilityType: facility.type,
      date,
      startTime,
      endTime,
      duration,
      status: 'upcoming',
      location: facility.location,
      options: options || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    bookings.push(newBooking);

    res.status(201).json({
      success: true,
      data: newBooking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Get all bookings for current user
router.get('/', (req, res) => {
  const userId = req.user.userId;
  const { status } = req.query;

  let userBookings = getBookingsByUserId(userId);

  if (status) {
    const statuses = status.split(',');
    userBookings = userBookings.filter((b) => statuses.includes(b.status));
  }

  // Sort by date (upcoming first)
  userBookings.sort((a, b) => {
    if (a.date !== b.date) {
      return a.date.localeCompare(b.date);
    }
    return a.startTime.localeCompare(b.startTime);
  });

  res.json({
    success: true,
    data: userBookings,
  });
});

// Get booking by ID
router.get('/:id', (req, res) => {
  const booking = getBookingById(req.params.id);
  const userId = req.user.userId;

  if (!booking) {
    return res.status(404).json({
      success: false,
      error: 'Booking not found',
    });
  }

  if (booking.userId !== userId) {
    return res.status(403).json({
      success: false,
      error: 'Access denied',
    });
  }

  res.json({
    success: true,
    data: booking,
  });
});

// Cancel a booking
router.post('/:id/cancel', (req, res) => {
  const booking = getBookingById(req.params.id);
  const userId = req.user.userId;

  if (!booking) {
    return res.status(404).json({
      success: false,
      error: 'Booking not found',
    });
  }

  if (booking.userId !== userId) {
    return res.status(403).json({
      success: false,
      error: 'Access denied',
    });
  }

  if (booking.status !== 'upcoming') {
    return res.status(400).json({
      success: false,
      error: 'Only upcoming bookings can be cancelled',
    });
  }

  booking.status = 'cancelled';
  booking.updatedAt = new Date().toISOString();

  res.json({
    success: true,
    data: booking,
  });
});

export default router;

