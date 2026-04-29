# WinSpot

Monorepo starter for:

- Web: React + Vite
- Backend: Node.js + Express + MongoDB
- Mobile: React Native + Expo

## Apps

- `frontend` - web client
- `backend` - API server and MongoDB connection
- `mobile` - Expo mobile app

## Run locally

Install dependencies in each workspace, then run the app you want:

- `npm run dev:backend`
- `npm run dev:frontend`
- `npm run dev:mobile`

To use the mobile app with Expo Go, run `npm run dev:mobile` from the repo root, then scan the QR code with the Expo Go app on your Android device or open it from the Expo Go app running inside the Android emulator.

If an Android emulator is already running, `npm run dev:mobile` will try to open the app on it automatically.

This mobile setup stays in managed Expo, so no `android` or `ios` folders need to be generated.

## Environment

- `backend/.env.example` contains the MongoDB connection string and API port.
- `frontend/.env.example` sets the web client backend URL.
- `mobile/.env.example` sets the Expo public backend URL for future API calls.

# WinSpot