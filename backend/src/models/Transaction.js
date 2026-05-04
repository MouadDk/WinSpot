import mongoose from 'mongoose';

const MIN_WITHDRAWAL = 20;

const transactionSchema = new mongoose.Schema({
  // Clerk ID of the user who made the transaction
  clerkId: {
    type: String,
    required: [true, 'clerkId (Clerk ID) is required'],
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
    enum: ['pending', 'completed', 'failed'],
    default: 'completed'
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
