import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Referral from '../models/Referral.js';
import Transaction from '../models/Transaction.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// ✅ Get user's referral code and link
router.get('/code', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const referralLink = `${process.env.FRONTEND_URL || 'https://gainvault.com'}?ref=${user.referralCode}`;
    
    res.json({
      success: true,
      referralCode: user.referralCode,
      referralLink,
      walletBalance: user.walletBalance
    });
  } catch (error) {
    console.error('Error fetching referral code:', error);
    res.status(500).json({ error: 'Failed to fetch referral code' });
  }
});

// ✅ Use referral code during signup
router.post('/use', async (req, res) => {
  try {
    const { referralCode, newUserId } = req.body;
    
    if (!referralCode || !newUserId) {
      return res.status(400).json({ error: 'Missing referralCode or newUserId' });
    }

    // Find the referrer by referral code
    const referrer = await User.findOne({ referralCode });
    if (!referrer) {
      return res.status(404).json({ error: 'Invalid referral code' });
    }

    // Prevent self-referral
    if (referrer._id.toString() === newUserId) {
      return res.status(400).json({ error: 'Cannot refer yourself' });
    }

    // Check if user was already referred
    const existingReferral = await Referral.findOne({ referredUserId: newUserId });
    if (existingReferral) {
      return res.status(400).json({ error: 'User already has a referral' });
    }

    // Create referral record
    const referral = new Referral({
      referrerUserId: referrer._id,
      referredUserId: newUserId,
      referralCode,
      status: 'pending'
    });

    await referral.save();

    res.json({
      success: true,
      message: 'Referral recorded successfully',
      referrerUsername: referrer.username
    });
  } catch (error) {
    console.error('Error using referral code:', error);
    res.status(500).json({ error: 'Failed to process referral' });
  }
});

// ✅ Get referral statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get referral counts by status
    const [pendingCount, activeCount, rewardedCount] = await Promise.all([
      Referral.countDocuments({ referrerUserId: userId, status: 'pending' }),
      Referral.countDocuments({ referrerUserId: userId, status: 'active' }),
      Referral.countDocuments({ referrerUserId: userId, status: 'rewarded' })
    ]);

    // Get total rewards earned
    const totalRewards = await Transaction.aggregate([
      { $match: { userId: userId, type: 'referral_reward', status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const totalEarned = totalRewards.length > 0 ? totalRewards[0].total : 0;

    res.json({
      success: true,
      stats: {
        totalReferrals: pendingCount + activeCount + rewardedCount,
        pendingReferrals: pendingCount,
        activeReferrals: activeCount,
        rewardedReferrals: rewardedCount,
        totalEarned,
        pendingEarnings: 0 // Will be calculated based on pending referrals
      }
    });
  } catch (error) {
    console.error('Error fetching referral stats:', error);
    res.status(500).json({ error: 'Failed to fetch referral stats' });
  }
});

// ✅ Get referral transactions
router.get('/transactions', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const transactions = await Transaction.find({ 
      userId, 
      type: { $in: ['referral_reward', 'withdrawal'] } 
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('referenceId', 'username email');

    const total = await Transaction.countDocuments({ 
      userId, 
      type: { $in: ['referral_reward', 'withdrawal'] } 
    });

    res.json({
      success: true,
      transactions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching referral transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// ✅ Get detailed referral list
router.get('/list', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const referrals = await Referral.find({ referrerUserId: userId })
      .populate('referredUserId', 'username email walletAddress createdAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Referral.countDocuments({ referrerUserId: userId });

    res.json({
      success: true,
      referrals,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching referral list:', error);
    res.status(500).json({ error: 'Failed to fetch referral list' });
  }
});

export default router;
