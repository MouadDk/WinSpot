import mongoose from 'mongoose';

const offerSchema = new mongoose.Schema({
  // Merchant who created this offer
  merchantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'merchantId is required'],
    index: true
  },
  establishmentName: {
    type: String,
    required: [true, 'Establishment name is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  // Specific offer item name (e.g., "Pizza Combo", "Lunch Special")
  itemName: {
    type: String,
    required: [true, 'Item name is required'],
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [0, 0]
    },
    address: {
      type: String,
      default: ''
    },
    city: {
      type: String,
      default: ''
    }
  },
  // Fixed price in MAD for this specific offer
  price: {
    type: Number,
    required: [true, 'Price in MAD is required'],
    min: [1, 'Price must be at least 1 MAD']
  },
  // Cashback percentage the customer receives (e.g., 8 = 8%)
  cashbackPercent: {
    type: Number,
    required: [true, 'Cashback percentage is required'],
    min: [1, 'Cashback must be at least 1%'],
    max: [50, 'Cashback cannot exceed 50%']
  },
  // Budget system: how many WinCoins are allocated to this offer
  totalWinCoinsBudget: {
    type: Number,
    required: [true, 'Total WinCoins budget is required'],
    min: [1, 'Total WinCoins budget must be at least 1']
  },
  remainingWinCoinsBudget: {
    type: Number,
    required: [true, 'Remaining WinCoins budget is required'],
    min: [0, 'Remaining WinCoins budget cannot be negative']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  expiresAt: {
    type: Date,
    default: null
  }
}, { timestamps: true });

// GeoJSON index for location-based queries
offerSchema.index({ 'location': '2dsphere' });

// Virtual: cashback amount in MAD for a single redemption
offerSchema.virtual('cashbackMAD').get(function () {
  return this.price * this.cashbackPercent / 100;
});

// Virtual: cashback amount in WinCoins for a single redemption (1 WinCoin = 10 MAD)
offerSchema.virtual('cashbackCoins').get(function () {
  return this.price * this.cashbackPercent / 100 / 10;
});

// Ensure virtuals are included in JSON
offerSchema.set('toJSON', { virtuals: true });
offerSchema.set('toObject', { virtuals: true });

export default mongoose.model('Offer', offerSchema);
