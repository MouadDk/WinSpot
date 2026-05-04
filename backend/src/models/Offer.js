import mongoose from 'mongoose';

const offerSchema = new mongoose.Schema({
  // Clerk ID of the merchant who created this offer
  merchantId: {
    type: String,
    required: [true, 'merchantId (Clerk ID) is required'],
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
  minConsumption: {
    type: Number,
    required: [true, 'Minimum consumption amount is required'],
    min: [0, 'Minimum consumption cannot be negative']
  },
  winCoinsReward: {
    type: Number,
    required: [true, 'WinCoins reward amount is required'],
    min: [1, 'WinCoins reward must be at least 1']
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

export default mongoose.model('Offer', offerSchema);
