import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters long'],
    maxlength: [30, 'Username cannot exceed 30 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: false, // Optional for wallet-based auth
    minlength: [6, 'Password must be at least 6 characters long']
  },
  walletAddress: {
    type: String,
    required: [true, 'Wallet address is required'],
    unique: true,
    trim: true
  },
  referralCode: {
    type: String,
    unique: true,
    sparse: true, // Allow null values while maintaining uniqueness
    default: function() {
      // Generate unique referral code on user creation
      return this.generateReferralCode();
    }
  },
  walletBalance: {
    type: Number,
    default: 0,
    min: [0, 'Wallet balance cannot be negative']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Generate unique referral code
userSchema.methods.generateReferralCode = function() {
  return crypto.randomBytes(4).toString('hex').toUpperCase();
};

// Ensure referral code is unique
userSchema.pre('save', async function(next) {
  if (this.isModified('referralCode') || this.isNew) {
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 10;
    
    while (!isUnique && attempts < maxAttempts) {
      const existingUser = await mongoose.model('User').findOne({ 
        referralCode: this.referralCode,
        _id: { $ne: this._id }
      });
      
      if (!existingUser) {
        isUnique = true;
      } else {
        this.referralCode = this.generateReferralCode();
        attempts++;
      }
    }
    
    if (!isUnique) {
      return next(new Error('Could not generate unique referral code'));
    }
  }
  
  // Hash password before saving (only if password exists)
  if (!this.isModified('password') || !this.password) return next();
  
  try {
    // Hash password with cost of 12
    const hashedPassword = await bcrypt.hash(this.password, 12);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

// Instance method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

const User = mongoose.model('User', userSchema);

export default User;