// AuthPage.jsx
import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Wallet,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import usePhantomWallet from "../../hooks/usePhantomWallet";
import useAuth from "../../hooks/useAuth";
import styles from "./AuthPage.module.css";

const AuthPage = ({ onAuthSuccess, onClose }) => {
  const [authStep, setAuthStep] = useState("connect"); // connect, signup, success
  const [formData, setFormData] = useState({ username: "", email: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [signupContext, setSignupContext] = useState(null); // store data from failed signin
  const [localError, setLocalError] = useState("");

  const { isLoggedIn, error, clearError } = useAuth();

  const {
    connected,
    connecting,
    publicKey,
    connectWallet,
    handleSignup,
    isPhantomInstalled,
  } = usePhantomWallet();

  const errorToShow = localError || error;

  // ✅ Auto-close modal once logged in
  useEffect(() => {
    if (isLoggedIn) {
      onAuthSuccess?.();
    }
  }, [isLoggedIn, onAuthSuccess]);

  // ✅ Wallet connect triggers auto-login attempt
  useEffect(() => {
    if (connected && publicKey && !isLoggedIn) {
      // If auto-login fails, hook will return needsSignup
      setAuthStep("signup");
    }
  }, [connected, publicKey, isLoggedIn]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    clearError();
    setLocalError("");
  };

  const validateForm = () => {
    if (!formData.username.trim()) return "Username is required";
    if (formData.username.length < 3)
      return "Username must be at least 3 characters";
    if (!formData.email.trim()) return "Email is required";
    if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email))
      return "Enter a valid email";
    return null;
  };

  const handleFormSignup = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setLocalError(validationError);
      return;
    }

    try {
      setIsLoading(true);
      clearError();

      // use hook signup handler
      await handleSignup(
        publicKey,
        formData.username.trim(),
        formData.email.trim(),
        signupContext?.nonce,
        signupContext?.message,
        signupContext?.signature
      );

      setSuccess("Account created successfully! You're now signed in.");
      setAuthStep("success");

      setTimeout(() => {
        onAuthSuccess?.();
      }, 1500);
    } catch (err) {
      setLocalError(err.message || "Signup failed");
    } finally {
      setIsLoading(false);
    }
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

        <div className={styles.authContent}>{renderContent()}</div>
      </div>
    </div>
  );
};

export default AuthPage;
