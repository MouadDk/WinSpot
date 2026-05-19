import mongoose from 'mongoose';
import crypto from 'crypto';

const qrRedemptionSchema = new mongoose.Schema({
  // The offer being redeemed
  offerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Offer',
    required: true,
    index: true
  },
  // The merchant who generated the QR
  merchantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  // The customer who scanned (null until scanned)
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  // Secure single-use token embedded in QR code
  token: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  // Snapshot of offer details at QR generation time (for audit trail)
  snapshotPrice: { type: Number, required: true },
  snapshotCashbackPercent: { type: Number, required: true },
  snapshotItemName: { type: String, required: true },
  // Computed amounts (filled on redemption)
  cashbackCoins: { type: Number, default: 0 },   // Credited to customer
  cashbackMAD: { type: Number, default: 0 },      // For display
  // Lifecycle
  status: {
    type: String,
    enum: ['pending', 'redeemed', 'expired'],
    default: 'pending'
  },
  expiresAt: {
    type: Date,
    required: true
  },
  redeemedAt: {
    type: Date,
    default: null
  }
}, { timestamps: true });

// Auto-generate secure token before validation
qrRedemptionSchema.pre('validate', function (next) {
  if (!this.token) {
    this.token = crypto.randomBytes(32).toString('hex');
  }
  next();
});

// TTL index: auto-delete expired & unredeemed QR codes after 24 hours
qrRedemptionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 86400 });

export default mongoose.model('QRRedemption', qrRedemptionSchema);
