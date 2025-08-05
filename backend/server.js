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
app.use(express.json()); // ✅ Required to parse JSON bodies

const allowedOrigins = [
  'http://localhost:5173',
  'https://raghavsawhney28.github.io',
  'https://zp1v56uxy8rdx5ypatb0ockcb9tr6a-oci3-6eac18kw--5173--96435430.local-credentialless.webcontainer-api.io'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // Allow tools like Postman
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

// Temporary in-memory storage for nonces
const nonces = new Map();

// Generate secure nonce
const generateNonce = () => {
  return crypto.randomBytes(32).toString('hex');
};

// ✅ Fixed: Properly decode base64 signature
const verifySignature = (message, signature, publicKey) => {
  try {
    const messageBytes = new TextEncoder().encode(message);
    const signatureBytes = Uint8Array.from(Buffer.from(signature, 'base64')); // 🔥 Fix is here
    const publicKeyBytes = new PublicKey(publicKey).toBytes();

    const verified = nacl.sign.detached.verify(
      messageBytes,
      signatureBytes,
      publicKeyBytes
    );

    console.log('🔐 Signature verified:', verified);
    return verified;
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
};

// JWT auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });
    req.user = user;
    next();
  });
};

// 🔑 Get nonce
app.get('/api/auth/nonce', (req, res) => {
  try {
    const nonce = generateNonce();
    const expiresAt = Date.now() + 5 * 60 * 1000; // Expires in 5 mins

    nonces.set(nonce, expiresAt);

    // Cleanup expired nonces
    for (const [key, expiry] of nonces.entries()) {
      if (Date.now() > expiry) {
        nonces.delete(key);
      }
    }

    res.json({ nonce });
  } catch (err) {
    console.error('Error generating nonce:', err);
    res.status(500).json({ error: 'Failed to generate nonce' });
  }
});

// ✅ Phantom Sign-In Route
app.post('/api/auth/phantom-signin', (req, res) => {
  try {
    const { publicKey, signature, message } = req.body;

    // Debug logs
    console.log("📩 publicKey:", publicKey);
    console.log("📝 message:", message);
    console.log("🔏 signature (base64):", signature);

    // Validate input
    if (!publicKey || !signature || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Extract nonce
    const nonceMatch = message.match(/Nonce: ([a-f0-9]+)/);
    if (!nonceMatch) {
      return res.status(400).json({ error: 'Invalid message format' });
    }

    const nonce = nonceMatch[1];
    const nonceExpiry = nonces.get(nonce);

    if (!nonceExpiry) {
      return res.status(400).json({ error: 'Invalid or used nonce' });
    }

    if (Date.now() > nonceExpiry) {
      nonces.delete(nonce);
      return res.status(400).json({ error: 'Nonce expired' });
    }

    // Verify signature
    const isValid = verifySignature(message, signature, publicKey);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid signature' });
    }

    // Cleanup
    nonces.delete(nonce);

    // Generate JWT
    const token = jwt.sign(
      {
        publicKey,
        walletType: 'phantom',
        iat: Math.floor(Date.now() / 1000)
      },
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

// Example protected route
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

// Generic error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL}`);
  console.log(`🔐 JWT Secret configured: ${!!process.env.JWT_SECRET}`);
});
