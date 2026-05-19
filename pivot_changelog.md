# ✅ WinSpot Pivot — Implementation Changelog

All changes have been implemented and verified (backend compiles ✅, frontend builds ✅).

## Fee Model
- **At QR scan**: Customer gets full `cashbackPercent` of the offer price. No fees.
- **At withdrawal**: WinSpot takes **1.5%** of the withdrawal amount. This is the only revenue.

## Recent Fixes
- **BUG-3**: Fixed withdrawal rejection logic so that the associated `withdrawal_fee` transaction is correctly marked as `failed`, preventing platform revenue stats inflation.
- **BUG-6**: Updated the `QRModal` in the Restaurant Dashboard to generate and display a real scannable QR Code using `qrcode.react`.
- **SEC-1**: Updated `authController.js` to explicitly block users who registered via Google OAuth from trying to login via the email/password form, preventing `bcrypt` errors.

---

## Files Deleted (Phase 0)
| File | Reason |
|------|--------|
| `backend/src/models/Mission.js` | Influencer missions concept removed |
| `backend/src/controllers/missionController.js` | ^ |
| `backend/src/routes/missions.js` | ^ |
| `backend/src/models/QRVisit.js` | Replaced by new QRRedemption model |
| `backend/src/ai/` | AI verification removed |
| `frontendWeb/src/pages/InfluencerAuth.jsx` | Replaced by CustomerAuth.jsx |
| `frontendWeb/src/pages/InfluencerDashboard.jsx` | Replaced by CustomerDashboard.jsx |

## Files Created
| File | Purpose |
|------|---------|
| `backend/src/models/QRRedemption.js` | Secure single-use QR tokens with offer snapshots |
| `backend/src/controllers/qrController.js` | generateQR + redeemQR + history endpoints |
| `backend/src/routes/qr.js` | QR routes mounted at `/api/qr` |
| `frontendWeb/src/pages/CustomerAuth.jsx` | Customer login/register (replaces InfluencerAuth) |
| `frontendWeb/src/pages/CustomerDashboard.jsx` | Customer cashback history + wallet |

## Files Modified
| File | Changes |
|------|---------|
| `backend/src/models/User.js` | `influencer` → `customer`, added `phone` field |
| `backend/src/models/Offer.js` | Replaced `minConsumption`/`winCoinsReward` with `price`/`cashbackPercent`/`itemName` |
| `backend/src/models/Transaction.js` | New types: `cashback`, `topup`, `withdrawal`, `withdrawal_fee`. Added `amountMAD`, `qrRedemptionId` |
| `backend/src/controllers/offerController.js` | Uses new fields, updated budget math |
| `backend/src/controllers/transactionController.js` | Removed `payInfluencer`, withdrawal now has 1.5% fee |
| `backend/src/controllers/authController.js` | `influencer` → `customer` in registration |
| `backend/src/app.js` | Removed missions, added QR routes |
| `backend/src/routes/admin.js` | `influencers` → `customers`, added stats endpoint |
| `backend/src/routes/transactions.js` | Removed pay route, simplified |
| `backend/src/routes/protected.js` | Cleaned up mock endpoints |
| `frontendWeb/src/App.jsx` | New routing: `/customer/*`, legacy redirects |
| `frontendWeb/src/pages/RoleSelection.jsx` | "For Influencers" → "For Customers" |
| `frontendWeb/src/pages/RestaurantDashboard.jsx` | New form fields, QR generation modal, live cashback preview |
| `frontendWeb/src/pages/RestaurantAuth.jsx` | Updated copy |
| `frontendWeb/src/pages/LandingPage.jsx` | Updated copy, pub2WIN → WinSpot |
| `frontendWeb/src/components/dashboard/OfferCard.jsx` | Shows itemName, price, cashbackPercent, "Generate QR" button |
| `frontendWeb/src/components/auth/RoleGuard.jsx` | `influencer` → `customer` |
| `frontendWeb/src/components/layout/DashboardLayout.jsx` | `influencer` → `customer`, pub2WIN → WinSpot |
| `frontendWeb/src/contexts/AuthContext.jsx` | Rebranded localStorage keys |
| `frontendWeb/src/hooks/useDarkMode.js` | Rebranded localStorage key |
| `adminDashboard/src/App.jsx` | Customers tab, platform revenue stats, QR redemption count |

## New API Endpoints
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/api/qr/generate` | merchant | Generate a single-use QR code for an offer |
| `POST` | `/api/qr/redeem` | customer | Scan/redeem a QR token → get cashback |
| `GET` | `/api/qr/merchant/history` | merchant | View all QR redemptions |
| `GET` | `/api/qr/my/history` | customer | View personal cashback history |
| `GET` | `/api/admin/customers` | admin | List all customers |
| `GET` | `/api/admin/stats` | admin | Dashboard stats + platform revenue |
