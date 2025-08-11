import { useState, useEffect, useCallback } from "react";
import { Buffer } from "buffer";
import axios from "axios";
import useAuth from "../hooks/useAuth";  // Import the unified auth hook

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
          })
          .catch(() => {});
      }
    }
  }, [getProvider]);

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

      // Get nonce from your backend
      const nonceRes = await axios.get("https://gainvault.onrender.com/api/auth/nonce");
      const { nonce } = nonceRes.data;

      const message = `Sign this message to authenticate with our app.\n\nNonce: ${nonce}`;
      const encodedMessage = new TextEncoder().encode(message);

      // User signs the message
      const signedMessage = await provider.signMessage(encodedMessage, "utf8");
      const base64Signature = Buffer.from(signedMessage.signature).toString("base64");

      // Send signature to backend for verification & JWT issuance
      const authRes = await axios.post("https://gainvault.onrender.com/api/auth/phantom-signin", {
        publicKey: response.publicKey.toString(),
        signature: base64Signature,
        message,
      });

      const { token, user } = authRes.data;

      // Use signin from useAuth to update app state & store token
      await signin({ token, user, phantom: true });

    } catch (error) {
      console.error("Error connecting to Phantom wallet:", error);
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
    formatAddress,
    isPhantomInstalled: !!getProvider(),
  };
};

export default usePhantomWallet;
