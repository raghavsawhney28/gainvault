import express from 'express';
import User from '../models/User.js';
import Transaction from '../models/Transaction.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// ✅ Get wallet balance
router.get('/balance', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      walletBalance: user.walletBalance,
      currency: 'USD'
    });
  } catch (error) {
    console.error('Error fetching wallet balance:', error);
    res.status(500).json({ error: 'Failed to fetch wallet balance' });
  }
});

// ✅ Request withdrawal
router.post('/withdraw', auth, async (req, res) => {
  try {
    const { amount, withdrawalMethod, accountDetails } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid withdrawal amount' });
    }

    if (!withdrawalMethod) {
      return res.status(400).json({ error: 'Withdrawal method is required' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if user has sufficient balance
    if (user.walletBalance < amount) {
      return res.status(400).json({ error: 'Insufficient wallet balance' });
    }

    // Create withdrawal transaction
    const transaction = new Transaction({
      userId: user._id,
      amount: -amount, // Negative amount for withdrawals
      type: 'withdrawal',
      status: 'pending',
      description: `Withdrawal request via ${withdrawalMethod}`,
      metadata: {
        withdrawalMethod,
        accountDetails,
        originalBalance: user.walletBalance,
        newBalance: user.walletBalance - amount
      }
    });

    await transaction.save();

    // Update user's wallet balance
    user.walletBalance -= amount;
    await user.save();

    res.json({
      success: true,
      message: 'Withdrawal request submitted successfully',
      transactionId: transaction._id,
      newBalance: user.walletBalance,
      withdrawalAmount: amount
    });
  } catch (error) {
    console.error('Error processing withdrawal:', error);
    res.status(500).json({ error: 'Failed to process withdrawal' });
  }
});

// ✅ Get wallet transactions
router.get('/transactions', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const transactions = await Transaction.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Transaction.countDocuments({ userId });

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
    console.error('Error fetching wallet transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// ✅ Admin: Process withdrawal (mark as completed)
router.post('/admin/process-withdrawal/:transactionId', auth, async (req, res) => {
  try {
    // Check if user is admin (you can implement admin middleware)
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { transactionId } = req.params;
    const { status, notes } = req.body;

    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    if (transaction.type !== 'withdrawal') {
      return res.status(400).json({ error: 'Invalid transaction type' });
    }

    transaction.status = status;
    if (notes) {
      transaction.metadata.adminNotes = notes;
    }

    await transaction.save();

    res.json({
      success: true,
      message: 'Withdrawal status updated successfully',
      transaction
    });
  } catch (error) {
    console.error('Error processing withdrawal:', error);
    res.status(500).json({ error: 'Failed to process withdrawal' });
  }
});

export default router;
