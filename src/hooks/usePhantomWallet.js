import { useState, useEffect, useCallback } from 'react';
import { PublicKey } from '@solana/web3.js';
import axios from 'axios';

const usePhantomWallet = () => {
  const [wallet, setWallet] = useState(null);
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [publicKey, setPublicKey] = useState(null);
  const [jwtToken, setJwtToken] = useState(null);

  // Check if Phantom wallet is installed
  const getProvider = useCallback(() => {
    if ('phantom' in window) {
      const provider = window.phantom?.solana;
      if (provider?.isPhantom) {
        return provider;
      }
    }
    return null;
  }, []);

  // Initialize wallet connection on component mount
  useEffect(() => {
    const provider = getProvider();
    if (provider) {
      setWallet(provider);
      
      // Check if already connected
      provider.connect({ onlyIfTrusted: true })
        .then(({ publicKey }) => {
          setPublicKey(publicKey);
          setConnected(true);
          // Check for existing JWT token
          const token = localStorage.getItem('phantom_jwt');
          if (token) {
            setJwtToken(token);
          }
        })
        .catch(() => {
          // User not connected or rejected
        });
    }
  }, [getProvider]);

  // Connect to Phantom wallet
  const connectWallet = useCallback(async () => {
    const provider = getProvider();
    
    if (!provider) {
      alert('Phantom wallet not found! Please install Phantom wallet.');
      window.open('https://phantom.app/', '_blank');
      return;
    }

    try {
      setConnecting(true);
      
      // Connect to wallet
      const response = await provider.connect();
      setPublicKey(response.publicKey);
      setConnected(true);
      
      // Get nonce from backend
      const nonceResponse = await axios.get('/api/auth/nonce');
      const { nonce } = nonceResponse.data;
      
      // Create message to sign
      const message = `Sign this message to authenticate with our app.\n\nNonce: ${nonce}`;
      const encodedMessage = new TextEncoder().encode(message);
      
      // Request signature
      const signedMessage = await provider.signMessage(encodedMessage, 'utf8');
      
      // Send to backend for verification
      const authResponse = await axios.post('/api/auth/phantom-signin', {
        publicKey: response.publicKey.toString(),
        signature: Array.from(signedMessage.signature),
        message: message
      });
      
      const { token } = authResponse.data;
      setJwtToken(token);
      localStorage.setItem('phantom_jwt', token);
      
    } catch (error) {
      console.error('Error connecting to Phantom wallet:', error);
      alert('Failed to connect to Phantom wallet. Please try again.');
    } finally {
      setConnecting(false);
    }
  }, [getProvider]);

  // Disconnect wallet
  const disconnectWallet = useCallback(async () => {
    if (wallet) {
      try {
        await wallet.disconnect();
      } catch (error) {
        console.error('Error disconnecting:', error);
      }
    }
    
    setConnected(false);
    setPublicKey(null);
    setJwtToken(null);
    localStorage.removeItem('phantom_jwt');
  }, [wallet]);

  // Format wallet address for display
  const formatAddress = useCallback((address) => {
    if (!address) return '';
    const addr = address.toString();
    return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
  }, []);

  return {
    wallet,
    connected,
    connecting,
    publicKey,
    jwtToken,
    connectWallet,
    disconnectWallet,
    formatAddress,
    isPhantomInstalled: !!getProvider()
  };
};

export default usePhantomWallet;

