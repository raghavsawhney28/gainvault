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
    console.log('🔐 Nonce request for wallet:', publicKey);
    
    if (!publicKey) {
      console.log('❌ Missing publicKey in nonce request');
      return res.status(400).json({ error: 'Missing publicKey' });
    }

    const nonce = crypto.randomBytes(16).toString('hex');
    nonces[publicKey] = nonce; // save nonce for this wallet
    
    console.log('🔐 Generated nonce:', nonce, 'for wallet:', publicKey);
    console.log('🔐 Current nonces stored:', Object.keys(nonces).length);

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
    console.log('🔐 Verifying signature with:', { 
      messageLength: message?.length, 
      signatureLength: signature?.length, 
      publicKeyLength: publicKey?.length 
    });
    
    const messageBytes = new TextEncoder().encode(message);
    console.log('🔐 Message encoded to bytes, length:', messageBytes.length);
    
    // Use proper base64 decoding for Node.js
    const signatureBytes = Uint8Array.from(Buffer.from(signature, "base64"));
    console.log('🔐 Signature decoded from base64, length:', signatureBytes.length);
    
    const publicKeyBytes = new PublicKey(publicKey).toBytes();
    console.log('🔐 Public key converted to bytes, length:', publicKeyBytes.length);

    const result = nacl.sign.detached.verify(messageBytes, signatureBytes, publicKeyBytes);
    console.log('🔐 Signature verification completed, result:', result);
    
    return result;
  } catch (error) {
    console.error('❌ Signature verification error:', error);
    console.error('❌ Error details:', {
      message: message?.substring(0, 100),
      signature: signature?.substring(0, 100),
      publicKey: publicKey?.substring(0, 100),
      errorMessage: error.message,
      errorStack: error.stack
    });
    return false;
  }
};

// ✅ Debug endpoint to test signature verification
router.post('/debug-signin', async (req, res) => {
  try {
    const { publicKey, signature, message } = req.body;
    console.log('🔍 DEBUG: Signin request received:', { 
      publicKey, 
      message: message?.substring(0, 50) + '...', 
      signatureLength: signature?.length 
    });

    if (!publicKey || !signature || !message) {
      return res.status(400).json({ 
        error: 'Missing fields', 
        received: { publicKey: !!publicKey, signature: !!signature, message: !!message } 
      });
    }

    // Test nonce extraction
    const nonce = extractNonce(message);
    console.log('🔍 DEBUG: Extracted nonce:', nonce);
    console.log('🔍 DEBUG: Stored nonce:', nonces[publicKey]);
    console.log('🔍 DEBUG: Nonce match:', nonce === nonces[publicKey]);
    
    if (!nonce) {
      return res.status(400).json({ error: 'Could not extract nonce from message' });
    }

    if (!nonces[publicKey]) {
      return res.status(400).json({ error: 'No nonce found for this public key' });
    }

    if (nonce !== nonces[publicKey]) {
      return res.status(400).json({ 
        error: 'Nonce mismatch', 
        extracted: nonce, 
        stored: nonces[publicKey] 
      });
    }

    // Test signature verification
    console.log('🔍 DEBUG: Testing signature verification...');
    const isValid = verifySignature(message, signature, publicKey);
    console.log('🔍 DEBUG: Signature verification result:', isValid);
    
    if (!isValid) {
      return res.status(400).json({ error: 'Signature verification failed' });
    }

    // Test database lookup
    console.log('🔍 DEBUG: Looking up user in database...');
    const user = await User.findOne({ walletAddress: publicKey });
    if (!user) {
      return res.status(404).json({ error: 'User not found in database' });
    }

    console.log('🔍 DEBUG: User found:', user.username);
    
    res.json({
      success: true,
      debug: {
        nonceExtracted: nonce,
        nonceStored: nonces[publicKey],
        nonceMatch: nonce === nonces[publicKey],
        signatureValid: isValid,
        userFound: !!user,
        userId: user._id
      }
    });

  } catch (error) {
    console.error('🔍 DEBUG: Error occurred:', error);
    res.status(500).json({ 
      error: 'Debug endpoint error', 
      message: error.message,
      stack: error.stack 
    });
  }
});

// ✅ Phantom wallet sign-in
router.post('/phantom-signin', async (req, res) => {
  try {
    const { publicKey, signature, message } = req.body;
    console.log('🔐 Signin request received:', { publicKey, message: message?.substring(0, 50) + '...', signatureLength: signature?.length });

    if (!publicKey || !signature || !message) {
      console.log('❌ Missing fields:', { publicKey: !!publicKey, signature: !!signature, message: !!message });
      return res.status(400).json({ error: 'Missing fields: publicKey, signature, message' });
    }

    // Extract nonce from message and check validity
    const nonce = extractNonce(message);
    console.log('🔐 Extracted nonce:', nonce);
    console.log('🔐 Stored nonce:', nonces[publicKey]);
    
    if (!nonce || nonce !== nonces[publicKey]) {
      console.log('❌ Nonce validation failed:', { extracted: nonce, stored: nonces[publicKey] });
      return res.status(401).json({ error: 'Invalid or expired nonce' });
    }

    console.log('🔐 Nonce validated, verifying signature...');
    const isValid = verifySignature(message, signature, publicKey);
    console.log('🔐 Signature verification result:', isValid);
    
    if (!isValid) return res.status(401).json({ error: 'Invalid signature' });

    // Delete nonce after use
    delete nonces[publicKey];

    // Find user
    console.log('🔐 Looking up user with wallet address:', publicKey);
    const user = await User.findOne({ walletAddress: publicKey });
    if (!user) {
      console.log('❌ User not found for wallet:', publicKey);
      return res.status(404).json({ error: 'User not found. Please sign up first.' });
    }

    console.log('✅ User found:', user.username);
    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign(
      { id: user._id, walletAddress: user.walletAddress },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('✅ Signin successful for user:', user.username);
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
    console.error('❌ Error stack:', error.stack);
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
