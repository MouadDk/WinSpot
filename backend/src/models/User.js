import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  clerkId: { 
    type: String, 
    required: true, 
    unique: true 
  },
  email: { 
    type: String, 
    required: true 
  },
  firstName: String,
  lastName: String,
  role: {
    type: String,
    enum: ['merchant', 'influencer', 'admin'],
    default: 'influencer'
  },
  // Category for Merchant users (retrieved from Clerk publicMetadata via webhook)
  // Examples: 'Restaurant', 'Bar', 'Sport', 'Café', 'Boutique', etc.
  category: {
    type: String,
    default: null
  },
  winCoinsBalance: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

// Ensure category is only set for merchants
userSchema.pre('save', function (next) {
  if (this.role !== 'merchant') {
    this.category = null;
  }
  next();
});

export default mongoose.model('User', userSchema);