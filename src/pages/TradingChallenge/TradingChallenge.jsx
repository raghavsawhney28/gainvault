import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Check, ExternalLink, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import usePhantomWallet from '../../hooks/usePhantomWallet';
import usePhantomPayment from '../../hooks/usePhantomPayment';
import styles from './TradingChallenge.module.css';
import { useMantineTheme } from '@mantine/core';
import { Paper, Stack, Text, Group, Button, Select, Card, Badge, Title } from '@mantine/core';

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
             borderColor: '#16a34a',
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
             borderColor: '#16a34a',
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
                    borderColor: '#16a34a',
                    borderWidth: '2px',
                    color: '#FFFFFF !important',
                    fontSize: '1.1rem',
                    padding: '16px 20px',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(22, 163, 74, 0.2)',
                    '&:focus': {
                      borderColor: '#16a34a',
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
                 item: {
                   backgroundColor: 'rgba(26, 26, 26, 0.95)',
                   color: '#FFFFFF',
                   fontSize: '1rem',
                   padding: '12px 20px',
                   '&[data-selected]': {
                     backgroundColor: '#16a34a',
                     color: '#000000',
                     fontWeight: 700,
                   },
                   '&[data-selected]:hover': {
                     backgroundColor: '#15803d',
                     color: '#000000',
                     fontWeight: 700,
                   },
                   '&:hover': {
                     backgroundColor: 'rgba(22, 163, 74, 0.1)',
                     color: '#16a34a',
                   },
                 },
                 dropdown: {
                   backgroundColor: 'rgba(26, 26, 26, 0.95)',
                   borderColor: '#16a34a',
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
             borderColor: '#16a34a',
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
                  padding="xl"
                  radius="lg"
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
                     borderWidth: formData.accountSize === size.value ? '3px' : '2px',
                     backgroundColor: formData.accountSize === size.value 
                       ? 'rgba(22, 163, 74, 0.15)' 
                       : 'rgba(26, 26, 26, 0.8)',
                     backdropFilter: 'blur(15px)',
                     boxShadow: formData.accountSize === size.value 
                       ? '0 12px 40px rgba(22, 163, 74, 0.3)' 
                       : '0 8px 25px rgba(0, 0, 0, 0.3)',
                  }}
                >
                  <Stack gap="md" ta="center">
                    <Text fw={800} size="xl" c="#FFFFFF" style={{ letterSpacing: '1px' }}>
                      {size.label}
                    </Text>
                                         <Title order={2} c="#16a34a" fw={900} style={{ 
                       textShadow: '0 0 20px rgba(22, 163, 74, 0.5)',
                       fontSize: '2.5rem'
                     }}>
                       ${challengeType === 'twoStage' ? size.price : size.singleStagePrice}
                     </Title>
                    <Badge 
                      variant="light" 
                      color="green" 
                      size="lg"
                      radius="md"
                      styles={{
                                                 root: {
                           backgroundColor: 'transparent',
                           color: '#16a34a',
                           borderColor: '#16a34a',
                           borderWidth: '2px',
                           textTransform: 'uppercase',
                           fontWeight: 700,
                           fontSize: '0.9rem',
                           padding: '8px 16px',
                           letterSpacing: '1px'
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
             borderColor: '#16a34a',
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
                   boxShadow: '0 8px 25px rgba(22, 163, 74, 0.3)',
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
               <Text fw={700} size="lg" c="#16a34a">Total Cost:</Text>
               <Text fw={900} size="2rem" c="#FFFFFF" style={{ textShadow: '0 0 20px rgba(22, 163, 74, 0.5)' }}>
                 ${getSelectedAccountPrice()}
               </Text>
             </div>
             {connected && formData.accountSize && (
               <div className={styles.solConversion}>
                 <Text fw={600} c="#CCCCCC">SOL Amount:</Text>
                 <Text fw={700} c="#FFFFFF">
                   ◎{calculateSOLAmount(formData.accountSize).toFixed(4)} SOL
                 </Text>
                 <Text fw={500} size="sm" c="#888888">@ ${SOL_RATE}/SOL</Text>
               </div>
             )}
           </div>
         </Stack>
       </Paper>

       {/* Wallet Connection Prompt */}
       {!connected && (
         <Paper 
           p="xl" 
           radius="lg" 
           withBorder 
           style={{ 
             backgroundColor: 'rgba(26, 26, 26, 0.6)',
             borderColor: '#16a34a',
             backdropFilter: 'blur(15px)',
             boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 20px rgba(22, 163, 74, 0.1)',
             marginBottom: '2rem'
           }}
         >
           <Group gap="md" align="center" justify="center">
             <AlertCircle size={24} color="#16a34a" />
             <Text fw={600} c="#FFFFFF" size="lg">
               Connect your Phantom wallet to proceed with payment
             </Text>
             <Button
               size="lg"
               radius="lg"
               onClick={connectWallet}
               styles={{
                 root: {
                   backgroundColor: '#16a34a',
                   color: '#000000',
                   border: '2px solid #16a34a',
                   fontWeight: 700,
                   fontSize: '1rem',
                   padding: '12px 24px',
                   transition: 'all 0.3s ease',
                   boxShadow: '0 4px 15px rgba(22, 163, 74, 0.3)',
                   '&:hover': {
                     backgroundColor: '#15803d',
                     borderColor: '#15803d',
                     transform: 'translateY(-2px)',
                     boxShadow: '0 8px 25px rgba(22, 163, 74, 0.4)',
                   },
                 },
               }}
             >
               Connect Wallet
             </Button>
           </Group>
         </Paper>
       )}

       {/* Payment Status */}
       {renderPaymentStatus()}

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
             disabled={!formData.agreeToTerms || !connected || isProcessing}
             rightSection={isProcessing ? <Loader2 size={20} className={styles.spinning} /> : <Check size={20} />}
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
             {isProcessing ? 'Processing...' : (connected ? 'Pay with SOL' : 'Connect Wallet First')}
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
        </div>
      </div>
    </div>
  );
};

export default TradingChallenge;