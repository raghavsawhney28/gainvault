import { useState, useEffect, useCallback } from "react";
import { Buffer } from "buffer";
import axios from "axios";
import useAuth from "./useAuth";  // Import the unified auth hook

const usePhantomWallet = () => {
  const [wallet, setWallet] = useState(null);
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [publicKey, setPublicKey] = useState(null);

  const { signin } = useAuth();  // Use signin from useAuth

  const getProvider = useCallback(() => {
    if ("phantom" in window) {
      const provider = window.phantom?.solana;
      if (provider?.isPhantom) return provider;
    }
    return null;
  }, []);

  useEffect(() => {
    const provider = getProvider();
    const autoConnect = localStorage.getItem("phantom_auto_connect") !== "false";

    if (provider) {
      setWallet(provider);
      if (autoConnect) {
        provider
          .connect({ onlyIfTrusted: true })
          .then(({ publicKey }) => {
            setPublicKey(publicKey);
            setConnected(true);
            // Auto-login when wallet connects
            handleAutoLogin(publicKey);
          })
          .catch(() => {});
      }
    }
  }, [getProvider]);

  const handleAutoLogin = async (walletPublicKey) => {
    try {
      console.log('🔗 Starting auto-login for wallet:', walletPublicKey.toString());
      
      // Get nonce from backend
      const nonceRes = await axios.get("https://gainvault.onrender.com/api/auth/nonce");
      const { nonce } = nonceRes.data;
      console.log('🔗 Nonce received:', nonce);

      const message = `Sign this message to authenticate with GainVault.\n\nNonce: ${nonce}`;
      const encodedMessage = new TextEncoder().encode(message);

      // User signs the message
      const provider = getProvider();
      const signedMessage = await provider.signMessage(encodedMessage, "utf8");
      const base64Signature = Buffer.from(signedMessage.signature).toString("base64");
      console.log('🔗 Message signed successfully');

      // Try to sign in first (for existing users)
      try {
        const authRes = await axios.post("https://gainvault.onrender.com/api/auth/phantom-signin", {
          publicKey: walletPublicKey.toString(),
          signature: base64Signature,
          message,
        });

        const { token, user } = authRes.data;
        console.log('🔗 Sign in successful, token received');

        // Use signin from useAuth to update app state & store token
        console.log('🔗 Calling useAuth signin...');
        const result = await signin({ token, phantom: true, user });
        console.log('🔗 useAuth signin result:', result);

      } catch (signinError) {
        // If sign in fails (user not found), this means they need to sign up
        console.log('🔗 Sign in failed, user needs to sign up:', signinError.response?.data?.error);
        // We'll handle signup in the AuthPage component
        return { needsSignup: true, walletPublicKey, nonce, message, base64Signature };
      }

    } catch (error) {
      console.error("❌ Auto-login failed:", error);
      // Don't show error to user for auto-login failures
      return { error: error.message };
    }
  };
  const connectWallet = useCallback(async () => {
    const provider = getProvider();

    if (!provider) {
      alert("Phantom wallet not found! Please install Phantom wallet.");
      window.open("https://phantom.app/", "_blank");
      return;
    }

    try {
      setConnecting(true);
      console.log('🔗 Connecting to Phantom wallet...');

      const response = await provider.connect();
      console.log('🔗 Wallet connected, public key:', response.publicKey.toString());
      
      setPublicKey(response.publicKey);
      setConnected(true);

      localStorage.setItem("phantom_auto_connect", "true");

      // Auto-login when wallet connects manually
      console.log('🔗 Starting auto-login process...');
      await handleAutoLogin(response.publicKey);

    } catch (error) {
      console.error("❌ Error connecting to Phantom wallet:", error);
      alert("Failed to connect to Phantom wallet. Please try again.");
    } finally {
      setConnecting(false);
    }
  }, [getProvider, signin]);

  const disconnectWallet = useCallback(async () => {
    if (wallet) {
      try {
        await wallet.disconnect();
      } catch (error) {
        console.error("Error disconnecting:", error);
      }
    }

    setConnected(false);
    setPublicKey(null);
    localStorage.setItem("phantom_auto_connect", "false");
  }, [wallet]);

  const handleSignup = async (walletPublicKey, username, email, nonce, message, signature) => {
    try {
      console.log('🔗 Starting signup for wallet:', walletPublicKey.toString());
      
      // Send signup request to backend
      const signupRes = await axios.post("https://gainvault.onrender.com/api/auth/phantom-signup", {
        publicKey: walletPublicKey.toString(),
        signature,
        message,
        username,
        email
      });

      const { token, user } = signupRes.data;
      console.log('🔗 Signup successful, token received');

      // Use signin from useAuth to update app state & store token
      console.log('🔗 Calling useAuth signin after signup...');
      const result = await signin({ token, phantom: true, user });
      console.log('🔗 useAuth signin result after signup:', result);

      return { success: true, user };
    } catch (error) {
      console.error("❌ Signup failed:", error);
      throw error;
    }
  };

  const formatAddress = useCallback((address) => {
    if (!address) return "";
    const str = address.toString();
    return `${str.slice(0, 4)}...${str.slice(-4)}`;
  }, []);

  return {
    wallet,
    connected,
    connecting,
    publicKey,
    connectWallet,
    disconnectWallet,
    handleSignup,
    formatAddress,
    isPhantomInstalled: !!getProvider(),
  };
};

export default usePhantomWallet;
