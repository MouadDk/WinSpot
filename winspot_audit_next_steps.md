# 🔍 WinSpot — Full Application Audit & Next Steps

> Comprehensive review of bugs, logic issues, security concerns, UX problems, and improvement roadmap across all layers (backend, frontend web, admin dashboard, mobile).

---

## 🐛 BUGS (Must Fix Now)


### BUG-4: Mobile App Still Uses Old Mock Data (Missions, Venues, Reputation)
**Files:** [IndexScreen.tsx](file:///c:/Users/Mouad/OneDrive/Desktop/WinSpot/frontend-mobile/screens/tabs/Index/IndexScreen.tsx), [ExploreScreen.tsx](file:///c:/Users/Mouad/OneDrive/Desktop/WinSpot/frontend-mobile/screens/tabs/Explore/ExploreScreen.tsx), [WalletScreen.tsx](file:///c:/Users/Mouad/OneDrive/Desktop/WinSpot/frontend-mobile/screens/tabs/Wallet/WalletScreen.tsx)
**Severity:** 🟠 High (App is non-functional)

The mobile app is still using `AppDataContext` with mock data (`missions`, `venues`, `reputation`, `completedMissionIds`). None of these concepts exist in the pivoted backend. The entire mobile app needs to be rewired to consume the real backend APIs:
- `/api/offers` → Browse active offers
- `/api/qr/redeem` → Scan QR codes
- `/api/transactions/balance` → Wallet balance
- `/api/qr/my/history` → Cashback history

---


## ⚠️ LOGIC & SECURITY ISSUES

### SEC-2: Google OAuth Endpoint Trusts Client-Side Decoded JWT
**File:** [authController.js](file:///c:/Users/Mouad/OneDrive/Desktop/WinSpot/backend/src/controllers/authController.js#L93-L149)  
**Also:** [CustomerAuth.jsx](file:///c:/Users/Mouad/OneDrive/Desktop/WinSpot/frontendWeb/src/pages/CustomerAuth.jsx#L24-L43)

The frontend decodes the Google JWT on the client side and sends raw `email`, `firstName`, `googleId` to the backend. The backend trusts this data without verifying the Google ID token server-side. **Anyone can register as any email by sending a fake request.**

**Fix:** Send the raw `credential` token to the backend and verify it server-side using `google-auth-library`.

### SEC-3: Deleting a User Doesn't Clean Up Their Data
**File:** [admin.js](file:///c:/Users/Mouad/OneDrive/Desktop/WinSpot/backend/src/routes/admin.js#L71-L82)

When an admin deletes a user, their offers, transactions, and QR redemptions remain in the database as orphaned records. Should cascade delete or at minimum close active offers and refund remaining budgets.

### SEC-4: No Rate Limiting on QR Generation or Redemption
A merchant could spam-generate thousands of QR codes. A malicious client could brute-force QR tokens (64-char hex is secure, but rate-limiting is still good practice).

### LOGIC-1: Offer Budget Is Deducted From Merchant at Creation — But Merchant Balance Isn't Shown on Dashboard
The merchant's `winCoinsBalance` drops when creating an offer, but the RestaurantDashboard doesn't display the merchant's remaining wallet balance anywhere. This is confusing — the merchant doesn't know how much they can still allocate to new offers.

### LOGIC-2: No Way For Customers to Withdraw Yet (No Frontend UI)
The backend withdrawal flow exists (`POST /api/transactions/withdraw`), but there's no withdrawal form or wallet UI on the CustomerDashboard. Customers can see their balance but can't cash out.

### LOGIC-3: `adminTopUp` Import in `transactions.js` Routes Is Unused
**File:** [transactions.js](file:///c:/Users/Mouad/OneDrive/Desktop/WinSpot/backend/src/routes/transactions.js#L4)
`adminTopUp` is imported but never used in this router (it's used in `admin.js` instead).

---

## 🎨 UX / FRONTEND IMPROVEMENTS

### UX-1: Customer Dashboard Has No QR Scanner
The core customer flow is: **eat → scan QR → get cashback**. But the CustomerDashboard has no QR scanner button. It should prominently feature a "Scan QR Code" floating action button or a camera-permission-based scanner view.

### UX-2: Customer Dashboard Should Show Available Offers Nearby
Customers should be able to browse active offers (from all merchants) before visiting a restaurant. Add an "Explore Offers" section that calls `GET /api/offers`.

### UX-3: Merchant Dashboard Nav Items Point to `#`
**File:** [RestaurantDashboard.jsx](file:///c:/Users/Mouad/OneDrive/Desktop/WinSpot/frontendWeb/src/pages/RestaurantDashboard.jsx#L23-L27)

"Offers", "Wallet", and "Settings" links point to `#`. These should either be implemented as sub-pages or removed from the sidebar to avoid confusing the user.

### UX-4: No Loading Skeleton / Empty State Illustrations
Both dashboards use plain text for loading and empty states. Consider adding skeleton loading animations and illustrated empty states (e.g., a chef icon for "No offers yet").

### UX-5: Admin Dashboard Has No "Refresh" Button
The admin must reload the entire page to see updated data. Add a refresh button in the header.

### UX-6: No Merchant Balance Display
After creating offers (which deducts from their balance), merchants have no way to see their current `winCoinsBalance`. Add a balance card at the top of the dashboard.

### UX-7: RestaurantDashboard `error` State Is Shared Across Form + Offer List
If offer creation fails, the error is displayed above the form but it stays visible even when switching to the offer list section. Use separate error states for form vs. list.

---

## 🏗️ ARCHITECTURE & TECH DEBT

### ARCH-1: Frontend Still Contains Legacy `InfluencerAuth.jsx` Open in Editor
The file was deleted from disk but appears in the user's open editor tabs. This is just a ghost — no action needed.

### ARCH-2: `frontend` Directory (Legacy) Still Exists
There's a `frontend/` directory at the root alongside `frontendWeb/`. If it's the old React app, it should be deleted to avoid confusion.

### ARCH-3: Legacy `.md` Documentation References Old Flows
Files like `FLOW_DIAGRAMS.md`, `TODO_LIST.md`, `DONE.md` still reference the old influencer/mission/Instagram/AI verification flow despite the text being rebranded to WinSpot. The content itself is architecturally stale and may mislead future developers.

### ARCH-4: No Input Sanitization Middleware
No express middleware for request body sanitization (XSS, NoSQL injection). Consider adding `express-mongo-sanitize` and `xss-clean`.

### ARCH-5: No CORS Configuration Visible
The backend `app.js` should have explicit CORS configuration for the frontend origins. If missing, the web frontend may fail in production.

---

## 📋 RECOMMENDED NEXT STEPS (Priority Order)

### Phase 1 — Critical Fixes (Completed) ✅
All critical bugs (BUG-1, BUG-2, BUG-3, BUG-5, BUG-6) and SEC-1 have been resolved and moved to the resolved log.

### Phase 2 — Complete Web MVP Core Flows ⏱️ ~4-6h
- [ ] **Add QR Scanner to Customer Dashboard** — Use browser camera API (`html5-qrcode` library) to scan QR codes on web. On mobile, use `expo-camera` + `expo-barcode-scanner`.
- [ ] **Add Withdrawal UI** — Create a withdrawal form in CustomerDashboard (amount, PayPal/bank selection, payment details, fee preview)
- [ ] **Add Merchant Wallet Card** — Show the merchant's current `winCoinsBalance` on the RestaurantDashboard
- [ ] **Show Available Offers on Customer Dashboard** — Browse all active offers (with location/price/cashback)
- [ ] **Cascade cleanup** when admin deletes a user (close offers, refund budgets, orphan cleanup)

### Phase 3 — Mobile App Pivot (MVP Extension) ⏱️ ~8-12h
- [ ] **Replace mock AppDataContext** with real API calls to the backend
- [ ] **Replace "Missions" with "Offers"** — The Explore screen should show active offers from all merchants
- [ ] **Replace "Missions du jour"** on Index screen with nearby QR-redeemable offers
- [ ] **Connect Wallet screen** to real `/api/transactions/balance` and `/api/qr/my/history`
- [ ] **Build mobile QR scanner** using `expo-camera`
- [ ] **Fix currency display** from € to MAD (1 WinCoin = 10 MAD)

### Phase 4 — Start Adding Features (Post-MVP)
- [ ] **Email Notifications** — Send emails to merchants when their balance is low, or to users when they get cashback.
- [ ] **Merchant Analytics** — Add graphs and charts for merchants to see their ROI, scan counts over time, and user demographics.
- [ ] **Admin Dashboard Polish** — Add real-time refresh, toast notifications, and user deletion cascade cleanup.
- [ ] **Verify Google ID token server-side** using `google-auth-library`
- [ ] **Add rate limiting** on auth, QR generation, and QR redemption endpoints (`express-rate-limit`)
- [ ] **Add input sanitization** middleware (`express-mongo-sanitize`)

### Phase 5 — Polish & Production ⏱️ ~3-4h
- [ ] **Loading skeletons** for all dashboard data fetches
- [ ] **Proper routing** for merchant dashboard sidebar (Offers, Wallet, Settings pages)
- [ ] **Responsive design audit** — Test all pages on mobile viewport
- [ ] **Clean up stale documentation** — Rewrite or delete `FLOW_DIAGRAMS.md`, `TODO_LIST.md`, `DONE.md`
- [ ] **Delete legacy `frontend/` directory** if unused
- [ ] **Add `<title>` and meta tags** to `index.html` for SEO

---

## 📊 Summary Score

| Area | Status | Grade |
|------|--------|-------|
| Backend Models & Schema | Solid | ✅ B+ |
| Backend Business Logic | Fee bug + race condition | ⚠️ C |
| Backend Security | Google OAuth trust issue | ⚠️ C- |
| Frontend Web (Merchant) | Works, QR generation fixed | ✅ A- |
| Frontend Web (Customer) | Missing scanner + withdrawal | ⚠️ C+ |
| Admin Dashboard | Functional, needs polish | ✅ B |
| Mobile App | **Completely disconnected from backend** | 🔴 F |
| Documentation | Stale, references old model | ⚠️ D |

> **Overall:** The backend architecture is well-designed but has 3 critical bugs and the mobile app is non-functional. Fix Phase 1 + Phase 2 first — that gives you a working end-to-end web MVP. The mobile pivot (Phase 3) is the biggest chunk of work remaining.
