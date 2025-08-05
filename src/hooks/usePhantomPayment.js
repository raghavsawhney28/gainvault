import { useState } from 'react';
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import api from '../utils/api';

const usePhantomPayment = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [transactionSignature, setTransactionSignature] = useState(null);
  const [error, setError] = useState(null);

  // Solana connection
  const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');
  
  // Recipient address
  const RECIPIENT_ADDRESS = 'iWB2mdro9ct7rCyyz68jYE7EGNCTqiDLaqVTNpuJ68j';
  
  // SOL rate (USD per SOL)
  const SOL_RATE = 150;

  // Account size pricing map
  const ACCOUNT_PRICING = {
    '5k': 29,
    '10k': 55,
    '25k': 129,
    '50k': 249,
    '100k': 449,
    '200k': 849
  };

  const getAccountLabel = (accountSize) => {
    const labels = {
      '5k': '$5,000',
      '10k': '$10,000',
      '25k': '$25,000',
      '50k': '$50,000',
      '100k': '$100,000',
      '200k': '$200,000'
    };
    return labels[accountSize] || accountSize;
  };

  const calculateSOLAmount = (accountSize) => {
    const usdPrice = ACCOUNT_PRICING[accountSize];
    if (!usdPrice) return 0;
    return usdPrice / SOL_RATE;
  };

  const sendSOLPayment = async (accountSize, senderPublicKey) => {
    try {
      setIsProcessing(true);
      setError(null);
      setPaymentStatus('processing');

      // Validate inputs
      if (!accountSize || !senderPublicKey) {
        throw new Error('Missing required payment information');
      }

      const usdPrice = ACCOUNT_PRICING[accountSize];
      if (!usdPrice) {
        throw new Error('Invalid account size selected');
      }

      const solAmount = calculateSOLAmount(accountSize);
      const lamports = Math.floor(solAmount * LAMPORTS_PER_SOL);

      console.log(`Processing payment: ${solAmount} SOL (${usdPrice} USD) for ${getAccountLabel(accountSize)} account`);

      // Check if Phantom is available
      if (!window.solana || !window.solana.isPhantom) {
        throw new Error('Phantom wallet not found');
      }

      // Create recipient public key
      const recipientPubkey = new PublicKey(RECIPIENT_ADDRESS);
      const senderPubkey = new PublicKey(senderPublicKey.toString());

      // Get recent blockhash
      const { blockhash } = await connection.getLatestBlockhash();

      // Create transaction
      const transaction = new Transaction({
        recentBlockhash: blockhash,
        feePayer: senderPubkey,
      });

      // Add transfer instruction
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: senderPubkey,
          toPubkey: recipientPubkey,
          lamports: lamports,
        })
      );

      // Sign transaction with Phantom
      const signedTransaction = await window.solana.signTransaction(transaction);

      // Send transaction
      const signature = await connection.sendRawTransaction(signedTransaction.serialize());
      
      console.log('Transaction sent:', signature);
      setTransactionSignature(signature);
      setPaymentStatus('confirming');

      // Confirm transaction
      const confirmation = await connection.confirmTransaction(signature, 'confirmed');
      
      if (confirmation.value.err) {
        throw new Error('Transaction failed to confirm');
      }

      console.log('Transaction confirmed:', signature);
      setPaymentStatus('confirmed');

      // Send activation request to backend
      try {
        await api.post('/activate-challenge', {
          walletAddress: senderPublicKey.toString(),
          selectedAccountSize: getAccountLabel(accountSize),
          usdPrice: usdPrice,
          solAmount: solAmount,
          transactionSignature: signature
        });
        
        setPaymentStatus('activated');
        console.log('Challenge activation request sent successfully');
      } catch (apiError) {
        console.error('Failed to activate challenge:', apiError);
        // Payment succeeded but activation failed
        setPaymentStatus('payment_success_activation_pending');
      }

      return {
        success: true,
        signature,
        solAmount,
        usdPrice,
        accountSize: getAccountLabel(accountSize)
      };

    } catch (err) {
      console.error('Payment error:', err);
      setError(err.message || 'Payment failed');
      setPaymentStatus('failed');
      throw err;
    } finally {
      setIsProcessing(false);
    }
  };

  const resetPaymentState = () => {
    setIsProcessing(false);
    setPaymentStatus(null);
    setTransactionSignature(null);
    setError(null);
  };

  const getSolScanUrl = (signature) => {
    return `https://solscan.io/tx/${signature}`;
  };

  return {
    sendSOLPayment,
    calculateSOLAmount,
    getAccountLabel,
    getSolScanUrl,
    resetPaymentState,
    isProcessing,
    paymentStatus,
    transactionSignature,
    error,
    ACCOUNT_PRICING,
    SOL_RATE
  };
};

export default usePhantomPayment;