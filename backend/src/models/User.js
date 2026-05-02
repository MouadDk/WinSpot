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
    default: 'influencer' // We will update this during the onboarding flow
  }
}, { timestamps: true });

// This is the crucial line that fixes your error!
export default mongoose.model('User', userSchema);