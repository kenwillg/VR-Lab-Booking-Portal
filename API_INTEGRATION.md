# API Integration Guide

This document describes the API endpoints and data structures expected by the PWA frontend.

## Base URL

The API base URL is configured via the `VITE_API_URL` environment variable. Default: `http://localhost:3001/api`

## Authentication

All API requests (except login/register) require authentication via JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

The token should be stored in `localStorage` with key `authToken`.

## API Endpoints

### Facilities

#### Get All Facilities
```
GET /facilities
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "soldering-1",
      "type": "soldering",
      "name": "Soldering Workstation",
      "description": "Tersedia: Iron, Multimeter, Helping Hand.",
      "note": "Harap bawa timah & flux sendiri.",
      "icon": "🔧"
    }
  ]
}
```

#### Get Facility by ID
```
GET /facilities/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "vr-1",
    "type": "vr-headset",
    "name": "VR Headsets",
    "description": "Meta Quest 3. Opsi tambahan: KAT VR Treadmill.",
    "icon": "🥽"
  }
}
```

#### Get Facility Availability
```
GET /facilities/:id/availability?date=2024-10-27
```

**Response:**
```json
{
  "success": true,
  "data": {
    "facilityId": "vr-1",
    "date": "2024-10-27",
    "availableSlots": ["09:00", "10:00", "11:00", "13:00"],
    "bookedSlots": ["12:00", "14:00"],
    "availableCount": 2,  // For Development PCs
    "totalCount": 3        // For Development PCs
  }
}
```

### Bookings

#### Create Booking
```
POST /bookings
Content-Type: application/json

{
  "facilityId": "vr-1",
  "date": "2024-10-27",
  "timeSlots": ["14:00", "15:00"],
  "options": "Headset + KAT VR Treadmill"  // Optional, for VR only
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "booking-123",
    "facilityId": "vr-1",
    "facilityName": "VR Zone",
    "facilityType": "vr-headset",
    "date": "2024-10-27",
    "startTime": "14:00",
    "endTime": "16:00",
    "duration": 2,
    "status": "upcoming",
    "location": "Lab Lt. 3",
    "options": "Headset + KAT VR Treadmill",
    "createdAt": "2024-10-26T10:00:00Z",
    "updatedAt": "2024-10-26T10:00:00Z"
  }
}
```

**Error Response (Booking Limit Reached):**
```json
{
  "success": false,
  "error": "Booking limit reached for this date"
}
```

#### Get All Bookings
```
GET /bookings
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "booking-123",
      "facilityId": "vr-1",
      "facilityName": "VR Zone",
      "facilityType": "vr-headset",
      "date": "2024-10-27",
      "startTime": "14:00",
      "endTime": "16:00",
      "duration": 2,
      "status": "upcoming",
      "location": "Lab Lt. 3",
      "options": "Headset + KAT VR Treadmill"
    }
  ]
}
```

#### Get Upcoming Bookings
```
GET /bookings?status=upcoming
```

#### Get Booking History
```
GET /bookings?status=completed,cancelled
```

#### Cancel Booking
```
POST /bookings/:id/cancel
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "booking-123",
    "status": "cancelled",
    ...
  }
}
```

#### Check Booking Limit
```
GET /bookings/check-limit?facilityId=vr-1&date=2024-10-27
```

**Response:**
```json
{
  "success": true,
  "data": {
    "canBook": true,
    "reason": null
  }
}
```

Or if limit reached:
```json
{
  "success": true,
  "data": {
    "canBook": false,
    "reason": "Maximum 2 bookings per day allowed"
  }
}
```

### Profile

#### Get Profile
```
GET /profile
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user-123",
    "name": "John Doe",
    "email": "john@univ.ac.id",
    "nim": "123456789",
    "nidn": null,
    "programStudi": "Teknik Informatika",
    "fakultas": "Fakultas Teknologi Informasi",
    "avatar": null
  }
}
```

#### Update Profile
```
PUT /profile
Content-Type: application/json

{
  "name": "John Doe Updated",
  "nim": "123456789",
  "programStudi": "Teknik Informatika",
  "fakultas": "Fakultas Teknologi Informasi"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "user-123",
    "name": "John Doe Updated",
    ...
  }
}
```

## Error Handling

All endpoints should return errors in this format:

```json
{
  "success": false,
  "error": "Error message here"
}
```

Or:

```json
{
  "success": false,
  "message": "Error message here"
}
```

HTTP status codes:
- `200` - Success
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

## Data Types

### Facility Types
- `soldering` - Soldering Workstation
- `development-pc` - Development PCs
- `vr-headset` - VR Headsets

### Booking Status
- `upcoming` - Future booking
- `completed` - Past completed booking
- `cancelled` - Cancelled booking

## Notes

1. All dates should be in ISO 8601 format: `YYYY-MM-DD`
2. All times should be in 24-hour format: `HH:MM`
3. The frontend automatically handles loading states and error messages
4. The booking limit check should be performed server-side to prevent abuse

