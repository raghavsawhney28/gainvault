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
    if (!provider) return;

    setWallet(provider);

    // Attempt trusted reconnection
    provider
      .connect({ onlyIfTrusted: true })
      .then(({ publicKey }) => {
        setPublicKey(publicKey);
        setConnected(true);

        const token = localStorage.getItem("phantom_jwt");
        if (token) {
          setJwtToken(token);
        }
      })
      .catch(() => {
        // User rejected or not previously connected
      });

    // ✅ Handle manual or triggered disconnect
    const handleDisconnect = () => {
      console.log("Phantom wallet disconnected");
      setConnected(false);
      setPublicKey(null);
      setJwtToken(null);
      localStorage.removeItem("phantom_jwt");
    };

    provider.on("disconnect", handleDisconnect);

    // Cleanup on unmount
    return () => {
      provider.off("disconnect", handleDisconnect);
    };
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

      const nonceRes = await axios.get("/api/auth/nonce");
      const { nonce } = nonceRes.data;

      const message = `Sign this message to authenticate with our app.\n\nNonce: ${nonce}`;
      const encoded = new TextEncoder().encode(message);

      const signed = await provider.signMessage(encoded, "utf8");

      const authRes = await axios.post("/api/auth/phantom-signin", {
        publicKey: response.publicKey.toString(),
        signature: Buffer.from(signed.signature).toString("base64"),
        message
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
    try {
      const provider = getProvider();
      if (provider?.disconnect) {
        await provider.disconnect();
      }
    } catch (error) {
      console.error("Error disconnecting from Phantom:", error);
    }

    setConnected(false);
    setPublicKey(null);
    setJwtToken(null);
    localStorage.removeItem("phantom_jwt");

    // Optional: refresh the app
    // window.location.reload();
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
