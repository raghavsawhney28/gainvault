import { useEffect, useState, useCallback } from "react";

// Phantom wallet provider check
const getProvider = () => {
  if ("phantom" in window) {
    const provider = window.phantom?.solana;
    if (provider?.isPhantom) {
      return provider;
    }
  }
  return null;
};

const usePhantomWallet = () => {
  const [provider, setProvider] = useState(null);
  const [publicKey, setPublicKey] = useState(null);
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Initialize Phantom provider
  useEffect(() => {
    const p = getProvider();
    if (p) {
      setProvider(p);
      console.log("✅ Phantom wallet provider detected");
    } else {
      console.warn("❌ Phantom wallet not installed");
    }
  }, []);

  // ✅ Connect to Phantom wallet
  const connectWallet = useCallback(async () => {
    try {
      if (!provider) throw new Error("Phantom wallet not available");

      setLoading(true);
      const resp = await provider.connect();
      console.log("🔗 Connected wallet:", resp.publicKey.toString());

      setPublicKey(resp.publicKey.toString());
      setConnected(true);
      setError(null);
    } catch (err) {
      console.error("❌ Wallet connection failed:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [provider]);

  // ✅ Disconnect
  const disconnectWallet = useCallback(async () => {
    try {
      if (provider?.disconnect) {
        await provider.disconnect();
      }
    } catch (err) {
      console.error("⚠️ Wallet disconnect error:", err);
    } finally {
      setPublicKey(null);
      setConnected(false);
    }
  }, [provider]);

  return {
    provider,
    publicKey,
    connected,
    loading,
    error,
    connectWallet,
    disconnectWallet,
    isPhantomInstalled: !!getProvider(),
  };
};

export default usePhantomWallet;
