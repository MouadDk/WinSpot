import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { logActivity } from '../config/logger.js';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_pub2win_2026';

export const register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, role, category } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Cet email est déjà utilisé.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role: role || 'influencer',
      category: role === 'merchant' ? category : null
    });

    logActivity('info', { userId: user._id.toString(), action: 'auth.register', status: 'success', message: `User registered: ${email}` });

    res.status(201).json({ success: true, message: 'Inscription réussie. Vous pouvez maintenant vous connecter.' });
  } catch (error) {
    logActivity('error', { action: 'auth.register', status: 'failed', message: error.message });
    res.status(500).json({ success: false, message: 'Erreur lors de l\'inscription.', error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Email ou mot de passe incorrect.' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Email ou mot de passe incorrect.' });
    }

    // Create JWT payload
    const payload = {
      userId: user._id,
      role: user.role,
      email: user.email,
      fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim()
    };

    // Sign Token
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

    logActivity('info', { userId: user._id.toString(), action: 'auth.login', status: 'success', message: `User logged in: ${email}` });

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        winCoinsBalance: user.winCoinsBalance
      }
    });
  } catch (error) {
    logActivity('error', { action: 'auth.login', status: 'failed', message: error.message });
    res.status(500).json({ success: false, message: 'Erreur lors de la connexion.', error: error.message });
  }
};
