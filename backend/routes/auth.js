// backend/routes/auth.js
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import auth from '../middleware/auth.js';
import crypto from 'crypto'; // Node.js built-in module, no install needed

const router = express.Router();
// Add this route somewhere in your router before export
router.get('/nonce', (req, res) => {
  try {
    // Generate a random nonce (e.g., 16 bytes hex string)
    const nonce = crypto.randomBytes(16).toString('hex');
    res.json({ nonce });
  } catch (error) {
    console.error('Error generating nonce:', error);
    res.status(500).json({ error: 'Failed to generate nonce' });
  }
});



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
/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', async (req, res) => {
  try {
    const { username, walletAddress, password } = req.body;

    // Validate input
    if (!username || !walletAddress || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if user already exists
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

    // Create user
    const newUser = new User({
      username,
      walletAddress,
      password, // Will be hashed by the pre-save middleware
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

    // Validate input
    if (!walletAddress || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check for user
    const user = await User.findOne({ walletAddress });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Create JWT
    const token = jwt.sign(
      { id: user._id, walletAddress: user.walletAddress },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

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
