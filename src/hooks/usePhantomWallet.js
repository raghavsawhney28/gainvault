// usePhantomWallet.js
import { useState, useEffect, useCallback } from "react";
import { Buffer } from "buffer";
import axios from "axios";
import useAuth from "./useAuth";

const usePhantomWallet = () => {
  const [wallet, setWallet] = useState(null);
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [publicKey, setPublicKey] = useState(null);
  const [needsSignup, setNeedsSignup] = useState(false);
  const [signupContext, setSignupContext] = useState(null);

  const { signin, logout } = useAuth();

  const getProvider = useCallback(() => {
    if ("phantom" in window) {
      const provider = window.phantom?.solana;
      if (provider?.isPhantom) return provider;
    }
    return null;
  }, []);

  useEffect(() => {
    const provider = getProvider();
    const autoConnect = localStorage.getItem("phantom_auto_connect") === "true";

    if (provider) {
      setWallet(provider);
      if (autoConnect) {
        provider
          .connect({ onlyIfTrusted: true })
          .then(({ publicKey }) => {
            setPublicKey(publicKey);
            setConnected(true);
            // 🔗 attempt auto-login when trusted connect succeeds
            handleAutoLogin(publicKey);
          })
          .catch(() => {});
      }
    }
  }, [getProvider]);

  const signNonceMessage = async (nonce) => {
    const message = `Sign this message to authenticate with GainVault.\n\nNonce: ${nonce}`;
    const encodedMessage = new TextEncoder().encode(message);
    const provider = getProvider();
    const signedMessage = await provider.signMessage(encodedMessage, "utf8");
    const base64Signature = Buffer.from(signedMessage.signature).toString("base64");
    return { message, signature: base64Signature };
  };

  const handleAutoLogin = async (walletPublicKey) => {
    try {
      const nonceRes = await axios.get("https://gainvault.onrender.com/api/auth/nonce");
      const { nonce } = nonceRes.data;

      const { message, signature } = await signNonceMessage(nonce);

      try {
        // Try sign in first
        const authRes = await axios.post("https://gainvault.onrender.com/api/auth/phantom-signin", {
          publicKey: walletPublicKey.toString(),
          signature,
          message,
        });

        const { token, user } = authRes.data;
        await signin({ token, phantom: true, user });
        setNeedsSignup(false);
        setSignupContext(null);
      } catch (signinError) {
        // ❌ No existing user → must sign up
        setNeedsSignup(true);
        setSignupContext({
          walletPublicKey,
          nonce,
          message,
          signature,
        });
      }
    } catch (error) {
      console.error("❌ Auto-login failed:", error);
      setNeedsSignup(false);
      setSignupContext(null);
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
      const response = await provider.connect();
      setPublicKey(response.publicKey);
      setConnected(true);
      localStorage.setItem("phantom_auto_connect", "true");
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
    setNeedsSignup(false);
    setSignupContext(null);
    localStorage.setItem("phantom_auto_connect", "false");
    logout?.();
  }, [wallet, logout]);

  const handleSignup = async (username, email) => {
    if (!signupContext) throw new Error("Missing signup context");

    try {
      const { walletPublicKey, message, signature } = signupContext;

      const signupRes = await axios.post("https://gainvault.onrender.com/api/auth/phantom-signup", {
        publicKey: walletPublicKey.toString(),
        signature,
        message,
        username,
        email,
      });

      const { token, user } = signupRes.data;
      await signin({ token, phantom: true, user });

      setNeedsSignup(false);
      setSignupContext(null);

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
    needsSignup,
    signupContext,
  };
};

export default usePhantomWallet;
