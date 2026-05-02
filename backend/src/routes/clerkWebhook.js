import express from 'express';
import { Webhook } from 'svix';
import bodyParser from 'body-parser';
import User from '../models/User.js'; // Don't forget the .js!

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
    console.error('Webhook verification failed:', err.message);
    return res.status(400).json({ error: 'Verification failed' });
  }

  if (evt.type === 'user.created') {
    const { id, email_addresses, first_name, last_name, unsafe_metadata } = evt.data;
    const primaryEmail = email_addresses[0]?.email_address;
    const role = unsafe_metadata?.role || 'influencer';

    try {
      const newUser = new User({
        clerkId: id,
        email: primaryEmail,
        firstName: first_name,
        lastName: last_name,
        role: role,
      });

      await newUser.save();
      console.log(`✅ Saved new user ${id} (role: ${role}) to MongoDB!`);
    } catch (dbError) {
      console.error('Database error:', dbError);
      return res.status(500).json({ error: 'Database error' });
    }
  }

  return res.status(200).json({ success: true });
});

export default router;