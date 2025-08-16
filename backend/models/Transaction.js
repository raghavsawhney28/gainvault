import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['referral_reward', 'withdrawal', 'challenge_purchase', 'refund'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'cancelled'],
    default: 'completed'
  },
  description: {
    type: String,
    required: true
  },
  referenceId: {
    type: mongoose.Schema.Types.ObjectId, // Can reference User, Referral, or other entities
    required: false
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed, // Store additional data like referral details
    default: {}
  }
}, {
  timestamps: true
});

// Indexes for better query performance
transactionSchema.index({ userId: 1, type: 1 });
transactionSchema.index({ userId: 1, createdAt: -1 });
transactionSchema.index({ type: 1, status: 1 });

// Ensure amount is not zero
transactionSchema.pre('save', function(next) {
  if (this.amount === 0) {
    return next(new Error('Transaction amount cannot be zero'));
  }
  next();
});

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
