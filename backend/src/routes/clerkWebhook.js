import express from 'express';
import { Webhook } from 'svix';
import bodyParser from 'body-parser';
import User from '../models/User.js';
import { logActivity } from '../config/logger.js';

const router = express.Router();

router.post('/user-created', bodyParser.raw({ type: 'application/json' }), async (req, res) => {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error('Missing CLERK_WEBHOOK_SECRET in .env');
  }

  const svix_id = req.headers["svix-id"];
  const svix_timestamp = req.headers["svix-timestamp"];
  const svix_signature = req.headers["svix-signature"];

  if (!svix_id || !svix_timestamp || !svix_signature) {
    logActivity('warn', {
      action: 'webhook.verify',
      status: 'failed',
      message: 'Missing svix headers'
    });
    return res.status(400).json({ error: 'Missing svix headers' });
  }

  const payload = req.body;
  const wh = new Webhook(WEBHOOK_SECRET);
  let evt;

  try {
    evt = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    logActivity('error', {
      action: 'webhook.verify',
      status: 'failed',
      message: `Webhook verification failed: ${err.message}`
    });
    return res.status(400).json({ error: 'Verification failed' });
  }

  // ─── USER CREATED ─────────────────────────────────────────────
  if (evt.type === 'user.created') {
    const { id, email_addresses, first_name, last_name, unsafe_metadata, public_metadata } = evt.data;
    const primaryEmail = email_addresses[0]?.email_address;
    const role = unsafe_metadata?.role || 'influencer';

    // Retrieve category from publicMetadata (set in Clerk dashboard for merchants)
    const category = public_metadata?.category || null;

    try {
      const newUser = new User({
        clerkId: id,
        email: primaryEmail,
        firstName: first_name,
        lastName: last_name,
        role: role,
        category: role === 'merchant' ? category : null,
      });

      await newUser.save();

      logActivity('info', {
        clerkId: id,
        action: 'user.created',
        status: 'success',
        message: `New ${role} user registered (email: ${primaryEmail}${category ? `, category: ${category}` : ''})`
      });
    } catch (dbError) {
      logActivity('error', {
        clerkId: id,
        action: 'user.created',
        status: 'failed',
        message: `Database error: ${dbError.message}`
      });
      return res.status(500).json({ error: 'Database error' });
    }
  }

  // ─── USER UPDATED ─────────────────────────────────────────────
  if (evt.type === 'user.updated') {
    const { id, email_addresses, first_name, last_name, unsafe_metadata, public_metadata } = evt.data;
    const primaryEmail = email_addresses[0]?.email_address;
    const role = unsafe_metadata?.role;
    const category = public_metadata?.category || null;

    try {
      const updateData = {
        email: primaryEmail,
        firstName: first_name,
        lastName: last_name,
      };

      // Update role if provided
      if (role) {
        updateData.role = role;
      }

      // Update category from publicMetadata for merchants
      if (role === 'merchant' || (!role && category)) {
        updateData.category = category;
      }

      const updatedUser = await User.findOneAndUpdate(
        { clerkId: id },
        updateData,
        { new: true, upsert: true }
      );

      logActivity('info', {
        clerkId: id,
        action: 'user.updated',
        status: 'success',
        message: `User profile updated (role: ${updatedUser.role}${updatedUser.category ? `, category: ${updatedUser.category}` : ''})`
      });
    } catch (dbError) {
      logActivity('error', {
        clerkId: id,
        action: 'user.updated',
        status: 'failed',
        message: `Database error: ${dbError.message}`
      });
      return res.status(500).json({ error: 'Database error' });
    }
  }

  return res.status(200).json({ success: true });
});

export default router;