import mongoose from 'mongoose';

const qrVisitSchema = new mongoose.Schema({
  // Unique one-time token embedded in the QR code
  token: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },

  // Clerk ID of the merchant who generated this QR
  merchantId: {
    type: String,
    required: true,
    index: true,
  },

  // MongoDB ObjectId of the offer this QR is for
  offerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Offer',
    required: true,
  },

  // Human-readable label (offer name / establishment)
  label: {
    type: String,
    default: '',
  },

  // WinCoins that will be transferred when scanned (reward amount)
  winCoins: {
    type: Number,
    default: 1,
    min: 1,
  },

  // When this token expires (default: 24 hours from generation)
  expiresAt: {
    type: Date,
    required: true,
  },

  // Whether the QR has been used
  scanned: {
    type: Boolean,
    default: false,
  },

  // MongoDB _id of the influencer who scanned it
  scannedBy: {
    type: String,
    default: null,
  },

  // Timestamp of the scan
  scannedAt: {
    type: Date,
    default: null,
  },

  // Reference to the Transaction created on scan
  transactionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Transaction',
    default: null,
  },
}, { timestamps: true });

export default mongoose.model('QRVisit', qrVisitSchema);
