# VR Lab Booking Portal - PWA

A Progressive Web App (PWA) for managing lab facility reservations at Universitas Pradita. Built with React, TypeScript, and Tailwind CSS.

## Features

- **Dark Mode UI** - Modern, tech/gaming-inspired dark theme
- **Facility Booking** - Book Soldering Stations, Development PCs, and VR Headsets
- **Time Slot Selection** - Interactive calendar and time slot picker
- **Booking Management** - View and manage your upcoming and past bookings
- **Mobile-First Design** - Optimized for Android mobile devices

## Technology Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Vite** - Build tool

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Basic UI components (Button, Card, Badge)
│   ├── layout/         # Layout components (TopBar, BottomNav, AppShell)
│   ├── facilities/     # Facility-related components
│   └── booking/        # Booking flow components
├── screens/            # Page components
├── types/              # TypeScript type definitions
├── data/               # Mock data and helpers
├── App.tsx             # Main app component with routing
└── main.tsx            # Entry point
```

## Design System

### Colors
- Background: `#0F172A` (Slate 900)
- Cards: `#1E293B` (Slate 800)
- Primary: Gradient `#6366F1` → `#818CF8` (Indigo)
- Available: `#10B981` (Emerald)
- Booked/Full: `#EF4444` (Red) or `#64748B` (Slate)

### Typography
- Font: Inter (fallback: Roboto)
- Primary Text: `#F8FAFC` (Slate 50)
- Secondary Text: `#94A3B8` (Slate 400)

## API Integration

The app is fully integrated with API calls. All mock data has been replaced with real API endpoints.

### Configuration

1. Create a `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:3001/api
```

2. For production, update the URL to your production API endpoint.

### API Endpoints

The app expects the following endpoints from your Node.js backend:

#### Facilities
- `GET /api/facilities` - Get all facilities
- `GET /api/facilities/:id` - Get facility by ID
- `GET /api/facilities/:id/availability?date=YYYY-MM-DD` - Get availability for a date

#### Bookings
- `POST /api/bookings` - Create a new booking
- `GET /api/bookings` - Get all bookings for current user
- `GET /api/bookings?status=upcoming` - Get upcoming bookings
- `GET /api/bookings?status=completed,cancelled` - Get booking history
- `GET /api/bookings/:id` - Get booking by ID
- `POST /api/bookings/:id/cancel` - Cancel a booking
- `GET /api/bookings/check-limit?facilityId=xxx&date=YYYY-MM-DD` - Check booking limit

#### Profile
- `GET /api/profile` - Get current user profile
- `PUT /api/profile` - Update user profile

### Authentication

The app expects JWT token-based authentication. The token should be stored in `localStorage` with the key `authToken`. The API service automatically includes this token in the `Authorization` header.

### Features Implemented

✅ **Booking with Limit Checking** - Checks if user has reached booking limit before allowing booking
✅ **Booking History** - Fetches and displays booking history
✅ **Cancellation** - Allows users to cancel upcoming bookings
✅ **Edit Profile** - Full profile editing functionality with form validation
✅ **Loading States** - All screens show loading indicators
✅ **Error Handling** - Comprehensive error handling with user-friendly messages

## Facilities

1. **Soldering Workstation**
   - Available: Soldering iron, multimeter, helping hand
   - Users must bring their own flux and solder
   - On-site only

2. **Development PCs**
   - 3 PCs available
   - On-site only

3. **VR Headsets (Meta Quest)**
   - Option 1: Headset only
   - Option 2: Headset + KAT VR Treadmill
   - On-site only

## PWA Installation

Aplikasi ini adalah Progressive Web App (PWA) yang bisa diinstall di Android:

### Install di Android:

1. **Via Browser Chrome:**
   - Buka aplikasi di Chrome Android
   - Akan muncul popup "Add to Home Screen" atau "Install App"
   - Klik "Install"

2. **Manual:**
   - Tap menu (3 dots) di Chrome
   - Pilih "Add to Home screen" atau "Install app"
   - Konfirmasi dengan tap "Add"

3. **Via Install Prompt:**
   - Aplikasi akan menampilkan prompt install otomatis setelah beberapa detik

Setelah terinstall, aplikasi akan muncul di home screen seperti aplikasi native dan bisa berjalan offline.

Lihat `PWA_SETUP.md` untuk detail lebih lengkap.

## Future Enhancements

- Real-time availability updates
- Push notifications for booking reminders
- Enhanced offline support

## License

This project is for educational purposes at Universitas Pradita.

