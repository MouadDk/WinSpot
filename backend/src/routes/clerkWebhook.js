import express from 'express';
import { Webhook } from 'svix';
import { User } from '../models/User.js';

export const clerkWebhookRouter = express.Router();

clerkWebhookRouter.post('/', async (req, res) => {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    return res.status(500).json({ error: 'Missing CLERK_WEBHOOK_SECRET' });
  }

  const svixId = req.headers['svix-id'];
  const svixTimestamp = req.headers['svix-timestamp'];
  const svixSignature = req.headers['svix-signature'];

  if (!svixId || !svixTimestamp || !svixSignature) {
    return res.status(400).json({ error: 'Missing svix headers' });
  }

  let event;
  try {
    const wh = new Webhook(WEBHOOK_SECRET);
    event = wh.verify(req.body, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    });
  } catch (err) {
    console.error('Webhook verification failed:', err.message);
    return res.status(400).json({ error: 'Invalid webhook signature' });
  }

  const { type, data } = event;
  console.log(`Clerk webhook received: ${type}`);

  try {
    if (type === 'user.created') {
      const email = data.email_addresses?.[0]?.email_address;

      await User.create({
        clerkId: data.id,
        email: email ?? 'no-email@placeholder.com', // ← fallback
        firstName: data.first_name ?? '',
        lastName: data.last_name ?? '',
        avatar: data.image_url ?? '',
      });
      console.log('✅ User saved to MongoDB:', data.id);
    }

    if (type === 'user.updated') {
      await User.findOneAndUpdate(
        { clerkId: data.id },
        {
          email: data.email_addresses[0]?.email_address,
          firstName: data.first_name ?? '',
          lastName: data.last_name ?? '',
          avatar: data.image_url ?? '',
        }
      );
      console.log('✅ User updated in MongoDB:', data.id);
    }

    if (type === 'user.deleted') {
      await User.findOneAndDelete({ clerkId: data.id });
      console.log('✅ User deleted from MongoDB:', data.id);
    }

    return res.status(200).json({ received: true });

  } catch (err) {
    console.error('Error handling webhook event:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});