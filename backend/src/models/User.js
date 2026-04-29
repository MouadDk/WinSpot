import mongoose from 'mongoose';
const userSchema = new mongoose.Schema(
  {
    clerkId: { type: String, required: true, unique: true },
    email: { type: String, default: '' }, // ← removed required: true
    firstName: { type: String, default: '' },
    lastName: { type: String, default: '' },
    avatar: { type: String, default: '' },
  },
  { timestamps: true }
);
export const User = mongoose.model('User', userSchema);