# Quick Start Guide

## Step 1: Start the Backend

```bash
cd backend
npm install
```

Create a `.env` file:
```bash
# Copy the example
cp .env.example .env
```

Or create `.env` manually with:
```
JWT_SECRET=your-super-secret-jwt-key-change-this
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

Then start the server:
```bash
npm run dev
```

You should see:
```
🚀 Server running on http://localhost:3001
📡 API available at http://localhost:3001/api
🌐 Frontend URL: http://localhost:3000
```

## Step 2: Start the Frontend

In a new terminal, from the project root:
```bash
npm install
```

Create a `.env` file in the root:
```
VITE_API_URL=http://localhost:3001/api
```

Then start the frontend:
```bash
npm run dev
```

## Step 3: Test the Connection

1. Open `http://localhost:3000` in your browser
2. You should be redirected to the login page
3. Try logging in with:
   - Email: `user@pradita.ac.id`
   - Password: `any password`

## Troubleshooting

### "CORS request did not succeed" Error

This usually means the backend is not running. Check:

1. **Is the backend running?**
   - Go to `http://localhost:3001/api/health` in your browser
   - You should see: `{"success":true,"message":"VR Lab Booking API is running",...}`
   - If you get an error, the backend is not running

2. **Check the backend terminal**
   - Look for any error messages
   - Make sure it says "Server running on http://localhost:3001"

3. **Check ports**
   - Backend should be on port 3001
   - Frontend should be on port 3000
   - Make sure nothing else is using these ports

4. **Check .env files**
   - Backend: `backend/.env` should exist
   - Frontend: `.env` in root should have `VITE_API_URL=http://localhost:3001/api`

### Backend won't start

- Make sure you're in the `backend` directory
- Run `npm install` first
- Check if port 3001 is already in use
- Look for error messages in the terminal

### Frontend can't connect

- Verify backend is running (check `http://localhost:3001/api/health`)
- Check browser console for errors
- Verify `.env` file has correct `VITE_API_URL`

