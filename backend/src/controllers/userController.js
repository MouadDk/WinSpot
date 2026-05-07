import User from '../models/User.js';
import { logActivity } from '../config/logger.js';

// Get current user profile
export const getCurrentUserProfile = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const user = await User.findById(userId);
    
    if (!user) {
      logActivity('warn', { userId, action: 'user.getProfile', status: 'failed', message: 'User not found in database' });
      return res.status(404).json({ success: false, message: 'User not found in database' });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    logActivity('error', { userId: req.auth?.userId, action: 'user.getProfile', status: 'failed', message: error.message });
    res.status(500).json({ success: false, message: 'Error fetching user profile', error: error.message });
  }
};

// Update current user profile
export const updateCurrentUserProfile = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const updates = req.body;
    
    // Prevent sensitive fields from being updated directly via this route
    delete updates.userId;
    delete updates.role;
    delete updates.email;
    delete updates.password;

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!user) {
      logActivity('warn', { userId, action: 'user.updateProfile', status: 'failed', message: 'User not found in database' });
      return res.status(404).json({ success: false, message: 'User not found in database' });
    }

    logActivity('info', { userId, action: 'user.updateProfile', status: 'success', message: 'Profile updated' });
    res.status(200).json({ success: true, user });
  } catch (error) {
    logActivity('error', { userId: req.auth?.userId, action: 'user.updateProfile', status: 'failed', message: error.message });
    res.status(500).json({ success: false, message: 'Error updating user profile', error: error.message });
  }
};

// Get user profile by ID (public or specific use case)
export const getUserProfileById = async (req, res) => {
  try {
    const { id } = req.params;
    let query = { _id: id };

    const user = await User.findOne(query).select('-password');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    logActivity('error', { userId: req.auth?.userId, action: 'user.getProfileById', status: 'failed', message: error.message });
    res.status(500).json({ success: false, message: 'Error fetching user', error: error.message });
  }
};
