# 🎯 GainVault Referral System

A comprehensive referral and reward system that allows users to earn money by referring friends to GainVault.

## 🚀 Features

### ✅ **Core Functionality**
- **Unique Referral Codes**: Each user gets a unique 8-character referral code
- **Referral Tracking**: Track pending, active, and rewarded referrals
- **Wallet System**: Built-in wallet for storing referral rewards
- **Withdrawal System**: Request withdrawals via multiple payment methods
- **Transaction History**: Complete ledger of all referral activities

### ✅ **Business Logic**
- **50% Reward**: Referrers earn 50% of challenge purchase price
- **One-Time Reward**: Rewards only given on first challenge purchase
- **Anti-Fraud**: Prevents self-referrals and duplicate accounts
- **Optional Referrals**: Referral codes are optional during signup

## 🗄️ Database Schema

### **Users Table (Updated)**
```javascript
{
  // ... existing fields
  referralCode: String,      // Unique 8-character code
  walletBalance: Number,     // Current balance (default: 0)
}
```

### **Referrals Table (New)**
```javascript
{
  referrerUserId: ObjectId,  // Who owns the referral code
  referredUserId: ObjectId,  // New user who signed up
  status: String,            // 'pending' | 'active' | 'rewarded'
  referralCode: String,      // The code used
  rewardAmount: Number,      // Amount earned
  challengePurchased: Boolean, // Whether referred user bought challenge
  challengePrice: Number     // Price of the challenge
}
```

### **Transactions Table (New)**
```javascript
{
  userId: ObjectId,          // User receiving/withdrawing money
  amount: Number,            // Positive for rewards, negative for withdrawals
  type: String,              // 'referral_reward' | 'withdrawal' | 'challenge_purchase'
  status: String,            // 'pending' | 'completed' | 'failed'
  description: String,       // Human-readable description
  referenceId: ObjectId,     // Links to related entity
  metadata: Object           // Additional data
}
```

## 🔄 **Complete Flow**

### **1. User Signup with Referral Code**
```
New User → Enters Referral Code → System Validates → Creates Referral Record
```

### **2. Challenge Purchase Triggers Reward**
```
Referred User → Buys Challenge → System Checks Referrals → Processes 50% Reward
```

### **3. Referrer Gets Paid**
```
Reward → Added to Wallet → Transaction Recorded → Referrer Can Withdraw
```

## 🛠️ **API Endpoints**

### **Referral Endpoints**
- `GET /api/referral/code` - Get user's referral code and link
- `POST /api/referral/use` - Use referral code during signup
- `GET /api/referral/stats` - Get referral statistics
- `GET /api/referral/transactions` - Get referral transaction history
- `GET /api/referral/list` - Get detailed referral list

### **Wallet Endpoints**
- `GET /api/wallet/balance` - Get current wallet balance
- `POST /api/wallet/withdraw` - Request withdrawal
- `GET /api/wallet/transactions` - Get wallet transaction history

### **Challenge Activation**
- `POST /api/activate-challenge` - Triggers referral reward processing

## 🎨 **Frontend Components**

### **Referral Dashboard (`/referral`)**
- **Referral Code Display**: Shows unique code with copy functionality
- **Statistics Grid**: Total, pending, active referrals + earnings
- **Wallet Section**: Current balance + withdrawal button
- **Transaction History**: Recent referral rewards and withdrawals
- **Withdrawal Modal**: Request withdrawals with amount and method

### **Updated Signup Form**
- **Referral Code Input**: Optional field for entering referral codes
- **Validation**: Ensures valid referral codes
- **Error Handling**: Graceful fallback if referral fails

## 🚀 **Deployment Steps**

### **1. Backend Deployment**
```bash
# Deploy updated models and routes
git add .
git commit -m "Add referral system"
git push

# Run migration on production
npm run migrate
```

### **2. Frontend Deployment**
```bash
# Deploy updated components and pages
git add .
git commit -m "Add referral dashboard"
git push
```

### **3. Environment Variables**
```bash
# Add to backend .env
FRONTEND_URL=https://gainvault.com
```

## 📊 **Testing the System**

### **1. Create Test Users**
```bash
# Sign up with referral code
# Sign up without referral code
# Test self-referral prevention
```

### **2. Test Challenge Purchase**
```bash
# POST /api/activate-challenge
{
  "userId": "user_id_here",
  "challengePrice": 100,
  "challengeType": "basic"
}
```

### **3. Verify Rewards**
```bash
# Check referrer's wallet balance
# Verify transaction records
# Test withdrawal system
```

## 🔒 **Security Features**

### **Anti-Fraud Measures**
- **Self-Referral Prevention**: Users cannot refer themselves
- **Duplicate Prevention**: Each user can only be referred once
- **Code Validation**: Referral codes must exist and be valid
- **Transaction Verification**: All financial operations are logged

### **Data Integrity**
- **Atomic Updates**: Database operations use transactions where needed
- **Validation**: Mongoose schemas enforce data integrity
- **Audit Trail**: Complete transaction history for compliance

## 📈 **Business Rules**

### **Reward Structure**
- **50% of Challenge Price**: Standard referral reward
- **One-Time Only**: Rewards only on first challenge purchase
- **Immediate Payout**: Rewards added to wallet instantly

### **Withdrawal Rules**
- **Minimum Amount**: $1 minimum withdrawal
- **Available Balance**: Can only withdraw current balance
- **Multiple Methods**: Bank transfer, PayPal, crypto options

## 🐛 **Troubleshooting**

### **Common Issues**
1. **Referral Code Not Working**: Check if code exists and is valid
2. **Reward Not Processed**: Verify challenge purchase endpoint
3. **Wallet Balance Issues**: Check transaction logs
4. **Migration Errors**: Ensure MongoDB connection and permissions

### **Debug Endpoints**
- Check `/api/health` for server status
- Review server logs for detailed error information
- Use MongoDB queries to inspect data directly

## 🎯 **Future Enhancements**

### **Planned Features**
- **Referral Tiers**: Multi-level referral rewards
- **Leaderboards**: Top referrers competition
- **Analytics Dashboard**: Detailed referral insights
- **Automated Payouts**: Scheduled payment processing
- **Referral Campaigns**: Time-limited bonus rewards

### **Integration Points**
- **Payment Gateways**: Stripe, PayPal integration
- **Email Marketing**: Automated referral follow-ups
- **Social Sharing**: Easy referral link sharing
- **Mobile App**: Native mobile referral experience

## 📞 **Support**

For technical support or questions about the referral system:
- Check server logs for detailed error information
- Review API response codes and error messages
- Verify database schema and data integrity
- Test endpoints with Postman or similar tools

---

**🎉 The referral system is now fully implemented and ready for production use!**
