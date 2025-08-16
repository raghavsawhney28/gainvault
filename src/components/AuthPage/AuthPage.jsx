// AuthPage.jsx
import React, { useState, useEffect } from "react";
import { Buffer } from "buffer";
import {
  User,
  Mail,
  Wallet,
  CheckCircle,
  AlertCircle,
  Loader2
} from "lucide-react";
import usePhantomWallet from "../../hooks/usePhantomWallet";
import useAuth from "../../hooks/useAuth";
import styles from "./AuthPage.module.css";

const AuthPage = ({ onAuthSuccess, onClose }) => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [authStep, setAuthStep] = useState("connect"); // connect, signup, success

  const {
    connected,
    connecting,
    publicKey,
    connectWallet,
    handleSignup,
    formatAddress,
    isPhantomInstalled
  } = usePhantomWallet();

  const { error, clearError, isLoggedIn } = useAuth();
  const [localError, setLocalError] = useState("");

  // Use local error state for form validation
  const setError = (message) => setLocalError(message);
  const errorToShow = localError || error;

  // Auto-close modal when user gets logged in
  useEffect(() => {
    if (isLoggedIn) {
      onAuthSuccess?.();
    }
  }, [isLoggedIn, onAuthSuccess]);

  // Handle wallet connection and authentication
  useEffect(() => {
    if (connected && publicKey) {
      handleWalletAuth();
    }
  }, [connected, publicKey]);


  const handleWalletAuth = async () => {
    try {
      setIsLoading(true);
      clearError();
      
      // Get nonce from backend
      const nonceRes = await fetch("https://gainvault.onrender.com/api/auth/nonce");
      const { nonce } = await nonceRes.json();
      
      const message = `Sign this message to authenticate with GainVault.\n\nNonce: ${nonce}`;
      const encodedMessage = new TextEncoder().encode(message);

      // User signs the message
      const provider = window.phantom?.solana;
      const signedMessage = await provider.signMessage(encodedMessage, "utf8");
      const base64Signature = Buffer.from(signedMessage.signature).toString("base64");

      // Try to sign in first (for existing users)
      try {
        const signinRes = await fetch("https://gainvault.onrender.com/api/auth/phantom-signin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            publicKey: publicKey.toString(),
            signature: base64Signature,
            message,
          }),
        });

        if (signinRes.ok) {
          const { token, user } = await signinRes.json();
          localStorage.setItem('auth_token', token);
          setSuccess("Welcome back! You're now signed in.");
          setAuthStep("success");
          setTimeout(() => {
            onAuthSuccess?.();
          }, 2000);
          return;
        }
      } catch (signinError) {
        console.log("Sign in failed, user needs to sign up");
      }

      // If sign in fails, user needs to sign up
      setAuthStep("signup");
      
    } catch (error) {
      console.error("Wallet auth failed:", error);
      setError("Authentication failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
    clearError();
  };

  const validateForm = () => {
    if (!formData.username.trim()) {
      alert("Username is required");
      return false;
    }
    if (formData.username.length < 3) {
      alert("Username must be at least 3 characters long");
      return false;
    }
    if (!formData.email.trim()) {
      alert("Email is required");
      return false;
    }
    if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
      alert("Please enter a valid email address");
      return false;
    }
    return true;
  };

  const handleFormSignup = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setSuccess("");
    clearError();

    try {
      // Get nonce again for signup
      const nonceRes = await fetch("https://gainvault.onrender.com/api/auth/nonce");
      const { nonce } = await nonceRes.json();
      
      const message = `Sign this message to authenticate with GainVault.\n\nNonce: ${nonce}`;
      const encodedMessage = new TextEncoder().encode(message);

      // User signs the message
      const provider = window.phantom?.solana;
      const signedMessage = await provider.signMessage(encodedMessage, "utf8");
      const base64Signature = Buffer.from(signedMessage.signature).toString("base64");

      // Send signup request
      const signupRes = await fetch("https://gainvault.onrender.com/api/auth/phantom-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          publicKey: publicKey.toString(),
          signature: base64Signature,
          message,
          username: formData.username.trim(),
          email: formData.email.trim()
        }),
      });

      if (signupRes.ok) {
        const { token, user } = await signupRes.json();
        localStorage.setItem('auth_token', token);
        setSuccess("Account created successfully! You're now signed in.");
        setAuthStep("success");
        setTimeout(() => {
          onAuthSuccess?.();
        }, 2000);
      } else {
        const errorData = await signupRes.json();
        throw new Error(errorData.error || "Signup failed");
      }
    } catch (err) {
      console.error("❌ Signup error:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
    setFormData({ username: "", email: "" });
    clearError();
    setSuccess("");
    setAuthStep("connect");
  };

  const renderContent = () => {
    switch (authStep) {
      case "connect":
        return (
          <div className={styles.walletSection}>
            <h3>Connect Your Phantom Wallet</h3>
            {!isPhantomInstalled ? (
              <div className={styles.walletPrompt}>
                <AlertCircle size={20} />
                <span>Phantom wallet not detected</span>
                <button
                  className={styles.installButton}
                  onClick={() => window.open("https://phantom.app/", "_blank")}
                >
                  Install Phantom
                </button>
              </div>
            ) : (
              <button
                className={styles.connectButton}
                onClick={connectWallet}
                disabled={connecting || isLoading}
              >
                <Wallet size={16} />
                {connecting ? "Connecting..." : "Connect Phantom Wallet"}
              </button>
            )}
          </div>
        );

      case "signup":
                 return (
           <form onSubmit={handleFormSignup} className={styles.authForm}>
            <div className={styles.formGroup}>
              <label>Username</label>
              <div className={styles.inputWrapper}>
                <User size={18} />
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleInputChange("username", e.target.value)}
                  placeholder="Enter your username"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Email</label>
              <div className={styles.inputWrapper}>
                <Mail size={18} />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter your email"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            {errorToShow && (
              <div className={styles.errorMessage}>
                <AlertCircle size={16} />
                {errorToShow}
              </div>
            )}

            <button
              type="submit"
              className={styles.submitButton}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className={styles.spinner} />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>
        );

      case "success":
        return (
          <div className={styles.successSection}>
            <CheckCircle size={48} className={styles.successIcon} />
            <h3>Welcome to GainVault!</h3>
            <p>{success}</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={styles.authOverlay}>
      <div className={styles.authModal}>
        <div className={styles.authHeader}>
          <h2>
            {authStep === "connect" && "Connect Wallet"}
            {authStep === "signup" && "Complete Your Profile"}
            {authStep === "success" && "Success!"}
          </h2>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        <div className={styles.authContent}>
          {renderContent()}

          {authStep === "connect" && (
            <div className={styles.authToggle}>
              <span>Already have an account?</span>
              <button onClick={toggleAuthMode}>
                Sign In
              </button>
            </div>
          )}

          {authStep === "signup" && (
            <div className={styles.authToggle}>
              <span>Already have an account?</span>
              <button onClick={toggleAuthMode}>
                Sign In
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
