// AuthPage.jsx
import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Wallet,
  CheckCircle,
  AlertCircle,
  Loader2,
  ArrowRight,
  Sparkles,
  Shield,
} from "lucide-react";
import usePhantomWallet from "../../hooks/usePhantomWallet";
import useAuth from "../../hooks/useAuth";
import styles from "./AuthPage.module.css";

const AuthPage = ({ onAuthSuccess, onClose }) => {
  const [authMode, setAuthMode] = useState(null); // "signup" or "signin"
  const [formData, setFormData] = useState({ username: "", email: "", referralCode: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [localError, setLocalError] = useState("");

  const {
    connected,
    connecting,
    publicKey,
    connectWallet,
    isPhantomInstalled,
  } = usePhantomWallet();

  const { error, clearError, isLoggedIn, signin } = useAuth();
  
  // Use local error state for form validation
  const setError = (message) => setLocalError(message);
  const errorToShow = localError || error;

  // ✅ Auto-close modal once logged in
  useEffect(() => {
    if (isLoggedIn) {
      onAuthSuccess?.();
    }
  }, [isLoggedIn, onAuthSuccess]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
    clearError();
    setLocalError("");
  };

  const validateForm = () => {
    if (!formData.username.trim()) {
      setError("Username is required");
      return false;
    }
    if (formData.username.length < 3) {
      setError("Username must be at least 3 characters long");
      return false;
    }
    if (!formData.email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }
    return true;
  };

  // ✅ SIGNUP FLOW
  const handleSignup = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (!connected || !publicKey) {
      setError("Please connect your Phantom wallet first");
      return;
    }

    setIsLoading(true);
    setSuccess("");
    clearError();

    try {
      // Get nonce from backend
      const nonceRes = await fetch(`https://gainvault.onrender.com/api/auth/nonce/${publicKey.toString()}`);
      
      if (!nonceRes.ok) {
        throw new Error(`Failed to get nonce: ${nonceRes.status}`);
      }
      
      const { nonce } = await nonceRes.json();
      
      const message = `Sign this message to create your GainVault account.\n\nNonce: ${nonce}`;
      const encodedMessage = new TextEncoder().encode(message);

      // User signs the message
      const provider = window.phantom?.solana;
      if (!provider) {
        throw new Error("Phantom provider not found");
      }
      
      const signedMessage = await provider.signMessage(encodedMessage, "utf8");
      
      if (!signedMessage || !signedMessage.signature) {
        throw new Error("Message signing failed");
      }
      
      // Convert signature to base64 using browser-compatible method
      const signatureArray = Array.from(signedMessage.signature);
      const base64Signature = btoa(String.fromCharCode(...signatureArray));

      // Send signup request
      const signupData = {
        publicKey: publicKey.toString(),
        signature: base64Signature,
        message,
        username: formData.username.trim(),
        email: formData.email.trim(),
        referralCode: formData.referralCode.trim(),
      };

      const signupRes = await fetch("https://gainvault.onrender.com/api/auth/phantom-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupData),
      });
      
      if (signupRes.ok) {
        const { token, user } = await signupRes.json();
        
        // Store token and set user in state
        const signinResult = await signin({ token, user, phantom: true });
        console.log('✅ Signup result:', signinResult);
        
        setSuccess("Account created successfully! You're now signed in.");
        // Close modal immediately after successful signup
        setTimeout(() => {
          console.log('🎯 Calling onAuthSuccess from signup');
          onAuthSuccess?.();
        }, 1000);
      } else {
        const errorData = await signupRes.json().catch(() => ({}));
        throw new Error(errorData.error || "Signup failed");
      }
    } catch (err) {
      setLocalError(err.message || "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ SIGNIN FLOW
  const handleSignin = async () => {
    if (!connected || !publicKey) {
      setError("Please connect your Phantom wallet first");
      return;
    }

    setIsLoading(true);
    clearError();

    try {
      // Get nonce from backend
      const nonceRes = await fetch(`https://gainvault.onrender.com/api/auth/nonce/${publicKey.toString()}`);
      
      if (!nonceRes.ok) {
        throw new Error(`Failed to get nonce: ${nonceRes.status}`);
      }
      
      const { nonce } = await nonceRes.json();
      
      const message = `Sign this message to sign in to GainVault.\n\nNonce: ${nonce}`;
      const encodedMessage = new TextEncoder().encode(message);

      // User signs the message
      const provider = window.phantom?.solana;
      if (!provider) {
        throw new Error("Phantom provider not found");
      }
      
      const signedMessage = await provider.signMessage(encodedMessage, "utf8");
      
      if (!signedMessage || !signedMessage.signature) {
        throw new Error("Message signing failed");
      }
      
      // Convert signature to base64 using browser-compatible method
      const signatureArray = Array.from(signedMessage.signature);
      const base64Signature = btoa(String.fromCharCode(...signatureArray));

      // Send signin request
      const signinData = {
        publicKey: publicKey.toString(),
        signature: base64Signature,
        message,
      };

      const signinRes = await fetch("https://gainvault.onrender.com/api/auth/phantom-signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signinData),
      });
      
      if (signinRes.ok) {
        const { token, user } = await signinRes.json();
        
        // Store token and set user in state
        const signinResult = await signin({ token, user, phantom: true });
        console.log('✅ Signin result:', signinResult);
        
        setSuccess("Welcome back! You're now signed in.");
        // Close modal immediately after successful signin
        setTimeout(() => {
          console.log('🎯 Calling onAuthSuccess from signin');
          onAuthSuccess?.();
        }, 1000);
      } else {
        const errorData = await signinRes.json().catch(() => ({}));
        throw new Error(errorData.error || "Signin failed");
      }
    } catch (err) {
      setLocalError(err.message || "Signin failed");
    } finally {
      setIsLoading(false);
    }
  };

  const resetAuth = () => {
    setAuthMode(null);
    setFormData({ username: "", email: "", referralCode: "" });
    clearError();
    setSuccess("");
    setIsLoading(false);
  };

  // ✅ Initial choice screen
  if (!authMode) {
    return (
      <div className={styles.authOverlay}>
        <div className={styles.authModal}>
          <div className={styles.authHeader}>
            <div className={styles.headerContent}>
              <div className={styles.logoSection}>
                <div className={styles.logoIcon}>
                  <Sparkles size={24} />
                </div>
                <h2>Welcome to GainVault</h2>
              </div>
              <button className={styles.closeButton} onClick={onClose}>
                <span>×</span>
              </button>
            </div>
          </div>
          
          <div className={styles.authContent}>
            <div className={styles.choiceSection}>
              <div className={styles.welcomeText}>
                <h3>Choose your journey</h3>
                <p>Join thousands of traders unlocking their potential</p>
              </div>
              
              <div className={styles.choiceButtons}>
                <button
                  className={styles.choiceButton}
                  onClick={() => setAuthMode("signup")}
                >
                  <div className={styles.buttonIcon}>
                    <User size={24} />
                  </div>
                  <div className={styles.buttonContent}>
                    <h4>Create New Account</h4>
                    <p>Start your trading journey today</p>
                  </div>
                  <ArrowRight size={20} className={styles.arrowIcon} />
                </button>
                
                <button
                  className={styles.choiceButton}
                  onClick={() => setAuthMode("signin")}
                >
                  <div className={styles.buttonIcon}>
                    <Wallet size={24} />
                  </div>
                  <div className={styles.buttonContent}>
                    <h4>Sign In with Wallet</h4>
                    <p>Welcome back to your account</p>
                  </div>
                  <ArrowRight size={20} className={styles.arrowIcon} />
                </button>
              </div>

              <div className={styles.features}>
                <div className={styles.feature}>
                  <Shield size={16} />
                  <span>Secure wallet authentication</span>
                </div>
                <div className={styles.feature}>
                  <Sparkles size={16} />
                  <span>Instant account access</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Wallet connection step
  if (!connected) {
    return (
      <div className={styles.authOverlay}>
        <div className={styles.authModal}>
          <div className={styles.authHeader}>
            <div className={styles.headerContent}>
              <div className={styles.logoSection}>
                <div className={styles.logoIcon}>
                  <Wallet size={24} />
                </div>
                <h2>
                  {authMode === "signup" ? "Create Account" : "Sign In"}
                </h2>
              </div>
              <div className={styles.headerActions}>
                <button className={styles.backButton} onClick={resetAuth}>
                  <span>←</span>
                  <span>Back</span>
                </button>
                <button className={styles.closeButton} onClick={onClose}>
                  <span>×</span>
                </button>
              </div>
            </div>
          </div>
          
          <div className={styles.authContent}>
            <div className={styles.walletSection}>
              <div className={styles.walletHeader}>
                <h3>Connect Your Phantom Wallet</h3>
                <p>Secure authentication with your Solana wallet</p>
              </div>
              
              {!isPhantomInstalled ? (
                <div className={styles.walletPrompt}>
                  <AlertCircle size={24} />
                  <div className={styles.promptContent}>
                    <h4>Phantom wallet not detected</h4>
                    <p>Install Phantom to continue with secure authentication</p>
                  </div>
                  <button
                    className={styles.installButton}
                    onClick={() => window.open("https://phantom.app/", "_blank")}
                  >
                    Install Phantom
                    <ArrowRight size={16} />
                  </button>
                </div>
              ) : (
                <div className={styles.connectSection}>
                  <div className={styles.walletInfo}>
                    <Wallet size={32} />
                    <h4>Ready to connect?</h4>
                    <p>Click below to securely connect your Phantom wallet</p>
                  </div>
                  <button
                    className={styles.connectButton}
                    onClick={connectWallet}
                    disabled={connecting || isLoading}
                  >
                    {connecting ? (
                      <>
                        <Loader2 size={20} className={styles.spinner} />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <Wallet size={20} />
                        Connect Phantom Wallet
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Success state
  if (success) {
    return (
      <div className={styles.authOverlay}>
        <div className={styles.authModal}>
          <div className={styles.authContent}>
            <div className={styles.successSection}>
              <div className={styles.successIcon}>
                <CheckCircle size={48} />
              </div>
              <h3>Success!</h3>
              <p>{success}</p>
              <div className={styles.successFeatures}>
                <div className={styles.feature}>
                  <Shield size={16} />
                  <span>Account secured</span>
                </div>
                <div className={styles.feature}>
                  <Sparkles size={16} />
                  <span>Ready to trade</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Signup form (after wallet connection)
  if (authMode === "signup") {
    return (
      <div className={styles.authOverlay}>
        <div className={styles.authModal}>
          <div className={styles.authHeader}>
            <div className={styles.headerContent}>
              <div className={styles.logoSection}>
                <div className={styles.logoIcon}>
                  <User size={24} />
                </div>
                <h2>Complete Your Profile</h2>
              </div>
              <div className={styles.headerActions}>
                <button className={styles.backButton} onClick={resetAuth}>
                  <span>←</span>
                  <span>Back</span>
                </button>
                <button className={styles.closeButton} onClick={onClose}>
                  <span>×</span>
                </button>
              </div>
            </div>
          </div>
          
          <div className={styles.authContent}>
            <form onSubmit={handleSignup} className={styles.authForm}>
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

              <div className={styles.formGroup}>
                <label>Referral Code (Optional)</label>
                <div className={styles.inputWrapper}>
                  <User size={18} />
                  <input
                    type="text"
                    value={formData.referralCode}
                    onChange={(e) => handleInputChange("referralCode", e.target.value)}
                    placeholder="Enter referral code if you have one"
                    disabled={isLoading}
                  />
                </div>
                <small className={styles.helpText}>
                  Enter a friend's referral code to earn rewards when they sign up
                </small>
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
                    <Loader2 size={18} className={styles.spinner} />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Signin (after wallet connection)
  if (authMode === "signin") {
    return (
      <div className={styles.authOverlay}>
        <div className={styles.authModal}>
          <div className={styles.authHeader}>
            <div className={styles.headerContent}>
              <div className={styles.logoSection}>
                <div className={styles.logoIcon}>
                  <Wallet size={24} />
                </div>
                <h2>Sign In</h2>
              </div>
              <div className={styles.headerActions}>
                <button className={styles.backButton} onClick={resetAuth}>
                  <span>←</span>
                  <span>Back</span>
                </button>
                <button className={styles.closeButton} onClick={onClose}>
                  <span>×</span>
                </button>
              </div>
            </div>
          </div>
          
          <div className={styles.authContent}>
            <div className={styles.signinSection}>
              <div className={styles.signinHeader}>
                <h3>Ready to sign in?</h3>
                <p>Click the button below to securely sign in with your connected wallet.</p>
              </div>
              
              {errorToShow && (
                <div className={styles.errorMessage}>
                  <AlertCircle size={16} />
                  {errorToShow}
                </div>
              )}

              <button
                className={styles.submitButton}
                onClick={handleSignin}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className={styles.spinner} />
                    Signing In...
                  </>
                ) : (
                  <>
                    Sign In with Wallet
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default AuthPage;
