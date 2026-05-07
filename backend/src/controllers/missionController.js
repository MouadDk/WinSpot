import Mission from '../models/Mission.js';
import { logActivity } from '../config/logger.js';

export const createMission = async (req, res) => {
  try {
    const merchantId = req.auth.userId;
    const missionData = { ...req.body, merchantId };
    
    const mission = await Mission.create(missionData);
    logActivity('info', { userId: merchantId, action: 'mission.create', status: 'success', message: `Mission created: ${mission._id}` });
    res.status(201).json({ success: true, mission });
  } catch (error) {
    logActivity('error', { userId: req.auth?.userId, action: 'mission.create', status: 'failed', message: error.message });
    res.status(500).json({ success: false, message: 'Error creating mission', error: error.message });
  }
};

export const getMissions = async (req, res) => {
  try {
    const userId = req.auth.userId;
    const role = req.auth.role;
    
    let query = {};
    if (role === 'merchant') {
      query = { merchantId: userId };
    } else if (role === 'influencer') {
      query = { $or: [{ influencerIds: userId }, { status: 'pending' }] }; // Influencers see their assigned missions OR pending ones they can apply to
    }

    const missions = await Mission.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, missions });
  } catch (error) {
    logActivity('error', { userId: req.auth?.userId, action: 'mission.getAll', status: 'failed', message: error.message });
    res.status(500).json({ success: false, message: 'Error fetching missions', error: error.message });
  }
};

export const getMissionById = async (req, res) => {
  try {
    const mission = await Mission.findById(req.params.id);
    if (!mission) {
      return res.status(404).json({ success: false, message: 'Mission not found' });
    }
    res.status(200).json({ success: true, mission });
  } catch (error) {
    logActivity('error', { userId: req.auth?.userId, action: 'mission.getById', status: 'failed', message: error.message });
    res.status(500).json({ success: false, message: 'Error fetching mission', error: error.message });
  }
};

export const updateMissionStatus = async (req, res) => {
  try {
    const merchantId = req.auth.userId;
    const { id } = req.params;
    const { status } = req.body; // 'active', 'completed', 'cancelled'

    const mission = await Mission.findOneAndUpdate(
      { _id: id, merchantId },
      { $set: { status } },
      { new: true, runValidators: true }
    );

    if (!mission) {
      return res.status(404).json({ success: false, message: 'Mission not found or unauthorized' });
    }

    logActivity('info', { userId: merchantId, action: 'mission.updateStatus', status: 'success', message: `Mission ${id} status updated to ${status}` });
    res.status(200).json({ success: true, mission });
  } catch (error) {
    logActivity('error', { userId: req.auth?.userId, action: 'mission.updateStatus', status: 'failed', message: error.message });
    res.status(500).json({ success: false, message: 'Error updating mission', error: error.message });
  }
};

export const assignInfluencer = async (req, res) => {
  try {
    // This could be called by an influencer accepting a mission, or a merchant assigning one.
    // For now, let's assume influencer applies/accepts it.
    const influencerId = req.auth.userId;
    const { id } = req.params;

    const mission = await Mission.findByIdAndUpdate(
      id,
      { $addToSet: { influencerIds: influencerId }, status: 'active' }, // $addToSet prevents duplicates
      { new: true }
    );

    if (!mission) {
      return res.status(404).json({ success: false, message: 'Mission not found' });
    }

    logActivity('info', { userId: influencerId, action: 'mission.assign', status: 'success', message: `Assigned to mission ${id}` });
    res.status(200).json({ success: true, mission });
  } catch (error) {
    logActivity('error', { userId: req.auth?.userId, action: 'mission.assign', status: 'failed', message: error.message });
    res.status(500).json({ success: false, message: 'Error assigning mission', error: error.message });
  }
};

export const deleteMission = async (req, res) => {
  try {
    const merchantId = req.auth.userId;
    const { id } = req.params;

    const mission = await Mission.findOneAndDelete({ _id: id, merchantId });

    if (!mission) {
      return res.status(404).json({ success: false, message: 'Mission not found or unauthorized' });
    }

    logActivity('info', { userId: merchantId, action: 'mission.delete', status: 'success', message: `Mission deleted: ${id}` });
    res.status(200).json({ success: true, message: 'Mission deleted successfully' });
  } catch (error) {
    logActivity('error', { userId: req.auth?.userId, action: 'mission.delete', status: 'failed', message: error.message });
    res.status(500).json({ success: false, message: 'Error deleting mission', error: error.message });
  }
};
