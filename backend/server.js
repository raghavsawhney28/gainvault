import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { PublicKey } from '@solana/web3.js';
import nacl from 'tweetnacl';
import crypto from 'crypto';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Store nonces temporarily (in production, use Redis or database)
const nonces = new Map();

// Utility function to generate nonce
const generateNonce = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Utility function to verify signature
const verifySignature = (message, signature, publicKey) => {
  try {
    const messageBytes = new TextEncoder().encode(message);
    const signatureBytes = new Uint8Array(signature);
    const publicKeyBytes = new PublicKey(publicKey).toBytes();
    
    return nacl.sign.detached.verify(messageBytes, signatureBytes, publicKeyBytes);
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
};

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Routes

// Get nonce for signing
app.get('/api/auth/nonce', (req, res) => {
  try {
    const nonce = generateNonce();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes
    
    nonces.set(nonce, expiresAt);
    
    // Clean up expired nonces
    for (const [key, expiry] of nonces.entries()) {
      if (Date.now() > expiry) {
        nonces.delete(key);
      }
    }
    
    res.json({ nonce });
  } catch (error) {
    console.error('Error generating nonce:', error);
    res.status(500).json({ error: 'Failed to generate nonce' });
  }
});

// Phantom wallet authentication
app.post('/api/auth/phantom-signin', (req, res) => {
  try {
    const { publicKey, signature, message } = req.body;

    // Validate required fields
    if (!publicKey || !signature || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Extract nonce from message
    const nonceMatch = message.match(/Nonce: ([a-f0-9]+)/);
    if (!nonceMatch) {
      return res.status(400).json({ error: 'Invalid message format' });
    }

    const nonce = nonceMatch[1];

    // Verify nonce exists and is not expired
    const nonceExpiry = nonces.get(nonce);
    if (!nonceExpiry) {
      return res.status(400).json({ error: 'Invalid nonce' });
    }

    if (Date.now() > nonceExpiry) {
      nonces.delete(nonce);
      return res.status(400).json({ error: 'Nonce expired' });
    }

    // Verify signature
    const isValidSignature = verifySignature(message, signature, publicKey);
    if (!isValidSignature) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    // Remove used nonce
    nonces.delete(nonce);

    // Generate JWT token
    const tokenPayload = {
      publicKey,
      walletType: 'phantom',
      iat: Math.floor(Date.now() / 1000)
    };

    const token = jwt.sign(
      tokenPayload,
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        publicKey,
        walletType: 'phantom'
      }
    });

  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

// Protected route example
app.get('/api/user/profile', authenticateToken, (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL}`);
  console.log(`🔐 JWT Secret configured: ${!!process.env.JWT_SECRET}`);
});