# Setup Instructions

## Quick Start Guide

Follow these steps to get both frontend and backend running:

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env and set:
# JWT_SECRET=your-random-secret-key-here
# PORT=3001
# FRONTEND_URL=http://localhost:3000

# Start the backend server
npm run dev
```

The backend will run on `http://localhost:3001`

### 2. Frontend Setup

```bash
# Navigate to project root
cd ..

# Install dependencies
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:3001/api" > .env

# Start the frontend
npm run dev
```

The frontend will run on `http://localhost:3000`

### 3. Login

1. Open `http://localhost:3000` in your browser
2. You'll be redirected to the login page
3. Use demo credentials:
   - Email: `user@pradita.ac.id`
   - Password: `any password` (authentication is simplified for demo)

Or register a new account!

## Project Structure

```
quiz-pwa-mobile/
├── backend/              # Node.js Express API
│   ├── src/
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Auth middleware
│   │   ├── data/          # In-memory data storage
│   │   └── server.js      # Express server
│   ├── package.json
│   └── .env
│
├── src/                   # React frontend
│   ├── components/        # UI components
│   ├── screens/           # Page components
│   ├── services/          # API service
│   ├── hooks/             # Custom hooks
│   └── App.tsx
│
└── package.json
```

## API Communication

The frontend and backend communicate via REST API:

- **Backend**: `http://localhost:3001/api`
- **Frontend**: `http://localhost:3000`
- **CORS**: Enabled for frontend origin

## Features

✅ **Authentication** - JWT-based login/register
✅ **Facilities** - Get all facilities and availability
✅ **Bookings** - Create, view, and cancel bookings
✅ **Booking Limits** - Max 2 bookings per day
✅ **Profile** - View and edit user profile
✅ **Real-time** - In-memory data (resets on server restart)

## Troubleshooting

### Backend won't start
- Check if port 3001 is available
- Verify `.env` file exists and has correct values
- Run `npm install` in backend directory

### Frontend can't connect to API
- Verify backend is running on port 3001
- Check `VITE_API_URL` in frontend `.env` file
- Check browser console for CORS errors

### Authentication issues
- Clear browser localStorage: `localStorage.clear()`
- Check JWT_SECRET is set in backend `.env`
- Verify token is being stored after login

## Development

- Backend auto-reloads with `npm run dev` (nodemon)
- Frontend auto-reloads with Vite HMR
- Data resets when backend restarts (in-memory storage)

## Production

For production deployment:
1. Set `NODE_ENV=production` in backend `.env`
2. Use a strong `JWT_SECRET`
3. Update `FRONTEND_URL` to production domain
4. Update `VITE_API_URL` in frontend to production API URL
5. Build frontend: `npm run build`

