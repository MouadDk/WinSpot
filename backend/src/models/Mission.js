import mongoose from 'mongoose';

const missionSchema = new mongoose.Schema({
  // Clerk ID of the merchant who created this mission/contract
  merchantId: {
    type: String,
    required: [true, 'merchantId (Clerk ID) is required'],
    index: true
  },
  // Array of influencer Clerk IDs assigned to this mission
  influencerIds: [{
    type: String
  }],
  description: {
    type: String,
    required: [true, 'Mission description is required'],
    trim: true
  },
  subscriptionType: {
    type: String,
    enum: {
      values: ['Basic', 'Premium'],
      message: 'subscriptionType must be either "Basic" or "Premium"'
    },
    required: [true, 'Subscription type is required']
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'completed', 'cancelled'],
    default: 'pending'
  },
  startDate: {
    type: Date,
    default: null
  },
  endDate: {
    type: Date,
    default: null
  }
}, { timestamps: true });

export default mongoose.model('Mission', missionSchema);
