import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Check, ExternalLink, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import usePhantomWallet from '../../hooks/usePhantomWallet';
import usePhantomPayment from '../../hooks/usePhantomPayment';
import styles from './TradingChallenge.module.css';

const TradingChallenge = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [challengeType, setChallengeType] = useState('twoStage');
  const { connected, publicKey, connectWallet } = usePhantomWallet();
  const {
    sendSOLPayment,
    calculateSOLAmount,
    getAccountLabel,
    getSolScanUrl,
    resetPaymentState,
    isProcessing,
    paymentStatus,
    transactionSignature,
    error: paymentError,
    SOL_RATE
  } = usePhantomPayment();

  const [formData, setFormData] = useState({
    // Account Setup
    country: '',
    accountType: '',
    profitTarget: '',
    platform: '',
    accountSize: '',
    
    // Order Summary
    agreeToTerms: false
  });

  const accountSizes = [
    { value: '5k', label: '$5,000', price: 69, singleStagePrice: 124 },
    { value: '10k', label: '$10,000', price: 129, singleStagePrice: 232 },
    { value: '15k', label: '$15,000', price: 179, singleStagePrice: 322 },
    { value: '25k', label: '$25,000', price: 269, singleStagePrice: 484 },
    { value: '50k', label: '$50,000', price: 549, singleStagePrice: 988 },
    { value: '100k', label: '$100,000', price: 1199, singleStagePrice: 2158 },
  ];

  const countries = [
    'United States', 'Canada','India', 'United Kingdom', 'Germany', 'France', 
    'Australia', 'Japan', 'Singapore', 'Switzerland', 'Netherlands'
  ];

  const accountTypes = [
    '2 Step  --------10% Phase 1, 5% Phase 2'
  ];

  const profitTargets = [
     '10% Phase 1, 5% Phase 2'
  ];

  const platforms = [
      'GainVault'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleChallengeTypeChange = (type) => {
    setChallengeType(type);
    // Reset account size when changing challenge type
    setFormData(prev => ({
      ...prev,
      accountSize: ''
    }));
  };

  const handleNext = () => {
    if (currentStep < 2) {
      setCurrentStep(2);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(1);
    }
  };

  const getSelectedAccountPrice = () => {
    const selected = accountSizes.find(size => size.value === formData.accountSize);
    if (!selected) return 0;
    
    return challengeType === 'twoStage' ? selected.price : selected.singleStagePrice;
  };



  const handleConfirmOrder = () => {
    if (!formData.agreeToTerms) {
      alert('Please agree to the Terms and Conditions');
      return;
    }
    
    if (!connected || !publicKey) {
      alert('Please connect your Phantom wallet first');
      return;
    }

    handlePayment();
  };

  const handlePayment = async () => {
    try {
      await sendSOLPayment(formData.accountSize, publicKey);
    } catch (error) {
      console.error('Payment failed:', error);
    }
  };

  const renderPaymentStatus = () => {
    if (!paymentStatus) return null;

    const statusConfig = {
      processing: {
        icon: Loader2,
        title: 'Processing Payment...',
        message: 'Please confirm the transaction in your Phantom wallet',
        color: '#007BFF'
      },
      confirming: {
        icon: Loader2,
        title: 'Confirming Transaction...',
        message: 'Waiting for blockchain confirmation',
        color: '#007BFF'
      },
      confirmed: {
        icon: CheckCircle,
        title: 'Payment Confirmed!',
        message: 'Your payment has been successfully processed',
        color: '#28A745'
      },
      activated: {
        icon: CheckCircle,
        title: 'Challenge Activated!',
        message: 'Your trading challenge has been successfully activated',
        color: '#28A745'
      },
      payment_success_activation_pending: {
        icon: AlertCircle,
        title: 'Payment Successful',
        message: 'Payment confirmed, challenge activation pending',
        color: '#FFA502'
      },
      failed: {
        icon: AlertCircle,
        title: 'Payment Failed',
        message: paymentError || 'Something went wrong with your payment',
        color: '#FF4757'
      }
    };

    const config = statusConfig[paymentStatus];
    if (!config) return null;

    return (
      <div className={styles.paymentStatus} style={{ '--status-color': config.color }}>
        <div className={styles.statusIcon}>
          <config.icon size={24} className={config.icon === Loader2 ? styles.spinning : ''} />
        </div>
        <div className={styles.statusContent}>
          <h4>{config.title}</h4>
          <p>{config.message}</p>
          {transactionSignature && (
            <div className={styles.transactionInfo}>
              <p className={styles.transactionId}>
                Transaction: {transactionSignature.slice(0, 8)}...{transactionSignature.slice(-8)}
              </p>
              <a 
                href={getSolScanUrl(transactionSignature)} 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.solscanLink}
              >
                View on SolScan <ExternalLink size={14} />
              </a>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderAccountSetup = () => (
    <div className={styles.stepContent}>
      <h2>Account Setup</h2>
      
      {/* Challenge Type Toggle */}
      <div className={styles.challengeTypeToggle}>
        <button
          className={`${styles.toggleButton} ${challengeType === 'twoStage' ? styles.active : ''}`}
          onClick={() => handleChallengeTypeChange('twoStage')}
        >
          Two Stages
        </button>
        <button
          className={`${styles.toggleButton} ${challengeType === 'singleStage' ? styles.active : ''}`}
          onClick={() => handleChallengeTypeChange('singleStage')}
        >
          Single Stage
        </button>
      </div>
      
      <div className={styles.formGrid}>
        {/* <div className={styles.formGroup}>
          <label>Country</label>
          <select 
            value={formData.country} 
            onChange={(e) => handleInputChange('country', e.target.value)}
          >
            <option value="">Select Country</option>
            {countries.map(country => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
        </div> */}

        {/* <div className={styles.formGroup}>
          <label>Account Type</label>
          <select 
            value={formData.accountType} 
            onChange={(e) => handleInputChange('accountType', e.target.value)}
          >
            <option value="">Select Account Type</option>
            {accountTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div> */}

        {/* <div className={styles.formGroup}>
          <label>Profit Target</label>
          <select 
            value={formData.profitTarget} 
            onChange={(e) => handleInputChange('profitTarget', e.target.value)}
          >
            <option value="">Select Profit Target</option>
            {profitTargets.map(target => (
              <option key={target} value={target}>{target}</option>
            ))}
          </select>
        </div> */}

        <div className={styles.formGroup}>
          <label>Platform</label>
          <select 
            value={formData.platform} 
            onChange={(e) => handleInputChange('platform', e.target.value)}
          >
            <option value="">Select Platform</option>
            {platforms.map(platform => (
              <option key={platform} value={platform}>{platform}</option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.accountSizeSection}>
        <label>Account Size</label>
        <div className={styles.accountSizeGrid}>
          {accountSizes.map(size => (
            <button
              key={size.value}
              className={`${styles.accountSizeCard} ${
                formData.accountSize === size.value ? styles.selected : ''
              }`}
              onClick={() => handleInputChange('accountSize', size.value)}
            >
              <div className={styles.accountSizeLabel}>{size.label}</div>
              <div className={styles.accountSizePrice}>
                ${challengeType === 'twoStage' ? size.price : size.singleStagePrice}
              </div>
              <div className={styles.challengeTypeLabel}>
                {challengeType === 'twoStage' ? 'Two Stages' : 'Single Stage'}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className={styles.stepNavigation}>
        <button 
          className={styles.btnPrimary}
          onClick={handleNext}
          disabled={  !formData.accountSize || !formData.platform }
        >
          Next <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );

  const renderOrderSummary = () => (
    <div className={styles.stepContent}>
      <h2>Order Summary</h2>
      
      <div className={styles.summaryCard}>
        <div className={styles.summaryHeader}>
          <h3>Challenge Details</h3>
        </div>
        
        <div className={styles.summaryDetails}>
          <div className={styles.summaryRow}>
            <span>Challenge Type:</span>
            <span>{formData.accountType}</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Platform:</span>
            <span>{formData.platform}</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Account Size:</span>
            <span>{accountSizes.find(size => size.value === formData.accountSize)?.label}</span>
          </div>
          {/* <div className={styles.summaryRow}>
            <span>Profit Target:</span>
            <span>{formData.profitTarget}</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Country:</span>
            <span>{formData.country}</span>
          </div> */}
        </div>

        <div className={styles.summaryTotal}>
          <div className={styles.totalRow}>
            <span>Total Cost:</span>
            <span className={styles.totalPrice}>${getSelectedAccountPrice()}</span>
          </div>
          {connected && formData.accountSize && (
            <div className={styles.solConversion}>
              <span>SOL Amount:</span>
              <span className={styles.solAmount}>
                ◎{calculateSOLAmount(formData.accountSize).toFixed(4)} SOL
              </span>
              <span className={styles.solRate}>@ ${SOL_RATE}/SOL</span>
            </div>
          )}
        </div>
      </div>

      {!connected && (
        <div className={styles.walletPrompt}>
          <AlertCircle size={20} />
          <span>Connect your Phantom wallet to proceed with payment</span>
          <button className={styles.btnSecondary} onClick={connectWallet}>
            Connect Wallet
          </button>
        </div>
      )}

      {renderPaymentStatus()}

      <div className={styles.termsSection}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={formData.agreeToTerms}
            onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
          />
          <span className={styles.checkmark}></span>
          I have read and agree to the Rules and Conditions
        </label>
      </div>

      <div className={styles.stepNavigation}>
        <button className={styles.btnSecondary} onClick={handleBack}>
          <ChevronLeft size={16} /> Back
        </button>
        <button 
          className={styles.btnSuccess}
          onClick={handleConfirmOrder}
          disabled={!formData.agreeToTerms || !connected || isProcessing}
        >
          {isProcessing ? (
            <>
              <Loader2 size={17} className={styles.spinning} /> Processing...
            </>
          ) : (
            <>
              <Check size={17} /> {connected ? 'Pay with SOL' : 'Connect Wallet First'}
            </>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <div className={styles.tradingChallenge}>
      <div className={styles.container}>
        <div className={styles.progressBar}>
          <div className={styles.progressSteps}>
            {[1, 2].map(step => (
              <div 
                key={step}
                className={`${styles.progressStep} ${
                  step <= currentStep ? styles.active : ''
                }`}
              >
                <div className={styles.stepNumber}>{step}</div>
                <div className={styles.stepLabel}>
                  {step === 1 && 'Account Setup'}
                  {step === 2 && 'Order Summary'}
                </div>
              </div>
            ))}
          </div>

        </div>

        <div className={styles.stepContainer}>
          {currentStep === 1 && renderAccountSetup()}
          {currentStep === 2 && renderOrderSummary()}
        </div>
      </div>
    </div>
  );
};

export default TradingChallenge;