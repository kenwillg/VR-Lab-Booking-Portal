# VR Lab Booking Backend API

Simple Express.js API for the VR Lab Booking Portal. Uses in-memory data storage (no database required).

## Features

- ✅ RESTful API endpoints
- ✅ JWT authentication
- ✅ Booking limit checking
- ✅ CORS enabled for frontend communication
- ✅ In-memory data storage (no database setup needed)

## Quick Start

1. **Install dependencies:**
```bash
cd backend
npm install
```

2. **Set up environment variables:**
```bash
cp .env.example .env
```

Edit `.env` and set:
- `JWT_SECRET` - Any random string (e.g., `my-super-secret-key-123`)
- `PORT` - Server port (default: 3001)
- `FRONTEND_URL` - Your frontend URL (default: http://localhost:3000)

3. **Start the server:**
```bash
npm run dev
```

The API will be available at `http://localhost:3001/api`

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login user
- `POST /api/auth/register` - Register new user

### Facilities
- `GET /api/facilities` - Get all facilities
- `GET /api/facilities/:id` - Get facility by ID
- `GET /api/facilities/:id/availability?date=YYYY-MM-DD` - Get availability

### Bookings (Requires Authentication)
- `GET /api/bookings/check-limit?facilityId=xxx&date=YYYY-MM-DD` - Check booking limit
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - Get all bookings
- `GET /api/bookings?status=upcoming` - Get upcoming bookings
- `GET /api/bookings?status=completed,cancelled` - Get booking history
- `GET /api/bookings/:id` - Get booking by ID
- `POST /api/bookings/:id/cancel` - Cancel booking

### Profile (Requires Authentication)
- `GET /api/profile` - Get current user profile
- `PUT /api/profile` - Update profile

## Default User

For testing, you can use:
- Email: `user@pradita.ac.id`
- Password: Any password (authentication is simplified for demo)

Or register a new user via `POST /api/auth/register`

## Data Storage

All data is stored in memory in `src/data/mockData.js`. Data will reset when the server restarts.

## Frontend Integration

The frontend is already configured to connect to this API. Make sure:
1. Backend is running on port 3001
2. Frontend has `VITE_API_URL=http://localhost:3001/api` in `.env`
3. Frontend is running on port 3000 (or update CORS in backend)

## Development

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

