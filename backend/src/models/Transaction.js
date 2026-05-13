import mongoose from 'mongoose';

const MIN_WITHDRAWAL = 20;

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
      values: ['gain', 'retrait'],
      message: 'Transaction type must be either "gain" or "retrait"'
    },
    required: [true, 'Transaction type is required']
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount cannot be negative']
  },
  fee: {
    type: Number,
    default: 0,
    min: [0, 'Fee cannot be negative']
  },
  description: {
    type: String,
    default: ''
  },
  // Reference to the offer that generated this transaction (if applicable)
  offerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Offer',
    default: null
  },
  status: {
    type: String,
    enum: ['pending', 'in_review', 'completed', 'failed'],
    default: 'completed'
  },
  // Added for cashouts: 'paypal' or 'bank'
  paymentMethod: {
    type: String,
    enum: ['paypal', 'bank', null],
    default: null
  },
  // Added for cashouts: PayPal email or Bank RIB
  paymentDetails: {
    type: String,
    default: ''
  }
}, { timestamps: true });

// Validate minimum withdrawal amount
transactionSchema.pre('validate', function (next) {
  if (this.type === 'retrait' && this.amount < MIN_WITHDRAWAL) {
    this.invalidate('amount', `Le retrait minimum est de ${MIN_WITHDRAWAL} WinCoins`);
  }
  next();
});

// Export the constant so routes can reference it
export { MIN_WITHDRAWAL };
export default mongoose.model('Transaction', transactionSchema);
