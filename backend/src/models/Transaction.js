import mongoose from 'mongoose';

const MIN_WITHDRAWAL = 20;
const WITHDRAWAL_FEE_PERCENT = 1.5; // WinSpot takes 1.5% on withdrawals

const transactionSchema = new mongoose.Schema({
  // ID of the user who made the transaction
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'userId is required'],
    index: true
  },
  type: {
    type: String,
    enum: {
      values: ['cashback', 'topup', 'withdrawal', 'withdrawal_fee'],
      message: 'Transaction type must be one of: cashback, topup, withdrawal, withdrawal_fee'
    },
    required: [true, 'Transaction type is required']
  },
  // Amount in WinCoins
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount cannot be negative']
  },
  // Amount in MAD (for display/reference)
  amountMAD: {
    type: Number,
    default: 0
  },
  // Fee taken by WinSpot (only for withdrawals)
  fee: {
    type: Number,
    default: 0,
    min: [0, 'Fee cannot be negative']
  },
  description: {
    type: String,
    default: ''
  },
  // Reference to the offer that generated this transaction (for cashback)
  offerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Offer',
    default: null
  },
  // Reference to the QR redemption (for cashback)
  qrRedemptionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'QRRedemption',
    default: null
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'completed'
  },
  // For withdrawals: payment method
  paymentMethod: {
    type: String,
    enum: ['paypal', 'bank', null],
    default: null
  },
  // For withdrawals: PayPal email or Bank RIB
  paymentDetails: {
    type: String,
    default: ''
  }
}, { timestamps: true });

// Validate minimum withdrawal amount
transactionSchema.pre('validate', function (next) {
  if (this.type === 'withdrawal' && this.amount < MIN_WITHDRAWAL) {
    this.invalidate('amount', `Minimum withdrawal is ${MIN_WITHDRAWAL} WinCoins`);
  }
  next();
});

// Export constants so routes can reference them
export { MIN_WITHDRAWAL, WITHDRAWAL_FEE_PERCENT };
export default mongoose.model('Transaction', transactionSchema);
