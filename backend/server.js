import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import authRoutes from './routes/auth.js';
import referralRoutes from './routes/referral.js';
import walletRoutes from './routes/wallet.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

const allowedOrigins = [
  'http://localhost:5173',
  'https://gainvault.fund',
  'https://raghavsawhney28.github.io',
  'https://gainvault-capital.onrender.com',
  'https://gainvault.onrender.com',
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

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/referral', referralRoutes);
app.use('/api/wallet', walletRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Challenge activation endpoint (for payment integration)
app.post('/api/activate-challenge', async (req, res) => {
  try {
    const { userId, challengePrice, challengeType } = req.body;
    
    // This would typically save challenge data to database
    console.log('Challenge activation request:', { userId, challengePrice, challengeType });
    
    // Process referral reward if applicable
    if (userId && challengePrice) {
      try {
        const { processReferralReward } = await import('./services/referralService.js');
        const referralResult = await processReferralReward(userId, challengePrice);
        
        if (referralResult.success) {
          console.log('Referral reward processed:', referralResult);
        }
      } catch (referralError) {
        console.error('Referral processing failed:', referralError);
        // Don't fail challenge activation if referral fails
      }
    }
    
    res.json({ success: true, message: 'Challenge activated successfully' });
  } catch (error) {
    console.error('Challenge activation error:', error);
    res.status(500).json({ error: 'Failed to activate challenge' });
  }
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
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL}`);
  console.log(`🔐 JWT Secret configured: ${!!process.env.JWT_SECRET}`);
});
