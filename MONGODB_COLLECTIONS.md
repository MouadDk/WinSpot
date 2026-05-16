# WinSpot MongoDB Collections (Rough Structure)

Based on Mongoose models under `backend/src/models`.

## 1) users

Represents merchants, influencers, and admins.

Typical fields:
- `_id`: ObjectId
- `email`: String (unique, lowercased)
- `password`: String (optional for OAuth users)
- `googleId`: String | null
- `firstName`: String
- `lastName`: String
- `role`: String enum: `merchant | influencer | admin`
- `category`: String | null (merchant-oriented)
- `winCoinsBalance`: Number (default 0)
- `createdAt`, `updatedAt`: Date

Indexes/constraints:
- unique index on `email`

## 2) offers

Merchant campaign/offers with geolocation and WinCoins budget.

Typical fields:
- `_id`: ObjectId
- `merchantId`: String (current auth user id in code)
- `establishmentName`: String
- `category`: String
- `description`: String
- `location`: {
  - `type`: `Point`
  - `coordinates`: [Number, Number] // [lng, lat]
  - `address`: String
  - `city`: String
  }
- `minConsumption`: Number
- `winCoinsReward`: Number
- `totalWinCoinsBudget`: Number
- `remainingWinCoinsBudget`: Number
- `isActive`: Boolean
- `expiresAt`: Date | null
- `createdAt`, `updatedAt`: Date

Indexes/constraints:
- index on `merchantId`
- `2dsphere` index on `location`

## 3) transactions

Tracks gains and withdrawals.

Typical fields:
- `_id`: ObjectId
- `userId`: ObjectId ref `User`
- `type`: String enum: `gain | retrait`
- `amount`: Number
- `fee`: Number
- `description`: String
- `offerId`: ObjectId ref `Offer` | null
- `status`: String enum: `pending | in_review | completed | failed`
- `paymentMethod`: String enum: `paypal | bank | null`
- `paymentDetails`: String
- `createdAt`, `updatedAt`: Date

Indexes/constraints:
- index on `userId`
- minimum withdrawal enforced in model/controller logic

## 4) qrvisits

One-time QR tokens and scan bookkeeping.

Typical fields:
- `_id`: ObjectId
- `token`: String (unique)
- `merchantId`: String
- `offerId`: ObjectId ref `Offer`
- `label`: String
- `winCoins`: Number
- `expiresAt`: Date
- `scanned`: Boolean
- `scannedBy`: String | null
- `scannedAt`: Date | null
- `transactionId`: ObjectId ref `Transaction` | null
- `createdAt`, `updatedAt`: Date

Indexes/constraints:
- unique index on `token`
- index on `merchantId`

## 5) missions

Merchant-created missions/contracts with assigned influencers.

Typical fields:
- `_id`: ObjectId
- `merchantId`: String
- `influencerIds`: [String]
- `description`: String
- `subscriptionType`: String enum: `Basic | Premium`
- `status`: String enum: `pending | active | completed | cancelled`
- `startDate`: Date | null
- `endDate`: Date | null
- `createdAt`, `updatedAt`: Date

Indexes/constraints:
- index on `merchantId`

## 6) finetunedatas

Stores AI verification samples and admin review status.

Typical fields:
- `_id`: ObjectId
- `imageUrl`: String
- `conversations`: [
  - `{ from: "human", value: String }`,
  - `{ from: "gpt", value: String }`
  ]
- `transactionId`: ObjectId ref `Transaction` | null
- `adminStatus`: String enum: `pending | approved | denied`
- `createdAt`: Date

Notes:
- The route `/api/ai/verify-scan` inserts data here after OCR + scene detection.

## Relationship Snapshot

- `transactions.userId -> users._id`
- `transactions.offerId -> offers._id`
- `qrvisits.offerId -> offers._id`
- `qrvisits.transactionId -> transactions._id`
- `finetunedatas.transactionId -> transactions._id`

Potential consistency improvement (future):
- Some collections store actor IDs as String (`merchantId`, `influencerIds`) while others use ObjectId refs. Standardizing this can simplify joins and validation.
