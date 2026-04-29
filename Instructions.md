# WinSpot — Developer Setup Guide

A full-stack app with a **React web frontend**, **React Native (Expo) mobile frontend**, and a **Node.js/Express backend** connected to MongoDB Atlas and Clerk authentication.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Backend Setup](#backend-setup)
- [Frontend (Web) Setup](#frontend-web-setup)
- [Frontend Mobile (Expo) Setup](#frontend-mobile-expo-setup)
- [Clerk Webhook (Local Development)](#clerk-webhook-local-development)
- [Testing the Full Flow](#testing-the-full-flow)

---

## Prerequisites

Make sure you have these installed before starting:

- [Node.js](https://nodejs.org/) v18 or higher
- [npm](https://www.npmjs.com/) v9 or higher
- [Expo CLI](https://docs.expo.dev/get-started/installation/) — `npm install -g expo-cli`
- [ngrok](https://ngrok.com/) — `npm install -g ngrok`
- A [MongoDB Atlas](https://cloud.mongodb.com/) account with a cluster created
- A [Clerk](https://clerk.com/) account with an application created

---

## Project Structure

```
WinSpot/
├── backend/                  # Express API server
│   └── src/
│       ├── config/db.js      # MongoDB connection
│       ├── models/User.js    # Mongoose User schema
│       ├── routes/
│       │   ├── health.js
│       │   └── clerkWebhook.js
│       ├── app.js
│       └── index.js
├── frontend/                 # React web app
└── frontend-mobile/          # React Native Expo app
    └── App.tsx
```

---

## Environment Variables

### Backend — `backend/.env`

```env
PORT=4000
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/winspot?appName=Winspot
CLERK_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxx
```

> Get `MONGODB_URI` from MongoDB Atlas → your cluster → Connect → Drivers.
> Get `CLERK_WEBHOOK_SECRET` from Clerk Dashboard → Webhooks → your endpoint → Signing Secret.

### Frontend Web — `frontend/.env`

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxx
```

### Frontend Mobile — `frontend-mobile/.env`

```env
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxx
```

> Get both Clerk keys from Clerk Dashboard → API Keys.

---

## Backend Setup

```bash
# 1. Navigate to backend
cd backend

# 2. Install dependencies
npm install

# 3. Create and fill in your .env file (see above)

# 4. Start the development server
npm run dev
```

You should see:
```
✅ Connected to MongoDB
🚀 Backend listening on http://localhost:4000
```

### Verify it's running

Open your browser and go to:
```
http://localhost:4000/health
```

Expected response:
```json
{ "ok": true, "service": "WinSpot API", "timestamp": "..." }
```

---

## Frontend (Web) Setup

```bash
# 1. Navigate to frontend
cd frontend

# 2. Install dependencies
npm install

# 3. Create and fill in your .env file (see above)

# 4. Start the development server
npm run dev
```

The web app will be available at `http://localhost:5173` (or similar — check terminal output).

---

## Frontend Mobile (Expo) Setup

```bash
# 1. Navigate to mobile frontend
cd frontend-mobile

# 2. Install dependencies
npm install

# 3. Create and fill in your .env file (see above)

# 4. Start Expo
npx expo start
```

Then:
- Press `a` to open on Android emulator
- Press `i` to open on iOS simulator
- Scan the QR code with the **Expo Go** app on your physical device

---

## Clerk Webhook (Local Development)

Clerk needs a **public URL** to send user events (sign up, update, delete) to your local backend. We use **ngrok** for this.

### Step 1 — Start ngrok (in a separate terminal)

```bash
ngrok http 4000
```

You'll see a forwarding URL like:
```
Forwarding: https://xxxx-xxxx.ngrok-free.app -> http://localhost:4000
```

> ⚠️ Free ngrok generates a new URL every restart. You'll need to update the Clerk webhook URL each time unless you set up a static domain.

### Step 2 — Register the Webhook in Clerk

1. Go to [dashboard.clerk.com](https://dashboard.clerk.com)
2. Select your app → **Webhooks** → **Add Endpoint**
3. Set the URL to:
   ```
   https://xxxx-xxxx.ngrok-free.app/api/webhooks/clerk
   ```
4. Subscribe to events: `user.created`, `user.updated`, `user.deleted`
5. Click **Create**
6. Copy the **Signing Secret** (`whsec_...`) → paste it into `backend/.env` as `CLERK_WEBHOOK_SECRET`
7. Restart the backend

### Step 3 — MongoDB Atlas Network Access

Make sure your IP is whitelisted:
1. Go to [cloud.mongodb.com](https://cloud.mongodb.com)
2. Your project → **Network Access** → **Add IP Address**
3. Click **Allow Access from Anywhere** (`0.0.0.0/0`) → **Confirm**

---

## Testing the Full Flow

Run all three in separate terminals:

| Terminal | Command | Directory |
|---|---|---|
| 1 | `npm run dev` | `backend/` |
| 2 | `npm run dev` | `frontend/` |
| 3 | `ngrok http 4000` | anywhere |

### Test user sync

1. Open the web app or mobile app
2. Sign up with a new account (use a real email, first name, and last name)
3. Check the **backend terminal** — you should see:
   ```
   Clerk webhook received: user.created
   ✅ User saved to MongoDB: user_xxxxxxxxx
   ```
4. Check MongoDB Atlas → **Browse Collections** → `winspot` → `users` to see the saved user

### Expected user document in MongoDB

```json
{
  "_id": "...",
  "clerkId": "user_xxxxxxxxx",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "avatar": "https://...",
  "createdAt": "2025-04-29T...",
  "updatedAt": "2025-04-29T..."
}
```

---

## Common Issues

**`Failed to start backend — ECONNREFUSED`**
→ Your IP isn't whitelisted in MongoDB Atlas. Go to Network Access and allow `0.0.0.0/0`.

**`400 Bad Request` on webhook**
→ `CLERK_WEBHOOK_SECRET` is wrong or missing. Get it from Clerk Dashboard → Webhooks → your endpoint → Signing Secret.

**`500 Internal Server Error` on webhook**
→ Backend can't reach MongoDB. Check that `MONGODB_URI` is correct in `.env` and the server restarted after changes.

**ngrok URL changed after restart**
→ Update the endpoint URL in Clerk Dashboard → Webhooks → your endpoint → Update URL.

**First/Last name not saving**
→ Make sure **Personal information → First name & Last name** are enabled in Clerk Dashboard → User & Authentication → Email, Phone, Username.
