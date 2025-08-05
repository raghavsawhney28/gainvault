import { useState, useEffect, useCallback } from "react";
import { PublicKey } from "@solana/web3.js";
import axios from "axios";
import { Buffer } from "buffer"; // Needed for base64 signature

const usePhantomWallet = () => {
  const [wallet, setWallet] = useState(null);
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [publicKey, setPublicKey] = useState(null);
  const [jwtToken, setJwtToken] = useState(null);

  const getProvider = useCallback(() => {
    if ("phantom" in window) {
      const provider = window.phantom?.solana;
      if (provider?.isPhantom) return provider;
    }
    return null;
  }, []);

  // Auto-connect only if allowed
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
            const token = localStorage.getItem("phantom_jwt");
            if (token) {
              setJwtToken(token);
              axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            }
          })
          .catch(() => {
            // silently fail
          });
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

      // ✅ allow auto-connect next time
      localStorage.setItem("phantom_auto_connect", "true");

      // Get nonce
      const nonceRes = await axios.get("https://gainvault.onrender.com/api/auth/nonce");
      const { nonce } = nonceRes.data;

      const message = `Sign this message to authenticate with our app.\n\nNonce: ${nonce}`;
      const encodedMessage = new TextEncoder().encode(message);

      const signedMessage = await provider.signMessage(encodedMessage, "utf8");
      const base64Signature = Buffer.from(signedMessage.signature).toString("base64");

      const authRes = await axios.post("https://gainvault.onrender.com/api/auth/phantom-signin", {
        publicKey: response.publicKey.toString(),
        signature: base64Signature,
        message,
      });

      const { token } = authRes.data;
      setJwtToken(token);
      localStorage.setItem("phantom_jwt", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } catch (error) {
      console.error("Error connecting to Phantom wallet:", error);
      alert("Failed to connect to Phantom wallet. Please try again.");
    } finally {
      setConnecting(false);
    }
  }, [getProvider]);

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
    setJwtToken(null);
    localStorage.removeItem("phantom_jwt");

    // ✅ block auto-connect on refresh
    localStorage.setItem("phantom_auto_connect", "false");

    delete axios.defaults.headers.common["Authorization"];
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
    jwtToken,
    connectWallet,
    disconnectWallet,
    formatAddress,
    isPhantomInstalled: !!getProvider(),
  };
};

export default usePhantomWallet;
