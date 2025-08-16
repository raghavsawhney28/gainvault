import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Migration function
const addReferralFields = async () => {
  try {
    console.log('🔄 Starting migration: Adding referral fields to existing users...');
    
    // Find all users without referralCode
    const usersWithoutReferralCode = await User.find({ 
      $or: [
        { referralCode: { $exists: false } },
        { referralCode: null }
      ]
    });
    
    console.log(`📊 Found ${usersWithoutReferralCode.length} users without referral codes`);
    
    let updatedCount = 0;
    
    for (const user of usersWithoutReferralCode) {
      try {
        // Generate referral code
        user.referralCode = user.generateReferralCode();
        
        // Ensure walletBalance exists
        if (user.walletBalance === undefined) {
          user.walletBalance = 0;
        }
        
        await user.save();
        updatedCount++;
        console.log(`✅ Updated user: ${user.username} - Referral code: ${user.referralCode}`);
      } catch (error) {
        console.error(`❌ Failed to update user ${user.username}:`, error.message);
      }
    }
    
    console.log(`🎉 Migration completed! Updated ${updatedCount} users`);
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
};

// Run migration
connectDB().then(() => {
  addReferralFields();
});
