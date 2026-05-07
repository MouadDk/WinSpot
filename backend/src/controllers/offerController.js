import Offer from '../models/Offer.js';
import { logActivity } from '../config/logger.js';

export const createOffer = async (req, res) => {
  try {
    const merchantId = req.auth.userId;
    const offerData = { ...req.body, merchantId };
    
    const offer = await Offer.create(offerData);
    logActivity('info', { userId: merchantId, action: 'offer.create', status: 'success', message: `Offer created: ${offer._id}` });
    res.status(201).json({ success: true, offer });
  } catch (error) {
    logActivity('error', { userId: req.auth?.userId, action: 'offer.create', status: 'failed', message: error.message });
    res.status(500).json({ success: false, message: 'Error creating offer', error: error.message });
  }
};

export const getAllOffers = async (req, res) => {
  try {
    const offers = await Offer.find({ isActive: true }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, offers });
  } catch (error) {
    logActivity('error', { userId: req.auth?.userId, action: 'offer.getAll', status: 'failed', message: error.message });
    res.status(500).json({ success: false, message: 'Error fetching offers', error: error.message });
  }
};

export const getOfferById = async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);
    if (!offer) {
      return res.status(404).json({ success: false, message: 'Offer not found' });
    }
    res.status(200).json({ success: true, offer });
  } catch (error) {
    logActivity('error', { userId: req.auth?.userId, action: 'offer.getById', status: 'failed', message: error.message });
    res.status(500).json({ success: false, message: 'Error fetching offer', error: error.message });
  }
};

export const updateOffer = async (req, res) => {
  try {
    const merchantId = req.auth.userId;
    const { id } = req.params;

    const offer = await Offer.findOneAndUpdate(
      { _id: id, merchantId }, // ensure the offer belongs to the requesting merchant
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!offer) {
      logActivity('warn', { userId: merchantId, action: 'offer.update', status: 'failed', message: `Unauthorized or not found: ${id}` });
      return res.status(404).json({ success: false, message: 'Offer not found or unauthorized' });
    }

    logActivity('info', { userId: merchantId, action: 'offer.update', status: 'success', message: `Offer updated: ${id}` });
    res.status(200).json({ success: true, offer });
  } catch (error) {
    logActivity('error', { userId: req.auth?.userId, action: 'offer.update', status: 'failed', message: error.message });
    res.status(500).json({ success: false, message: 'Error updating offer', error: error.message });
  }
};

export const deleteOffer = async (req, res) => {
  try {
    const merchantId = req.auth.userId;
    const { id } = req.params;

    const offer = await Offer.findOneAndDelete({ _id: id, merchantId });

    if (!offer) {
      logActivity('warn', { userId: merchantId, action: 'offer.delete', status: 'failed', message: `Unauthorized or not found: ${id}` });
      return res.status(404).json({ success: false, message: 'Offer not found or unauthorized' });
    }

    logActivity('info', { userId: merchantId, action: 'offer.delete', status: 'success', message: `Offer deleted: ${id}` });
    res.status(200).json({ success: true, message: 'Offer deleted successfully' });
  } catch (error) {
    logActivity('error', { userId: req.auth?.userId, action: 'offer.delete', status: 'failed', message: error.message });
    res.status(500).json({ success: false, message: 'Error deleting offer', error: error.message });
  }
};
