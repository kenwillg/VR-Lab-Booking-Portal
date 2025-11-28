/**
 * API Service for VR Lab Booking Portal
 * 
 * Base URL should be configured via environment variables
 * In production, set VITE_API_URL in your .env file
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface Facility {
  id: string;
  type: 'soldering' | 'development-pc' | 'vr-headset';
  name: string;
  description: string;
  availableItems?: string;
  note?: string;
  icon: string;
}

export interface FacilityAvailability {
  facilityId: string;
  date: string;
  availableSlots: string[];
  bookedSlots: string[];
  availableCount?: number; // For Development PCs
  totalCount?: number; // For Development PCs
}

export interface BookingRequest {
  facilityId: string;
  date: string;
  timeSlots: string[];
  options?: string; // For VR: "Headset Only" or "Headset + KAT VR Treadmill"
}

export interface Booking {
  id: string;
  facilityId: string;
  facilityName: string;
  facilityType: 'soldering' | 'development-pc' | 'vr-headset';
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  status: 'upcoming' | 'completed' | 'cancelled';
  location: string;
  options?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  nim?: string;
  nidn?: string;
  programStudi?: string;
  fakultas?: string;
  avatar?: string;
}

export interface UpdateProfileRequest {
  name?: string;
  nim?: string;
  nidn?: string;
  programStudi?: string;
  fakultas?: string;
}

/**
 * Generic API request handler
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const token = localStorage.getItem('authToken'); // Assuming token-based auth
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || data.message || 'An error occurred',
      };
    }

    return {
      success: true,
      data: data.data || data,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error occurred',
    };
  }
}

/**
 * Facilities API
 */
export const facilitiesApi = {
  /**
   * Get all available facilities
   */
  getAll: async (): Promise<ApiResponse<Facility[]>> => {
    return apiRequest<Facility[]>('/facilities');
  },

  /**
   * Get facility by ID
   */
  getById: async (id: string): Promise<ApiResponse<Facility>> => {
    return apiRequest<Facility>(`/facilities/${id}`);
  },

  /**
   * Get facility availability for a specific date
   */
  getAvailability: async (
    facilityId: string,
    date: string
  ): Promise<ApiResponse<FacilityAvailability>> => {
    return apiRequest<FacilityAvailability>(
      `/facilities/${facilityId}/availability?date=${date}`
    );
  },
};

/**
 * Bookings API
 */
export const bookingsApi = {
  /**
   * Create a new booking
   * Returns error if booking limit is reached
   */
  create: async (
    booking: BookingRequest
  ): Promise<ApiResponse<Booking>> => {
    return apiRequest<Booking>('/bookings', {
      method: 'POST',
      body: JSON.stringify(booking),
    });
  },

  /**
   * Get all bookings for the current user
   */
  getAll: async (): Promise<ApiResponse<Booking[]>> => {
    return apiRequest<Booking[]>('/bookings');
  },

  /**
   * Get upcoming bookings
   */
  getUpcoming: async (): Promise<ApiResponse<Booking[]>> => {
    return apiRequest<Booking[]>('/bookings?status=upcoming');
  },

  /**
   * Get booking history
   */
  getHistory: async (): Promise<ApiResponse<Booking[]>> => {
    return apiRequest<Booking[]>('/bookings?status=completed,cancelled');
  },

  /**
   * Get booking by ID
   */
  getById: async (id: string): Promise<ApiResponse<Booking>> => {
    return apiRequest<Booking>(`/bookings/${id}`);
  },

  /**
   * Cancel a booking
   */
  cancel: async (id: string): Promise<ApiResponse<Booking>> => {
    return apiRequest<Booking>(`/bookings/${id}/cancel`, {
      method: 'POST',
    });
  },
};

/**
 * User/Profile API
 */
export const profileApi = {
  /**
   * Get current user profile
   */
  get: async (): Promise<ApiResponse<UserProfile>> => {
    return apiRequest<UserProfile>('/profile');
  },

  /**
   * Update user profile
   */
  update: async (
    updates: UpdateProfileRequest
  ): Promise<ApiResponse<UserProfile>> => {
    return apiRequest<UserProfile>('/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },
};

/**
 * Check if user has reached booking limit
 */
export const checkBookingLimit = async (
  facilityId: string,
  date: string
): Promise<ApiResponse<{ canBook: boolean; reason?: string }>> => {
  return apiRequest<{ canBook: boolean; reason?: string }>(
    `/bookings/check-limit?facilityId=${facilityId}&date=${date}`
  );
};

