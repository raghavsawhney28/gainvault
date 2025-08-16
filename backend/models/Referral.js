import mongoose from 'mongoose';

const referralSchema = new mongoose.Schema({
  referrerUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  referredUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true // Each user can only be referred once
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'rewarded'],
    default: 'pending'
  },
  referralCode: {
    type: String,
    required: true
  },
  rewardAmount: {
    type: Number,
    default: 0
  },
  challengePurchased: {
    type: Boolean,
    default: false
  },
  challengePrice: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes for better query performance
referralSchema.index({ referrerUserId: 1, status: 1 });
referralSchema.index({ referredUserId: 1 });
referralSchema.index({ referralCode: 1 });

// Prevent self-referrals
referralSchema.pre('save', function(next) {
  if (this.referrerUserId.toString() === this.referredUserId.toString()) {
    return next(new Error('Users cannot refer themselves'));
  }
  next();
});

const Referral = mongoose.model('Referral', referralSchema);

export default Referral;
