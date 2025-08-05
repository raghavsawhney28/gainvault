import { useState, useEffect, useCallback } from "react";
import { PublicKey } from "@solana/web3.js";
import axios from "axios";

const usePhantomWallet = () => {
  const [wallet, setWallet] = useState(null);
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [publicKey, setPublicKey] = useState(null);
  const [jwtToken, setJwtToken] = useState(null);

  const getProvider = useCallback(() => {
    if ("phantom" in window) {
      const provider = window.phantom?.solana;
      if (provider?.isPhantom) {
        return provider;
      }
    }
    return null;
  }, []);

  useEffect(() => {
    const provider = getProvider();
    if (provider) {
      setWallet(provider);

      provider
        .connect({ onlyIfTrusted: true })
        .then(({ publicKey }) => {
          setPublicKey(publicKey);
          setConnected(true);

          const token = localStorage.getItem("phantom_jwt");
          if (token) {
            setJwtToken(token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          }
        })
        .catch(() => {
          // Silent fail — user not connected
        });
    }
  }, [getProvider]);

  const connectWallet = useCallback(async () => {
    const provider = getProvider();

    if (!provider) {
      alert("Phantom wallet not found! Please install it.");
      window.open("https://phantom.app/", "_blank");
      return;
    }

    try {
      setConnecting(true);

      const response = await provider.connect();
      setPublicKey(response.publicKey);
      setConnected(true);

      const nonceRes = await axios.get("https://gainvault.onrender.com/api/auth/nonce");
      const { nonce } = nonceRes.data;

      const message = `Sign this message to authenticate with our app.\n\nNonce: ${nonce}`;
      const encodedMessage = new TextEncoder().encode(message);
      const signedMessage = await provider.signMessage(encodedMessage, "utf8");

      const base64Signature = btoa(String.fromCharCode(...signedMessage.signature));

      const authRes = await axios.post("https://gainvault.onrender.com/api/auth/phantom-signin", {
        publicKey: response.publicKey.toString(),
        signature: base64Signature,
        message,
      });
      console.log("PublicKey:", publicKey);
console.log("Signature:", signature);
console.log("Message:", message);


      const { token } = authRes.data;
      setJwtToken(token);
      localStorage.setItem("phantom_jwt", token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    } catch (error) {
      console.error("Error connecting to Phantom wallet:", error);
      alert("Failed to connect. Please try again.");
    } finally {
      setConnecting(false);
    }
  }, [getProvider]);

  const disconnectWallet = useCallback(async () => {
    try {
      const provider = getProvider();
      if (provider?.disconnect) {
        await provider.disconnect();

        // 🧼 Clean Phantom's internal session
        if (provider._handleDisconnect) {
          provider._handleDisconnect();
        }

        if (provider.autoConnect) {
          provider.autoConnect = false;
        }
      }
    } catch (error) {
      console.error("Error disconnecting from Phantom:", error);
    }

    setConnected(false);
    setPublicKey(null);
    setJwtToken(null);
    localStorage.removeItem("phantom_jwt");
  }, [getProvider]);

  const formatAddress = useCallback((address) => {
    if (!address) return "";
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
    isPhantomInstalled: !!getProvider(),
  };
};

export default usePhantomWallet;
