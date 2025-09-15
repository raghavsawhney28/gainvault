import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Check, ExternalLink, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import usePhantomWallet from '../../hooks/usePhantomWallet';
import usePhantomPayment from '../../hooks/usePhantomPayment';
import styles from './TradingChallenge.module.css';
import { useMantineTheme } from '@mantine/core';
import { Paper, Stack, Text, Group, Button, Select, Card, Badge, Title } from '@mantine/core';
import qrCodeImage from '../../assets/Qr.jpg';

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
    agreeToTerms: false,
    transactionId: '',
    
    // Coupon
    couponCode: '',
    appliedCoupon: null,
    discountAmount: 0
  });

  // Scroll to top whenever step changes
  useEffect(() => {
    if (typeof window !== 'undefined' && window.scrollTo) {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [currentStep]);


  const accountSizes = [
    { value: '5k', label: '$5,000', price: 69, singleStagePrice: 124 },
    { value: '10k', label: '$10,000', price: 129, singleStagePrice: 232 },
    { value: '15k', label: '$15,000', price: 179, singleStagePrice: 322 },
    { value: '25k', label: '$25,000', price: 269, singleStagePrice: 484 },
    { value: '50k', label: '$50,000', price: 549, singleStagePrice: 988 },
    { value: '100k', label: '$100,000', price: 1199, singleStagePrice: 2158 },
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
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getSelectedAccountPrice = () => {
    const selected = accountSizes.find(size => size.value === formData.accountSize);
    if (!selected) return 0;
    
    return challengeType === 'twoStage' ? selected.price : selected.singleStagePrice;
  };

  const getSubtotal = () => {
    return getSelectedAccountPrice();
  };

  const getDiscountAmount = () => {
    return formData.discountAmount;
  };

  const getTotalCost = () => {
    return getSubtotal() - getDiscountAmount();
  };

  const handleCouponApply = () => {
    const couponCode = formData.couponCode.trim().toUpperCase();
    
    // Check if coupon is already applied
    if (formData.appliedCoupon === couponCode) {
      return;
    }
    
    // Validate coupon
    if (couponCode === 'WELCOME15') {
      const subtotal = getSubtotal();
      const discountAmount = Math.round(subtotal * 0.15 * 100) / 100; // 15% discount, rounded to 2 decimal places
      
      setFormData(prev => ({
        ...prev,
        appliedCoupon: couponCode,
        discountAmount: discountAmount
      }));
    } else {
      // Invalid coupon - show error temporarily
      setFormData(prev => ({
        ...prev,
        appliedCoupon: 'INVALID',
        discountAmount: 0
      }));
      
      // Clear error after 3 seconds
      setTimeout(() => {
        setFormData(prev => ({
          ...prev,
          appliedCoupon: null
        }));
      }, 3000);
    }
  };



  const handleConfirmOrder = () => {
    if (!formData.agreeToTerms) {
      alert('Please agree to the Terms and Conditions');
      return;
    }
    
    // Proceed to QR code step
    setCurrentStep(3);
  };

  const handleIHavePaid = () => {
    setCurrentStep(4);
  };

  const handleTransactionSubmit = () => {
    if (!formData.transactionId.trim()) {
      alert('Please enter your transaction ID');
      return;
    }
    // Show processing confirmation
    setCurrentStep(5);
  };

  const copyToClipboard = async () => {
    const walletAddress = '3uNDrLyL73jifLvS3i7FrSB1foWYVr6qxo7qJt6XvZor';
    try {
      await navigator.clipboard.writeText(walletAddress);
      alert('Wallet address copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy: ', err);
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

  const renderAccountSetup = () => {
    const theme = useMantineTheme();
    
    return (
    <div className={styles.stepContent}>
        <Text 
          fw={700} 
          size="2.5rem" 
          c="#FFFFFF" 
          ta="center" 
          mb="xl"
                     style={{ 
             textShadow: '0 0 20px rgba(22, 163, 74, 0.3)',
             letterSpacing: '1px'
           }}
        >
          Account Setup
        </Text>
      
      {/* Challenge Type Toggle */}
        <Paper 
          p="xl" 
          radius="lg" 
          withBorder 
          style={{ 
            backgroundColor: 'rgba(26, 26, 26, 0.6)',
            borderColor: 'transparent',
            backdropFilter: 'blur(15px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 20px rgba(22, 163, 74, 0.1)',
            marginBottom: '2rem'
          }}
        >
          <Stack gap="lg">
                         <Text 
               fw={700} 
               size="lg" 
               tt="uppercase" 
               c="#15803d" 
               ta="center" 
               style={{ 
                 backgroundColor: '#1A3A1A', 
                 padding: '12px 24px', 
                 borderRadius: '8px', 
                 margin: '0 auto',
                 border: '1px solid #15803d',
                 boxShadow: '0 4px 12px rgba(21, 128, 61, 0.2)',
                 letterSpacing: '2px'
               }}
             >
               CHALLENGE TYPE
             </Text>
            <Group justify="center" gap="lg">
              <Button
                variant={challengeType === 'twoStage' ? 'filled' : 'outline'}
                color="green"
                size="xl"
                radius="lg"
          onClick={() => handleChallengeTypeChange('twoStage')}
                leftSection={challengeType === 'twoStage' && <ChevronRight size={20} />}
                styles={{
                  root: {
                                         backgroundColor: challengeType === 'twoStage' ? '#16a34a' : 'transparent',
                     borderColor: challengeType === 'twoStage' ? '#16a34a' : '#16a34a',
                     borderWidth: '2px',
                     color: challengeType === 'twoStage' ? '#000000' : '#16a34a',
                     fontWeight: 700,
                     fontSize: '1.1rem',
                     padding: '16px 32px',
                     transition: 'all 0.3s ease',
                     boxShadow: challengeType === 'twoStage' 
                       ? '0 8px 25px rgba(22, 163, 74, 0.4)' 
                       : '0 4px 15px rgba(22, 163, 74, 0.2)',
                     '&:hover': {
                       backgroundColor: challengeType === 'twoStage' ? '#15803d' : 'rgba(22, 163, 74, 0.1)',
                       borderColor: challengeType === 'twoStage' ? '#15803d' : '#15803d',
                       transform: 'translateY(-2px)',
                       boxShadow: challengeType === 'twoStage' 
                         ? '0 12px 35px rgba(22, 163, 74, 0.5)' 
                         : '0 8px 25px rgba(22, 163, 74, 0.3)',
                     },
                  },
                }}
        >
          Two Stages
              </Button>
              <Button
                variant={challengeType === 'singleStage' ? 'filled' : 'outline'}
                color="green"
                size="xl"
                radius="lg"
          onClick={() => handleChallengeTypeChange('singleStage')}
                leftSection={challengeType === 'singleStage' && <ChevronRight size={20} />}
                styles={{
                  root: {
                                         backgroundColor: challengeType === 'singleStage' ? '#16a34a' : 'transparent',
                     borderColor: challengeType === 'singleStage' ? '#16a34a' : '#16a34a',
                     borderWidth: '2px',
                     color: challengeType === 'singleStage' ? '#000000' : '#16a34a',
                     fontWeight: 700,
                     fontSize: '1.1rem',
                     padding: '16px 32px',
                     transition: 'all 0.3s ease',
                     boxShadow: challengeType === 'singleStage' 
                       ? '0 8px 25px rgba(22, 163, 74, 0.4)' 
                       : '0 4px 15px rgba(22, 163, 74, 0.2)',
                     '&:hover': {
                       backgroundColor: challengeType === 'singleStage' ? '#15803d' : 'rgba(22, 163, 74, 0.1)',
                       borderColor: challengeType === 'singleStage' ? '#15803d' : '#15803d',
                       transform: 'translateY(-2px)',
                       boxShadow: challengeType === 'singleStage' 
                         ? '0 12px 35px rgba(22, 163, 74, 0.5)' 
                         : '0 8px 25px rgba(22, 163, 74, 0.3)',
                     },
                  },
                }}
        >
          Single Stage
              </Button>
            </Group>
          </Stack>
        </Paper>

                 {/* Platform Selection */}
         <Paper 
           p="xl" 
           radius="lg" 
           withBorder 
           style={{ 
             backgroundColor: 'rgba(26, 26, 26, 0.6)',
             borderColor: 'transparent',
             backdropFilter: 'blur(15px)',
             boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 20px rgba(22, 163, 74, 0.1)',
             marginBottom: '2rem'
           }}
         >
          <Stack gap="lg">
                         <Text 
               fw={700} 
               size="lg" 
               tt="uppercase" 
               c="#16a34a" 
               style={{ 
                 backgroundColor: '#1A3A1A', 
                 padding: '12px 24px', 
                 borderRadius: '8px',
                 border: '1px solid #16a34a',
                 boxShadow: '0 4px 12px rgba(22, 163, 74, 0.2)',
                 letterSpacing: '2px',
                 display: 'inline-block'
               }}
             >
               TRADING PLATFORM
             </Text>
            <Select
              placeholder="Select your preferred platform"
              data={platforms.map(platform => ({ value: platform, label: platform }))}
              value={formData.platform}
              onChange={(value) => handleInputChange('platform', value)}
              size="xl"
              radius="lg"
                             styles={{
                                   input: {
                    backgroundColor: 'rgba(26, 26, 26, 0.8)',
                    borderColor: 'transparent',
                    borderWidth: '2px',
                    color: '#FFFFFF !important',
                    fontSize: '1.1rem',
                    padding: '16px 20px',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(22, 163, 74, 0.2)',
                    '&:focus': {
                      borderColor: 'transparent',
                      backgroundColor: 'rgba(26, 26, 26, 0.9)',
                      boxShadow: '0 8px 25px rgba(22, 163, 74, 0.3)',
                      transform: 'translateY(-1px)',
                      color: '#FFFFFF !important',
                    },
                    '&:hover': {
                      borderColor: '#15803d',
                      boxShadow: '0 6px 20px rgba(22, 163, 74, 0.25)',
                      color: '#FFFFFF !important',
                    },
                  },
                  input: {
                   
                    backgroundColor: 'rgba(26, 26, 26, 0.95)',
                    color: '#FFFFFF',
                  },
                  option: {  
                    backgroundColor: 'transparent',
                    color: '#fff',
                    fontSize: '1rem',
                    padding: '12px 20px',
                    '&[data-hovered]': {
                      backgroundColor: 'rgba(22,163,74,.1)',
                      color: '#16a34a',
                    },
                    '&[data-checked]': {
                      backgroundColor: '#16a34a',
                      color: '#fffafa',
                      fontWeight: 700,
                    },
                  },
                  
                  
                 dropdown: {
                  color: '#FFFFFF',
                   backgroundColor: 'rgba(32, 32, 32, 0.95)',
                   borderColor: 'transparent',
                   borderWidth: '2px',
                   boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
                  
                 },
                                   value: {
                    color: '#FFFFFF !important',
                    fontWeight: 600,
                    fontSize: '1.1rem',
                    backgroundColor: 'transparent',
                  },
                 placeholder: {
                   color: '#CCCCCC',
                   fontWeight: 400,
                 },
               }}
            />
          </Stack>
        </Paper>

                 {/* Account Size Selection */}
         <Paper 
           p="xl" 
           radius="lg" 
           withBorder 
           style={{ 
             backgroundColor: 'rgba(26, 26, 26, 0.6)',
             borderColor: 'transparent',
             backdropFilter: 'blur(15px)',
             boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 20px rgba(22, 163, 74, 0.1)',
             marginBottom: '2rem'
           }}
         >
          <Stack gap="xl">
                         <Text 
               fw={700} 
               size="lg" 
               tt="uppercase" 
               c="#22c55e" 
               ta="center" 
               style={{ 
                 backgroundColor: '#1A3A1A', 
                 padding: '12px 24px', 
                 borderRadius: '8px', 
                 margin: '0 auto',
                 border: '1px solid #22c55e',
                 boxShadow: '0 4px 12px rgba(34, 197, 94, 0.2)',
                 letterSpacing: '2px'
               }}
             >
               ACCOUNT SIZE
             </Text>
        <div className={styles.accountSizeGrid}>
          {accountSizes.map(size => (
                <Card
              key={size.value}
              padding="sm"
              radius="md"
              withBorder
              className={`${styles.accountSizeCard} ${
                formData.accountSize === size.value ? styles.selected : ''
              }`}
              onClick={() => handleInputChange('accountSize', size.value)}
              style={{
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                borderColor: formData.accountSize === size.value 
                  ? '#16a34a' 
                  : '#16a34a',
                borderWidth: formData.accountSize === size.value ? '2px' : '1px',
                backgroundColor: formData.accountSize === size.value 
                  ? 'rgba(22, 163, 74, 0.15)' 
                  : 'rgba(26, 26, 26, 0.8)',
                backdropFilter: 'blur(15px)',
                boxShadow: formData.accountSize === size.value 
                  ? '0 8px 25px rgba(22, 163, 74, 0.3)' 
                  : '0 4px 15px rgba(0, 0, 0, 0.3)',
                maxWidth: '220px',
                minHeight: '160px',
                width: '100%'
              }}
                >
                  <Stack gap="xs" ta="center" style={{ width: '100%' }}>
                    <Text 
                      fw={600} 
                      size="md" 
                      c="#FFFFFF" 
                      className={styles.accountSizeLabel}
                      style={{ letterSpacing: '0.3px' }}
                    >
                      {size.label}
                    </Text>
                    <Title 
                      order={4} 
                      c="#16a34a" 
                      fw={800} 
                      className={styles.accountSizePrice}
                      style={{ 
                        textShadow: '0 0 15px rgba(22, 163, 74, 0.5)',
                        fontSize: '1.5rem'
                      }}
                    >
                      ${challengeType === 'twoStage' ? size.price : size.singleStagePrice}
                    </Title>
                    <Badge 
                      variant="light" 
                      color="green" 
                      size="sm"
                      radius="sm"
                      className={styles.challengeTypeLabel}
                      styles={{
                        root: {
                          backgroundColor: 'transparent',
                          color: '#16a34a',
                          borderColor: 'transparent',
                          borderWidth: '1px',
                          textTransform: 'uppercase',
                          fontWeight: 500,
                          fontSize: '0.7rem',
                          padding: '4px 8px',
                          letterSpacing: '0.3px',
                          marginTop: '8px',
                          alignSelf: 'center',
                          width: 'fit-content'
                        },
                      }}
                    >
                      {challengeType === 'twoStage' ? 'TWO STAGES' : 'SINGLE STAGE'}
                    </Badge>
                  </Stack>
                </Card>
          ))}
        </div>
          </Stack>
        </Paper>

                 {/* Navigation */}
         <Paper 
           p="xl" 
           radius="lg" 
           withBorder 
           style={{ 
             backgroundColor: 'rgba(26, 26, 26, 0.6)',
             borderColor: 'transparent',
             backdropFilter: 'blur(15px)',
             boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 20px rgba(22, 163, 74, 0.1)'
           }}
         >
          <Group justify="flex-end">
            <Button
              size="xl"
              radius="lg"
          onClick={handleNext}
              disabled={!formData.accountSize || !formData.platform}
              rightSection={<ChevronRight size={20} />}
              styles={{
                root: {
                  backgroundColor: '#166534',
                  color: '#FFFFFF',
                                     border: '2px solid #16a34a',
                   fontWeight: 700,
                   fontSize: '1.1rem',
                   padding: '16px 32px',
                   transition: 'all 0.3s ease',
                  //  boxShadow: '0 8px 25px rgba(22, 163, 74, 0.3)',
                   '&:hover': {
                     backgroundColor: '#15803d',
                     transform: 'translateY(-2px)',
                     boxShadow: '0 12px 35px rgba(22, 163, 74, 0.4)',
                   },
                  '&:disabled': {
                    backgroundColor: '#666666',
                    color: '#CCCCCC',
                    cursor: 'not-allowed',
                    transform: 'none',
                    borderColor: '#666666',
                    boxShadow: 'none',
                  },
                },
              }}
            >
              Continue to Order Summary
            </Button>
          </Group>
        </Paper>
    </div>
  );
  };

  const renderQr = () => (
    <div className={styles.stepContent}>
      <Text 
        fw={700} 
        size="2.5rem" 
        c="#FFFFFF" 
        ta="center" 
        mb="xl"
        style={{ 
          textShadow: '0 0 20px rgba(34, 197, 94, 0.3)',
          letterSpacing: '1px'
        }}
      >
        Payment via QR Code
      </Text>
      
      {/* QR Code Payment Section */}
      <Paper 
        p="xl" 
        radius="lg" 
        withBorder 
        style={{ 
          backgroundColor: 'rgba(26, 26, 26, 0.6)',
          borderColor: 'transparent',
          backdropFilter: 'blur(15px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 20px rgba(22, 163, 74, 0.1)',
          marginBottom: '2rem'
        }}
      >
        <Stack gap="lg" align="center">
          <Text 
            fw={700} 
            size="lg" 
            tt="uppercase" 
            c="#16a34a" 
            ta="center" 
            style={{ 
              backgroundColor: '#1A3A1A', 
              padding: '12px 24px', 
              borderRadius: '8px',
              border: '1px solid #16a34a',
              boxShadow: '0 4px 12px rgba(22, 163, 74, 0.2)',
              letterSpacing: '2px'
            }}
          >
            PAYMENT VIA QR CODE
          </Text>
          
          {/* QR Code Image */}
          <div className={styles.qrCodeContainer}>
            <img 
              src={qrCodeImage} 
              alt="Payment QR Code" 
              className={styles.qrCodeImage}
            />
          </div>

          {/* Wallet Address */}
          <div className={styles.walletAddressContainer}>
            <Text fw={600} c="#CCCCCC" size="md" ta="center" mb="sm">
              Send payment to this wallet address:
            </Text>
            <Paper
              p="md"
              radius="md"
              className={styles.walletAddressBox}
            >
              <Group justify="space-between" align="center">
                <Text 
                  fw={700} 
                  c="#FFFFFF" 
                  size="sm"
                  className={styles.walletAddressText}
                >
                  3uNDrLyL73jifLvS3i7FrSB1foWYVr6qxo7qJt6XvZor
                </Text>
                <button
                  className={styles.copyButton}
                  onClick={copyToClipboard}
                >
                  Copy
                </button>
              </Group>
            </Paper>
          </div>

          {/* Payment Amount */}
          <div className={styles.paymentAmountContainer}>
            <Text 
              fw={700} 
              size="1.5rem" 
              c="#16a34a" 
              ta="center"
              style={{ 
                textShadow: '0 0 20px rgba(22, 163, 74, 0.5)',
                letterSpacing: '1px',
                marginTop: '1rem'
              }}
            >
              Total Payment Amount: ${getTotalCost()}
            </Text>
          </div>
        </Stack>
      </Paper>

      {/* Navigation Buttons */}
      <Paper 
        p="xl" 
        radius="lg" 
        withBorder 
        style={{ 
          backgroundColor: 'rgba(26, 26, 26, 0.6)',
          borderColor: '#22c55e',
          backdropFilter: 'blur(15px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 20px rgba(34, 197, 94, 0.1)'
        }}
      >
        <Group justify="space-between">
          <Button
            size="xl"
            radius="lg"
            onClick={handleBack}
            leftSection={<ChevronLeft size={20} />}
            styles={{
              root: {
                backgroundColor: 'transparent',
                color: '#16a34a',
                border: '2px solid #16a34a',
                fontWeight: 700,
                fontSize: '1.1rem',
                padding: '16px 32px',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(22, 163, 74, 0.2)',
                '&:hover': {
                  backgroundColor: 'rgba(22, 163, 74, 0.1)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(22, 163, 74, 0.3)',
                },
              },
            }}
          >
            Back
          </Button>
          
          <Button
            size="xl"
            radius="lg"
            onClick={handleIHavePaid}
            rightSection={<Check size={20} />}
            styles={{
              root: {
                backgroundColor: '#16a34a',
                color: '#000000',
                border: '2px solid #16a34a',
                fontWeight: 700,
                fontSize: '1.1rem',
                padding: '16px 32px',
                transition: 'all 0.3s ease',
                boxShadow: '0 8px 25px rgba(22, 163, 74, 0.3)',
                '&:hover': {
                  backgroundColor: '#15803d',
                  borderColor: '#15803d',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 35px rgba(22, 163, 74, 0.4)',
                },
              },
            }}
          >
            I Have Paid
          </Button>
        </Group>
      </Paper>
    </div>
  );

  const renderProcessingConfirmation = () => (
    <div className={styles.stepContent}>
      <Text 
        fw={700} 
        size="2.5rem" 
        c="#FFFFFF" 
        ta="center" 
        mb="xl"
        style={{ 
          textShadow: '0 0 20px rgba(34, 197, 94, 0.3)',
          letterSpacing: '1px'
        }}
      >
        Transaction Submitted
      </Text>
      
      {/* Processing Confirmation */}
      <Paper 
        p="xl" 
        radius="lg" 
        withBorder 
        style={{ 
          backgroundColor: 'rgba(26, 26, 26, 0.6)',
          borderColor: 'transparent',
          backdropFilter: 'blur(15px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 20px rgba(22, 163, 74, 0.1)',
          marginBottom: '2rem'
        }}
      >
        <div className={styles.processingContainer}>
          <CheckCircle size={48} className={styles.processingIcon} />
          <Text 
            fw={700} 
            size="xl" 
            c="#16a34a" 
            ta="center"
            className={styles.processingTitle}
          >
            UNDER PROCESSING
          </Text>
          <Text 
            fw={500} 
            size="lg" 
            c="#FFFFFF" 
            ta="center"
            className={styles.processingMessage}
          >
            Transaction submitted! You will receive an email with trading platform credentials after payment confirmation.
          </Text>
        </div>
      </Paper>

      {/* Navigation Buttons */}
      {/* <Paper 
        p="xl" 
        radius="lg" 
        withBorder 
        style={{ 
          backgroundColor: 'rgba(26, 26, 26, 0.6)',
          borderColor: '#22c55e',
          backdropFilter: 'blur(15px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 20px rgba(34, 197, 94, 0.1)'
        }}
      >
        <Group justify="center">
          <Button
            size="xl"
            radius="lg"
            onClick={handleBack}
            leftSection={<ChevronLeft size={20} />}
            styles={{
              root: {
                backgroundColor: 'transparent',
                color: '#16a34a',
                border: '2px solid #16a34a',
                fontWeight: 700,
                fontSize: '1.1rem',
                padding: '16px 32px',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(22, 163, 74, 0.2)',
                '&:hover': {
                  backgroundColor: 'rgba(22, 163, 74, 0.1)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(22, 163, 74, 0.3)',
                },
              },
            }}
          >
            Back
          </Button>
        </Group>
      </Paper> */}
    </div>
  );

  const renderPaymentForm = () => (
    <div className={styles.stepContent}>
      <Text 
        fw={700} 
        size="2.5rem" 
        c="#FFFFFF" 
        ta="center" 
        mb="xl"
        style={{ 
          textShadow: '0 0 20px rgba(34, 197, 94, 0.3)',
          letterSpacing: '1px'
        }}
      >
        Submit Transaction Details
      </Text>
      
      {/* Transaction ID Form */}
      <Paper 
        p="xl" 
        radius="lg" 
        withBorder 
        style={{ 
          backgroundColor: 'rgba(26, 26, 26, 0.6)',
          borderColor: 'transparent',
          backdropFilter: 'blur(15px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 20px rgba(22, 163, 74, 0.1)',
          marginBottom: '2rem'
        }}
      >
        <Stack gap="lg">
          <Text 
            fw={700} 
            size="lg" 
            tt="uppercase" 
            c="#16a34a" 
            ta="center" 
            style={{ 
              backgroundColor: '#1A3A1A', 
              padding: '12px 24px', 
              borderRadius: '8px',
              border: '1px solid #16a34a',
              boxShadow: '0 4px 12px rgba(22, 163, 74, 0.2)',
              letterSpacing: '2px'
            }}
          >
            SUBMIT TRANSACTION DETAILS
          </Text>
          
          <div>
            <Text fw={600} c="#FFFFFF" size="md" mb="sm">
              Transaction ID:
            </Text>
            <input
              type="text"
              value={formData.transactionId}
              onChange={(e) => handleInputChange('transactionId', e.target.value)}
              placeholder="Enter your transaction ID here"
              className={styles.transactionInput}
            />
          </div>

          <Button
            size="xl"
            radius="lg"
            onClick={handleTransactionSubmit}
            styles={{
              root: {
                backgroundColor: '#16a34a',
                color: '#000000',
                border: '2px solid #16a34a',
                fontWeight: 700,
                fontSize: '1.1rem',
                padding: '16px 32px',
                transition: 'all 0.3s ease',
                boxShadow: '0 8px 25px rgba(22, 163, 74, 0.3)',
                '&:hover': {
                  backgroundColor: '#15803d',
                  borderColor: '#15803d',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 35px rgba(22, 163, 74, 0.4)',
                },
              },
            }}
          >
            Submit
          </Button>
        </Stack>
      </Paper>

      {/* Navigation Buttons */}
      <Paper 
        p="xl" 
        radius="lg" 
        withBorder 
        style={{ 
          backgroundColor: 'rgba(26, 26, 26, 0.6)',
          borderColor: '#22c55e',
          backdropFilter: 'blur(15px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 20px rgba(34, 197, 94, 0.1)'
        }}
      >
        <Group justify="space-between">
          <Button
            size="xl"
            radius="lg"
            onClick={handleBack}
            leftSection={<ChevronLeft size={20} />}
            styles={{
              root: {
                backgroundColor: 'transparent',
                color: '#16a34a',
                border: '2px solid #16a34a',
                fontWeight: 700,
                fontSize: '1.1rem',
                padding: '16px 32px',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(22, 163, 74, 0.2)',
                '&:hover': {
                  backgroundColor: 'rgba(22, 163, 74, 0.1)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(22, 163, 74, 0.3)',
                },
              },
            }}
          >
            Back
          </Button>
        </Group>
      </Paper>
    </div>
  );

  const renderOrderSummary = () => (
    <div className={styles.stepContent}>
       <Text 
         fw={700} 
         size="2.5rem" 
         c="#FFFFFF" 
         ta="center" 
         mb="xl"
         style={{ 
           textShadow: '0 0 20px rgba(34, 197, 94, 0.3)',
           letterSpacing: '1px'
         }}
       >
         Order Summary
       </Text>
       
       {/* Challenge Details Card */}
       <Paper 
         p="xl" 
         radius="lg" 
         withBorder 
         style={{ 
           backgroundColor: 'rgba(26, 26, 26, 0.6)',
           borderColor: '#22c55e',
           backdropFilter: 'blur(15px)',
           boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 20px rgba(34, 197, 94, 0.1)',
           marginBottom: '2rem'
         }}
       >
         <Stack gap="lg">
           <Text 
             fw={700} 
             size="lg" 
             tt="uppercase" 
                            c="#16a34a" 
               ta="center" 
               style={{ 
                 backgroundColor: '#1A3A1A', 
                 padding: '12px 24px', 
                 borderRadius: '8px',
                 border: '1px solid #16a34a',
                 boxShadow: '0 4px 12px rgba(22, 163, 74, 0.2)',
                 letterSpacing: '2px',
                 display: 'inline-block',
                 margin: '0 auto'
               }}
           >
             CHALLENGE DETAILS
           </Text>
        
        <div className={styles.summaryDetails}>
          <div className={styles.summaryRow}>
               <Text fw={600} c="#CCCCCC">Challenge Type:</Text>
               <Text fw={700} c="#FFFFFF">{challengeType === 'twoStage' ? 'Two Stages' : 'Single Stage'}</Text>
          </div>
          <div className={styles.summaryRow}>
               <Text fw={600} c="#CCCCCC">Platform:</Text>
               <Text fw={700} c="#FFFFFF">{formData.platform}</Text>
          </div>
          <div className={styles.summaryRow}>
               <Text fw={600} c="#CCCCCC">Account Size:</Text>
               <Text fw={700} c="#FFFFFF">{accountSizes.find(size => size.value === formData.accountSize)?.label}</Text>
          </div>
        </div>

        <div className={styles.summaryTotal}>
          <div className={styles.totalRow}>
               <Text fw={700} size="lg" c="#16a34a">Subtotal:</Text>
               <Text fw={700} size="lg" c="#FFFFFF">
                 ${getSubtotal()}
               </Text>
          </div>
          
          {formData.discountAmount > 0 && (
            <div className={styles.totalRow}>
              <Text fw={700} size="lg" c="#ef4444">Discount:</Text>
              <Text fw={700} size="lg" c="#ef4444">
                -${getDiscountAmount()}
              </Text>
            </div>
          )}
          
          <div className={styles.totalRow} style={{ borderTop: '2px solid #16a34a', paddingTop: '12px', marginTop: '8px' }}>
               <Text fw={700} size="lg" c="#16a34a">Total Cost:</Text>
               <Text fw={900} size="2rem" c="#FFFFFF" style={{ textShadow: '0 0 20px rgba(22, 163, 74, 0.5)' }}>
                 ${getTotalCost()}
               </Text>
          </div>
        </div>
         </Stack>
       </Paper>

       {/* Coupon Code Section */}
       <Paper 
         p="xl" 
         radius="lg" 
         withBorder 
         style={{ 
           backgroundColor: 'rgba(26, 26, 26, 0.6)',
           borderColor: '#22c55e',
           backdropFilter: 'blur(15px)',
           boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 20px rgba(34, 197, 94, 0.1)',
           marginBottom: '2rem'
         }}
       >
         <Stack gap="md">
           <Text fw={700} size="lg" c="#FFFFFF" ta="center">
             Coupon Code
           </Text>
           
           <Group gap="md" align="flex-end">
             <div style={{ flex: 1 }}>
               <input
                 type="text"
                 placeholder="Enter coupon code"
                 value={formData.couponCode}
                 onChange={(e) => handleInputChange('couponCode', e.target.value)}
                 style={{
                   width: '100%',
                   padding: '12px 16px',
                   backgroundColor: 'rgba(26, 26, 26, 0.8)',
                   border: '2px solid #22c55e',
                   borderRadius: '8px',
                   color: '#FFFFFF',
                   fontSize: '1rem',
                   outline: 'none',
                   transition: 'all 0.3s ease',
                   '&:focus': {
                     borderColor: 'transparent',
                     boxShadow: '0 0 10px rgba(22, 163, 74, 0.3)'
                   }
                 }}
                 onFocus={(e) => {
                   e.target.style.borderColor = '#16a34a';
                   e.target.style.boxShadow = '0 0 10px rgba(22, 163, 74, 0.3)';
                 }}
                 onBlur={(e) => {
                   e.target.style.borderColor = '#22c55e';
                   e.target.style.boxShadow = 'none';
                 }}
               />
             </div>
             
             <Button
               size="lg"
               radius="lg"
               onClick={handleCouponApply}
               disabled={!formData.couponCode.trim()}
               styles={{
                 root: {
                   backgroundColor: '#16a34a',
                   color: '#000000',
                   border: '2px solid #16a34a',
                   fontWeight: 700,
                   fontSize: '1rem',
                   padding: '12px 24px',
                   transition: 'all 0.3s ease',
                   boxShadow: '0 4px 15px rgba(22, 163, 74, 0.2)',
                   '&:hover': {
                     backgroundColor: '#15803d',
                     borderColor: '#15803d',
                     transform: 'translateY(-2px)',
                     boxShadow: '0 8px 25px rgba(22, 163, 74, 0.3)',
                   },
                   '&:disabled': {
                     backgroundColor: '#666666',
                     color: '#CCCCCC',
                     cursor: 'not-allowed',
                     transform: 'none',
                     borderColor: '#666666',
                     boxShadow: 'none',
                   },
                 },
               }}
             >
               Apply
             </Button>
           </Group>
           
           {formData.appliedCoupon === 'INVALID' && (
             <Text fw={600} size="sm" c="#ef4444" ta="center" style={{ 
               backgroundColor: 'rgba(239, 68, 68, 0.1)',
               padding: '8px 16px',
               borderRadius: '6px',
               border: '1px solid #ef4444'
             }}>
               Invalid coupon code
             </Text>
           )}
           
           {formData.appliedCoupon === 'WELCOME15' && (
             <Text fw={600} size="sm" c="#16a34a" ta="center" style={{ 
               backgroundColor: 'rgba(22, 163, 74, 0.1)',
               padding: '8px 16px',
               borderRadius: '6px',
               border: '1px solid #16a34a'
             }}>
               ✓ Coupon applied successfully! 15% discount applied.
             </Text>
           )}
         </Stack>
       </Paper>

       {/* Terms and Conditions */}
       <Paper 
         p="xl" 
         radius="lg" 
         withBorder 
         style={{ 
           backgroundColor: 'rgba(26, 26, 26, 0.6)',
           borderColor: '#22c55e',
           backdropFilter: 'blur(15px)',
           boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 20px rgba(34, 197, 94, 0.1)',
           marginBottom: '2rem'
         }}
       >
         <Group gap="md" align="center">
          <input
            type="checkbox"
            checked={formData.agreeToTerms}
            onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
             style={{
               width: '20px',
               height: '20px',
               accentColor: '#16a34a',
               cursor: 'pointer'
             }}
           />
           <Text fw={600} c="#FFFFFF" size="lg">
          I have read and agree to the Rules and Conditions
           </Text>
         </Group>
       </Paper>

       {/* Navigation Buttons */}
       <Paper 
         p="xl" 
         radius="lg" 
         withBorder 
         style={{ 
           backgroundColor: 'rgba(26, 26, 26, 0.6)',
           borderColor: '#22c55e',
           backdropFilter: 'blur(15px)',
           boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 20px rgba(34, 197, 94, 0.1)'
         }}
       >
         <Group justify="space-between">
           <Button
             size="xl"
             radius="lg"
             onClick={handleBack}
             leftSection={<ChevronLeft size={20} />}
             styles={{
               root: {
                 backgroundColor: 'transparent',
                                    color: '#16a34a',
                   border: '2px solid #16a34a',
                   fontWeight: 700,
                   fontSize: '1.1rem',
                   padding: '16px 32px',
                   transition: 'all 0.3s ease',
                   boxShadow: '0 4px 15px rgba(22, 163, 74, 0.2)',
                   '&:hover': {
                     backgroundColor: 'rgba(22, 163, 74, 0.1)',
                     transform: 'translateY(-2px)',
                     boxShadow: '0 8px 25px rgba(22, 163, 74, 0.3)',
                   },
               },
             }}
           >
             Back
           </Button>
           
           <Button
             size="xl"
             radius="lg"
             onClick={handleConfirmOrder}
             disabled={!formData.agreeToTerms}
             rightSection={<Check size={20} />}
             styles={{
               root: {
                 backgroundColor: '#16a34a',
                 color: '#000000',
                 border: '2px solid #16a34a',
                 fontWeight: 700,
                 fontSize: '1.1rem',
                 padding: '16px 32px',
                 transition: 'all 0.3s ease',
                 boxShadow: '0 8px 25px rgba(22, 163, 74, 0.3)',
                 '&:hover': {
                   backgroundColor: '#15803d',
                   borderColor: '#15803d',
                   transform: 'translateY(-2px)',
                   boxShadow: '0 12px 35px rgba(22, 163, 74, 0.4)',
                 },
               '&:disabled': {
                 backgroundColor: '#666666',
                 color: '#CCCCCC',
                 cursor: 'not-allowed',
                 transform: 'none',
                 borderColor: '#666666',
                 boxShadow: 'none',
               },
             },
           }}
         >
           {!formData.agreeToTerms ? 'Agree to Terms First' : 'Proceed to Payment'}
         </Button>
         </Group>
       </Paper>
    </div>
  );

  return (
    <div className={styles.tradingChallenge}>
      <div className={styles.container}>
        <div className={styles.stepContainer}>
          {currentStep === 1 && renderAccountSetup()}
          {currentStep === 2 && renderOrderSummary()}
          {currentStep === 3 && renderQr()}
          {currentStep === 4 && renderPaymentForm()}
          {currentStep === 5 && renderProcessingConfirmation()}
        </div>
      </div>
    </div>
  );
};

export default TradingChallenge;