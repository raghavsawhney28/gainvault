import React, { useState, useEffect } from 'react';
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Copy, 
  ExternalLink,
  Wallet,
  Download,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import styles from './Referral.module.css';

const Referral = () => {
  const { user, isLoggedIn } = useAuth();
  const [referralData, setReferralData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawalMethod, setWithdrawalMethod] = useState('bank');
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      fetchReferralData();
    }
  }, [isLoggedIn]);

  const fetchReferralData = async () => {
    try {
      setLoading(true);
      
      // Fetch referral code and stats
      const [codeRes, statsRes, transactionsRes] = await Promise.all([
        fetch('https://gainvault.onrender.com/api/referral/code', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
        }),
        fetch('https://gainvault.onrender.com/api/referral/stats', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
        }),
        fetch('https://gainvault.onrender.com/api/referral/transactions', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('auth_token')}` }
        })
      ]);

      if (codeRes.ok && statsRes.ok && transactionsRes.ok) {
        const [codeData, statsData, transactionsData] = await Promise.all([
          codeRes.json(),
          statsRes.json(),
          transactionsRes.json()
        ]);

        setReferralData({
          ...codeData,
          stats: statsData.stats
        });
        setTransactions(transactionsData.transactions);
      }
    } catch (error) {
      console.error('Error fetching referral data:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyReferralLink = async () => {
    try {
      await navigator.clipboard.writeText(referralData.referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || withdrawAmount <= 0) {
      alert('Please enter a valid withdrawal amount');
      return;
    }

    try {
      const response = await fetch('https://gainvault.onrender.com/api/wallet/withdraw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify({
          amount: parseFloat(withdrawAmount),
          withdrawalMethod,
          accountDetails: 'Bank transfer'
        })
      });

      if (response.ok) {
        const result = await response.json();
        alert('Withdrawal request submitted successfully!');
        setShowWithdrawModal(false);
        setWithdrawAmount('');
        fetchReferralData(); // Refresh data
      } else {
        const error = await response.json();
        alert(error.error || 'Withdrawal failed');
      }
    } catch (error) {
      console.error('Withdrawal error:', error);
      alert('Withdrawal failed');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className={styles.container}>
        <div className={styles.notLoggedIn}>
          <h2>Please log in to access your referral dashboard</h2>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading referral data...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Referral Dashboard</h1>
        <p>Earn rewards by referring friends to GainVault</p>
      </div>

      {/* Referral Code Section */}
      <div className={styles.referralCodeSection}>
        <h2>Your Referral Code</h2>
        <div className={styles.codeDisplay}>
          <div className={styles.codeBox}>
            <span className={styles.code}>{referralData?.referralCode}</span>
            <button 
              className={styles.copyButton} 
              onClick={copyReferralLink}
            >
              {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
          </div>
          <p className={styles.referralLink}>{referralData?.referralLink}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Users size={24} />
          </div>
          <div className={styles.statContent}>
            <h3>{referralData?.stats?.totalReferrals || 0}</h3>
            <p>Total Referrals</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Clock size={24} />
          </div>
          <div className={styles.statContent}>
            <h3>{referralData?.stats?.pendingReferrals || 0}</h3>
            <p>Pending Referrals</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <CheckCircle size={24} />
          </div>
          <div className={styles.statContent}>
            <h3>{referralData?.stats?.activeReferrals || 0}</h3>
            <p>Active Referrals</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <DollarSign size={24} />
          </div>
          <div className={styles.statContent}>
            <h3>${referralData?.stats?.totalEarned || 0}</h3>
            <p>Total Earned</p>
          </div>
        </div>
      </div>

      {/* Wallet Section */}
      <div className={styles.walletSection}>
        <div className={styles.walletHeader}>
          <h2>Wallet Balance</h2>
          <button 
            className={styles.withdrawButton}
            onClick={() => setShowWithdrawModal(true)}
            disabled={referralData?.walletBalance <= 0}
          >
            <Download size={16} />
            Withdraw
          </button>
        </div>
        
        <div className={styles.balanceDisplay}>
          <span className={styles.balanceAmount}>
            ${referralData?.walletBalance || 0}
          </span>
          <span className={styles.balanceLabel}>Available for withdrawal</span>
        </div>

        {referralData?.stats?.pendingEarnings > 0 && (
          <div className={styles.pendingEarnings}>
            <AlertCircle size={16} />
            <span>Potential earnings: ${referralData.stats.pendingEarnings} (from pending referrals)</span>
          </div>
        )}
      </div>

      {/* Recent Transactions */}
      <div className={styles.transactionsSection}>
        <h2>Recent Transactions</h2>
        {transactions.length > 0 ? (
          <div className={styles.transactionsList}>
            {transactions.map((transaction) => (
              <div key={transaction._id} className={styles.transactionItem}>
                <div className={styles.transactionInfo}>
                  <span className={styles.transactionType}>
                    {transaction.type === 'referral_reward' ? 'Referral Reward' : 'Withdrawal'}
                  </span>
                  <span className={styles.transactionDate}>
                    {new Date(transaction.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className={styles.transactionAmount}>
                  <span className={`${styles.amount} ${transaction.amount > 0 ? styles.positive : styles.negative}`}>
                    {transaction.amount > 0 ? '+' : ''}${transaction.amount}
                  </span>
                  <span className={styles.status}>{transaction.status}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className={styles.noTransactions}>No transactions yet</p>
        )}
      </div>

      {/* Withdrawal Modal */}
      {showWithdrawModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Request Withdrawal</h3>
            <div className={styles.modalContent}>
              <div className={styles.inputGroup}>
                <label>Amount ($)</label>
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="Enter amount"
                  max={referralData?.walletBalance}
                  min="1"
                />
              </div>
              
              <div className={styles.inputGroup}>
                <label>Withdrawal Method</label>
                <select 
                  value={withdrawalMethod} 
                  onChange={(e) => setWithdrawalMethod(e.target.value)}
                >
                  <option value="crypto">Connected Wallet</option>
                </select>
              </div>

              <div className={styles.modalActions}>
                <button 
                  className={styles.cancelButton}
                  onClick={() => setShowWithdrawModal(false)}
                >
                  Cancel
                </button>
                <button 
                  className={styles.confirmButton}
                  onClick={handleWithdraw}
                >
                  Confirm Withdrawal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Referral;
