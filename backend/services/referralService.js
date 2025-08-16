import User from '../models/User.js';
import Referral from '../models/Referral.js';
import Transaction from '../models/Transaction.js';

// ✅ Process referral reward when challenge is purchased
export const processReferralReward = async (userId, challengePrice) => {
  try {
    // Find pending referral for this user
    const referral = await Referral.findOne({ 
      referredUserId: userId, 
      status: 'pending' 
    });

    if (!referral) {
      return { success: false, message: 'No pending referral found' };
    }

    // Calculate reward (50% of challenge price)
    const rewardAmount = challengePrice * 0.5;

    // Update referral status
    referral.status = 'active';
    referral.challengePurchased = true;
    referral.challengePrice = challengePrice;
    referral.rewardAmount = rewardAmount;
    await referral.save();

    // Add reward to referrer's wallet
    const referrer = await User.findById(referral.referrerUserId);
    if (!referrer) {
      throw new Error('Referrer not found');
    }

    referrer.walletBalance += rewardAmount;
    await referrer.save();

    // Create transaction record
    const transaction = new Transaction({
      userId: referrer._id,
      amount: rewardAmount,
      type: 'referral_reward',
      status: 'completed',
      description: `Referral reward for ${referral.referredUserId}`,
      referenceId: referral._id,
      metadata: {
        referredUserId: referral.referredUserId,
        challengePrice,
        rewardPercentage: 50,
        referralCode: referral.referralCode
      }
    });

    await transaction.save();

    return {
      success: true,
      referrerId: referrer._id,
      referrerUsername: referrer.username,
      rewardAmount,
      newBalance: referrer.walletBalance
    };

  } catch (error) {
    console.error('Error processing referral reward:', error);
    throw error;
  }
};

// ✅ Get referral statistics for a user
export const getReferralStats = async (userId) => {
  try {
    const [pendingCount, activeCount, rewardedCount] = await Promise.all([
      Referral.countDocuments({ referrerUserId: userId, status: 'pending' }),
      Referral.countDocuments({ referrerUserId: userId, status: 'active' }),
      Referral.countDocuments({ referrerUserId: userId, status: 'rewarded' })
    ]);

    // Calculate total earnings
    const totalRewards = await Transaction.aggregate([
      { $match: { userId: userId, type: 'referral_reward', status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const totalEarned = totalRewards.length > 0 ? totalRewards[0].total : 0;

    // Calculate pending earnings (from pending referrals)
    const pendingReferrals = await Referral.find({ 
      referrerUserId: userId, 
      status: 'pending' 
    });

    const pendingEarnings = pendingReferrals.reduce((total, referral) => {
      // Estimate potential earnings (assuming average challenge price)
      const estimatedChallengePrice = 100; // You can make this dynamic
      return total + (estimatedChallengePrice * 0.5);
    }, 0);

    return {
      totalReferrals: pendingCount + activeCount + rewardedCount,
      pendingReferrals: pendingCount,
      activeReferrals: activeCount,
      rewardedReferrals: rewardedCount,
      totalEarned,
      pendingEarnings: Math.round(pendingEarnings * 100) / 100
    };
  } catch (error) {
    console.error('Error getting referral stats:', error);
    throw error;
  }
};

// ✅ Validate referral code
export const validateReferralCode = async (referralCode, newUserId) => {
  try {
    if (!referralCode) {
      return { valid: true, message: 'No referral code provided' };
    }

    // Find referrer by referral code
    const referrer = await User.findOne({ referralCode });
    if (!referrer) {
      return { valid: false, message: 'Invalid referral code' };
    }

    // Prevent self-referral
    if (referrer._id.toString() === newUserId) {
      return { valid: false, message: 'Cannot refer yourself' };
    }

    // Check if user was already referred
    const existingReferral = await Referral.findOne({ referredUserId: newUserId });
    if (existingReferral) {
      return { valid: false, message: 'User already has a referral' };
    }

    return { 
      valid: true, 
      referrerId: referrer._id,
      referrerUsername: referrer.username,
      message: 'Valid referral code' 
    };
  } catch (error) {
    console.error('Error validating referral code:', error);
    return { valid: false, message: 'Error validating referral code' };
  }
};

// ✅ Get referral leaderboard
export const getReferralLeaderboard = async (limit = 10) => {
  try {
    const leaderboard = await Referral.aggregate([
      { $match: { status: 'active' } },
      {
        $group: {
          _id: '$referrerUserId',
          totalReferrals: { $sum: 1 },
          totalEarnings: { $sum: '$rewardAmount' }
        }
      },
      { $sort: { totalEarnings: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          username: '$user.username',
          totalReferrals: 1,
          totalEarnings: 1
        }
      }
    ]);

    return leaderboard;
  } catch (error) {
    console.error('Error getting referral leaderboard:', error);
    throw error;
  }
};
