# WinSpot Architecture Diagram

This diagram reflects the current monorepo structure and backend integrations found in code.

## System Overview

```mermaid
flowchart LR
    subgraph Clients
        FW[frontendWeb\nReact + Vite]
        AD[adminDashboard\nReact + Vite]
        FM[frontend-mobile\nExpo / React Native]
    end

    subgraph API[Backend API - Node.js + Express]
        APP[app.js / routes]
        AUTH[JWT Auth Middleware\nauth.js + adminAuth.js]
        CTRLS[Domain Controllers\nusers, offers, transactions, missions, qr, auth]
        AIR[AI Route\n/api/ai/verify-scan]
    end

    DB[(MongoDB)]
    UP[(uploads/ local storage)]
    OCR[Tesseract.js + Jimp\nOCR pipeline]
    LLM[Ollama LLaVA\nhttp://localhost:11434]

    FW -->|REST /api/*| APP
    AD -->|REST /api/admin/*| APP
    FM -->|REST /api/*| APP

    APP --> AUTH
    AUTH --> CTRLS
    CTRLS --> DB

    APP --> AIR
    AIR --> UP
    AIR --> OCR
    AIR --> LLM
    AIR --> DB

    APP -->|serves /uploads| UP
```

## Main Request Paths

1. Auth and user flows:
- Clients call `/api/auth/*`.
- Backend issues JWT tokens and protects private routes via `Authorization: Bearer <token>`.

2. Business flows:
- Merchants create offers and reserve WinCoins budget.
- Influencers receive gains or request withdrawals.
- Admin reviews withdrawals, top-ups, and AI verification data.

3. AI verification flow:
- Client uploads image to `/api/ai/verify-scan` (multer -> `uploads/`).
- OCR extracts visible text (`tesseract.js` + preprocessing via `jimp`).
- Scene classification calls local Ollama LLaVA.
- Result is stored in `FineTuneData` and linked to a transaction when provided.

## Route Map (High Level)

- `/api/health`
- `/api/auth`
- `/api/admin`
- `/api/offers`
- `/api/transactions`
- `/api/users`
- `/api/missions`
- `/api/qr`
- `/api/ai`
