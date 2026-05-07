import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connexion à MongoDB réussie...');
    
    // On vérifie si les utilisateurs de test existent déjà pour éviter les doublons
    const existingMerchant = await User.findOne({ email: 'test.merchant@pub2win.com' });
    if (!existingMerchant) {
      await User.create({
        clerkId: 'user_test_merchant_' + Date.now(),
        email: 'test.merchant@pub2win.com',
        firstName: 'Paul',
        lastName: 'Bistro',
        role: 'merchant',
        category: 'Restaurant',
        winCoinsBalance: 0
      });
      console.log('✅ Merchant de test créé (Paul Bistro)');
    }

    const existingInfluencer = await User.findOne({ email: 'test.influencer@pub2win.com' });
    if (!existingInfluencer) {
      await User.create({
        clerkId: 'user_test_influencer_' + Date.now(),
        email: 'test.influencer@pub2win.com',
        firstName: 'Léa',
        lastName: 'Influence',
        role: 'influencer',
        winCoinsBalance: 0
      });
      console.log('✅ Influencer de test créé (Léa Influence)');
    }

    console.log('Terminé ! Vous pouvez vérifier votre Dashboard Admin.');
    process.exit(0);
  })
  .catch(err => {
    console.error('Erreur:', err);
    process.exit(1);
  });
