import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { logActivity } from '../config/logger.js';
import crypto from 'crypto';
import { sendEmail } from '../services/emailService.js';

if (!process.env.JWT_SECRET) {
  throw new Error('FATAL: JWT_SECRET environment variable is not set. Server cannot start.');
}
const JWT_SECRET = process.env.JWT_SECRET;

export const register = async (req, res) => {
  try {
    const { email, password, firstName, lastName, role, category } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Cet email est déjà utilisé.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      email: normalizedEmail,
      password: hashedPassword,
      firstName,
      lastName,
      role: ['merchant', 'influencer'].includes(role) ? role : 'influencer',
      category: role === 'merchant' ? category : null
    });

    logActivity('info', { userId: user._id.toString(), action: 'auth.register', status: 'success', message: `User registered: ${normalizedEmail}` });

    res.status(201).json({ success: true, message: 'Inscription réussie. Vous pouvez maintenant vous connecter.' });
  } catch (error) {
    logActivity('error', { action: 'auth.register', status: 'failed', message: error.message });
    res.status(500).json({ success: false, message: 'Erreur lors de l\'inscription.', error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    // Find user
    const user = await User.findOne({ email: normalizedEmail });
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

export const googleCallback = async (req, res) => {
  try {
    const { email, firstName, lastName, googleId } = req.body;
    const normalizedEmail = email.toLowerCase().trim();

    // Find or create user
    let user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      // Create new user if doesn't exist
      user = await User.create({
        email: normalizedEmail,
        firstName: firstName || '',
        lastName: lastName || '',
        googleId,
        role: 'influencer',
        password: '' // No password for Google OAuth users
      });

      logActivity('info', { userId: user._id.toString(), action: 'auth.google_register', status: 'success', message: `User registered via Google: ${normalizedEmail}` });
    } else if (!user.googleId) {
      // Link Google account to existing user
      user.googleId = googleId;
      await user.save();
      logActivity('info', { userId: user._id.toString(), action: 'auth.google_link', status: 'success', message: `Google account linked to existing user: ${normalizedEmail}` });
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

    logActivity('info', { userId: user._id.toString(), action: 'auth.google_login', status: 'success', message: `User logged in via Google: ${normalizedEmail}` });

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
    logActivity('error', { action: 'auth.google_login', status: 'failed', message: error.message });
    res.status(500).json({ success: false, message: 'Erreur lors de la connexion avec Google.', error: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const normalizedEmail = email?.toLowerCase().trim();

    if (!normalizedEmail) {
      return res.status(400).json({ success: false, message: 'Veuillez fournir une adresse email.' });
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      // Return success even if user not found to prevent email enumeration
      return res.status(200).json({ success: true, message: 'Si votre email est enregistré, vous recevrez un lien de réinitialisation.' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const resetPasswordExpires = Date.now() + 3600000; // 1 hour

    user.resetPasswordToken = resetPasswordToken;
    user.resetPasswordExpires = resetPasswordExpires;
    await user.save();

    // Send email
    // Check if frontend URL is provided via env var or use a default one
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;

    const message = `
      Vous avez demandé une réinitialisation de mot de passe.
      Veuillez cliquer sur ce lien pour réinitialiser votre mot de passe:
      ${resetUrl}

      Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer cet email.
      Ce lien expirera dans une heure.
    `;

    const emailResult = await sendEmail({
      to: user.email,
      subject: 'Réinitialisation de mot de passe - WinSpot',
      text: message,
    });

    if (!emailResult.success) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save({ validateBeforeSave: false });
      return res.status(500).json({ success: false, message: 'Erreur lors de l\'envoi de l\'email.' });
    }

    logActivity('info', { userId: user._id.toString(), action: 'auth.forgot_password', status: 'success', message: `Password reset email sent to ${normalizedEmail}` });

    res.status(200).json({ success: true, message: 'Si votre email est enregistré, vous recevrez un lien de réinitialisation.' });
  } catch (error) {
    logActivity('error', { action: 'auth.forgot_password', status: 'failed', message: error.message });
    res.status(500).json({ success: false, message: 'Erreur lors de la demande de réinitialisation.' });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ success: false, message: 'Veuillez fournir un nouveau mot de passe.' });
    }

    // Hash token from URL to match the one in DB
    const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Le lien de réinitialisation est invalide ou a expiré.' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    logActivity('info', { userId: user._id.toString(), action: 'auth.reset_password', status: 'success', message: `Password reset successfully for ${user.email}` });

    res.status(200).json({ success: true, message: 'Votre mot de passe a été réinitialisé avec succès.' });
  } catch (error) {
    logActivity('error', { action: 'auth.reset_password', status: 'failed', message: error.message });
    res.status(500).json({ success: false, message: 'Erreur lors de la réinitialisation du mot de passe.' });
  }
};

