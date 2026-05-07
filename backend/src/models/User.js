import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true,
    unique: true
  },
  password: {
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