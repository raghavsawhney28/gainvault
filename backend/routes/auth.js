// backend/routes/auth.js
import express from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nacl from 'tweetnacl';
import { PublicKey } from '@solana/web3.js';

import User from '../models/User.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// In-memory nonce store (use Redis/DB in production)
const nonces = {};

// ✅ Generate and send nonce for a given wallet
router.get('/nonce/:publicKey', (req, res) => {
  try {
    const { publicKey } = req.params;
    
    if (!publicKey) {
      return res.status(400).json({ error: 'Missing publicKey' });
    }

    const nonce = crypto.randomBytes(16).toString('hex');
    nonces[publicKey] = nonce; // save nonce for this wallet

    res.json({ nonce });
  } catch (error) {
    console.error('❌ Nonce generation error:', error);
    res.status(500).json({ error: 'Failed to generate nonce' });
  }
});

// ✅ Helper: Extract nonce from message
const extractNonce = (message) => {
  const match = message.match(/Nonce: ([a-f0-9]+)/);
  return match ? match[1] : null;
};

// ✅ Helper: Verify signature
const verifySignature = (message, signature, publicKey) => {
  try {
    const messageBytes = new TextEncoder().encode(message);
    // Use proper base64 decoding for Node.js
    const signatureBytes = Uint8Array.from(Buffer.from(signature, "base64"));
    const publicKeyBytes = new PublicKey(publicKey).toBytes();

    const result = nacl.sign.detached.verify(messageBytes, signatureBytes, publicKeyBytes);
    
    return result;
  } catch (error) {
    console.error('❌ Signature verification error:', error);
    return false;
  }
};

// ✅ Phantom wallet sign-in
router.post('/phantom-signin', async (req, res) => {
  try {
    const { publicKey, signature, message } = req.body;

    if (!publicKey || !signature || !message) {
      return res.status(400).json({ error: 'Missing fields: publicKey, signature, message' });
    }

    // Extract nonce from message and check validity
    const nonce = extractNonce(message);
    
    if (!nonce || nonce !== nonces[publicKey]) {
      return res.status(401).json({ error: 'Invalid or expired nonce' });
    }

    const isValid = verifySignature(message, signature, publicKey);
    
    if (!isValid) return res.status(401).json({ error: 'Invalid signature' });

    // Delete nonce after use
    delete nonces[publicKey];

    // Find user and update lastLogin
    const user = await User.findOneAndUpdate(
      { walletAddress: publicKey },
      { lastLogin: new Date() },
      { new: true, runValidators: false }
    );
    
    if (!user) {
      return res.status(404).json({ error: 'User not found. Please sign up first.' });
    }

    const token = jwt.sign(
      { id: user._id, walletAddress: user.walletAddress },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        walletAddress: user.walletAddress,
        lastLogin: user.lastLogin,
      },
    });
  } catch (error) {
    console.error('❌ Phantom signin error:', error);
    res.status(500).json({ error: 'Server error during signin' });
  }
});

// ✅ Phantom wallet sign-up
router.post('/phantom-signup', async (req, res) => {
  try {
    const { publicKey, signature, message, username, email } = req.body;

    if (!publicKey || !signature || !message || !username || !email) {
      return res.status(400).json({ error: 'Missing fields: publicKey, signature, message, username, email' });
    }

    // Extract nonce from message and check validity
    const nonce = extractNonce(message);
    if (!nonce || nonce !== nonces[publicKey]) {
      return res.status(401).json({ error: 'Invalid or expired nonce' });
    }

    const isValid = verifySignature(message, signature, publicKey);
    if (!isValid) return res.status(401).json({ error: 'Invalid signature' });

    // Delete nonce after use
    delete nonces[publicKey];

    // Check existing user
    const existingUser = await User.findOne({
      $or: [{ username }, { email }, { walletAddress: publicKey }],
    });

    if (existingUser) {
      if (existingUser.username === username) {
        return res.status(400).json({ error: 'Username already exists' });
      }
      if (existingUser.email === email) {
        return res.status(400).json({ error: 'Email already exists' });
      }
      if (existingUser.walletAddress === publicKey) {
        return res.status(400).json({ error: 'Wallet already registered' });
      }
    }

    // Create new user
    const newUser = new User({
      username,
      email,
      walletAddress: publicKey,
    });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, walletAddress: newUser.walletAddress },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        walletAddress: newUser.walletAddress,
        lastLogin: newUser.lastLogin,
      },
    });
  } catch (error) {
    console.error('Phantom signup error:', error);
    res.status(500).json({ error: 'Server error during signup' });
  }
});

// ✅ Get logged-in user info
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        walletAddress: user.walletAddress,
        lastLogin: user.lastLogin,
      },
    });
  } catch (error) {
    console.error('Fetch user error:', error);
    res.status(500).json({ error: 'Server error while fetching user' });
  }
});

export default router;
