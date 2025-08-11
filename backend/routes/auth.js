// backend/routes/auth.js
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto'; // built-in
import nacl from 'tweetnacl';
import { PublicKey } from '@solana/web3.js';

import User from '../models/User.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// In-memory store for nonces (for demo purposes only! Use DB or Redis in prod)
const nonces = {};

// Generate and send nonce for signing
router.get('/nonce', (req, res) => {
  try {
    const nonce = crypto.randomBytes(16).toString('hex');
    // For simplicity, associate nonce with some client id or wallet address via query or header
    // Here, just send nonce to client. You should have a better mapping in prod.
    res.json({ nonce });
  } catch (error) {
    console.error('Error generating nonce:', error);
    res.status(500).json({ error: 'Failed to generate nonce' });
  }
});

// Signature verification helper
const verifySignature = (message, signature, publicKey) => {
  try {
    const messageBytes = new TextEncoder().encode(message);
    const signatureBytes = Uint8Array.from(Buffer.from(signature, 'base64'));
    const publicKeyBytes = new PublicKey(publicKey).toBytes();

    return nacl.sign.detached.verify(messageBytes, signatureBytes, publicKeyBytes);
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
};

// Phantom wallet sign-in route
router.post('/phantom-signin', async (req, res) => {
  try {
    const { publicKey, signature, message } = req.body;

    if (!publicKey || !signature || !message) {
      return res.status(400).json({ error: 'Missing publicKey, signature, or message' });
    }

    // Verify signature
    const isValid = verifySignature(message, signature, publicKey);

    if (!isValid) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    // TODO: Verify nonce inside message against stored nonce here for security

    // Find or create user by wallet address
    let user = await User.findOne({ walletAddress: publicKey });
    if (!user) {
      user = new User({
        username: `user_${publicKey.slice(0, 8)}`, // default username as shortened wallet address
        walletAddress: publicKey,
        password: crypto.randomBytes(32).toString('hex'), // random password since wallet sign-in
      });
      await user.save();
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();
    // Issue JWT token
    const token = jwt.sign(
      { id: user._id, walletAddress: user.walletAddress },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (error) {
    console.error('Phantom signin error:', error);
    res.status(500).json({ error: 'Server error during Phantom signin' });
  }
});

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/signup', async (req, res) => {
  try {
    const { username, walletAddress, password } = req.body;

    if (!username || !walletAddress || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existingUser = await User.findOne({
      $or: [{ username }, { walletAddress }]
    });

    if (existingUser) {
      if (existingUser.username === username) {
        return res.status(400).json({ error: 'Username already exists' });
      }
      if (existingUser.walletAddress === walletAddress) {
        return res.status(400).json({ error: 'Wallet address already registered' });
      }
    }

    const newUser = new User({
      username,
      walletAddress,
      password, // hashed by model middleware
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: 'User registered successfully'
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & get token
 * @access  Public
 */
router.post('/signin', async (req, res) => {
  try {
    const { walletAddress, password } = req.body;

    if (!walletAddress || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const user = await User.findOne({ walletAddress });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign(
      { id: user._id, walletAddress: user.walletAddress },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    console.log(`User ${user.username} logged in successfully`);
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        walletAddress: user.walletAddress,
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

/**
 * @route   GET /api/auth/me
 * @desc    Get user info (Protected)
 * @access  Private
 */
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        walletAddress: user.walletAddress,
        lastLogin: user.lastLogin
      }
    });
  } catch (error) {
    console.error('Fetch user error:', error);
    res.status(500).json({ error: 'Server error while fetching user' });
  }
});

export default router;
