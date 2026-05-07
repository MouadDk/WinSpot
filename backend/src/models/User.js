import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: false  // Optional for OAuth users
  },
  googleId: {
    type: String,
    default: null
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

// Lowercase email before saving
userSchema.pre('save', function (next) {
  if (this.email) {
    this.email = this.email.toLowerCase().trim();
  }
  if (this.role !== 'merchant') {
    this.category = null;
  }
  next();
});

// Index for case-insensitive email search
userSchema.index({ email: 1 }, { unique: true });

export default mongoose.model('User', userSchema);