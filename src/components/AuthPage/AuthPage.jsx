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
  const [authMode, setAuthMode] = useState(null); // "signup" or "signin"
  const [formData, setFormData] = useState({ username: "", email: "" });
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
      console.log("🔐 Getting nonce for signup wallet:", publicKey);
      const nonceRes = await fetch(`https://gainvault.onrender.com/api/auth/nonce/${publicKey.toString()}`);
      
      if (!nonceRes.ok) {
        throw new Error(`Failed to get nonce: ${nonceRes.status}`);
      }
      
      const { nonce } = await nonceRes.json();
      console.log("🔐 Received nonce for signup:", nonce);
      
      const message = `Sign this message to create your GainVault account.\n\nNonce: ${nonce}`;
      console.log("🔐 Signup message to sign:", message);
      const encodedMessage = new TextEncoder().encode(message);

      // User signs the message
      const provider = window.phantom?.solana;
      if (!provider) {
        throw new Error("Phantom provider not found");
      }
      
      console.log("🔐 Requesting signature for signup...");
      const signedMessage = await provider.signMessage(encodedMessage, "utf8");
      console.log("🔐 Raw signup signed message:", signedMessage);
      
      if (!signedMessage || !signedMessage.signature) {
        throw new Error("Message signing failed");
      }
      
      // Convert signature to base64 using browser-compatible method
      const signatureArray = Array.from(signedMessage.signature);
      const base64Signature = btoa(String.fromCharCode(...signatureArray));
      console.log("🔐 Signup signature converted to base64:", base64Signature.substring(0, 50) + "...");

      // Send signup request
      const signupData = {
        publicKey: publicKey.toString(),
        signature: base64Signature,
        message,
        username: formData.username.trim(),
        email: formData.email.trim(),
      };
      console.log("🔐 Sending signup request with data:", signupData);

      const signupRes = await fetch("https://gainvault.onrender.com/api/auth/phantom-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupData),
      });

      console.log("🔐 Signup response status:", signupRes.status);
      
      if (signupRes.ok) {
        const { token, user } = await signupRes.json();
        console.log("🔐 Signup successful, user:", user);
        
        // Store token and set user in state
        await signin({ token, user, phantom: true });
        
        setSuccess("Account created successfully! You're now signed in.");
        setTimeout(() => {
          onAuthSuccess?.();
        }, 1500);
      } else {
        const errorData = await signupRes.json().catch(() => ({}));
        console.error("🔐 Signup failed:", errorData);
        throw new Error(errorData.error || "Signup failed");
      }
    } catch (err) {
      console.error("🔐 Signup error:", err);
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
      console.log("🔐 Getting nonce for wallet:", publicKey);
      const nonceRes = await fetch(`https://gainvault.onrender.com/api/auth/nonce/${publicKey.toString()}`);
      
      if (!nonceRes.ok) {
        throw new Error(`Failed to get nonce: ${nonceRes.status}`);
      }
      
      const { nonce } = await nonceRes.json();
      console.log("🔐 Received nonce:", nonce);
      
      const message = `Sign this message to sign in to GainVault.\n\nNonce: ${nonce}`;
      console.log("🔐 Message to sign:", message);
      const encodedMessage = new TextEncoder().encode(message);

      // User signs the message
      const provider = window.phantom?.solana;
      if (!provider) {
        throw new Error("Phantom provider not found");
      }
      
      console.log("🔐 Requesting signature from wallet...");
      const signedMessage = await provider.signMessage(encodedMessage, "utf8");
      console.log("🔐 Raw signed message:", signedMessage);
      
      if (!signedMessage || !signedMessage.signature) {
        throw new Error("Message signing failed");
      }
      
      // Convert signature to base64 using browser-compatible method
      const signatureArray = Array.from(signedMessage.signature);
      const base64Signature = btoa(String.fromCharCode(...signatureArray));
      console.log("🔐 Signature converted to base64:", base64Signature.substring(0, 50) + "...");

      // Send signin request
      const signinData = {
        publicKey: publicKey.toString(),
        signature: base64Signature,
        message,
      };
      console.log("🔐 Sending signin request with data:", signinData);

      const signinRes = await fetch("https://gainvault.onrender.com/api/auth/phantom-signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signinData),
      });

      console.log("🔐 Signin response status:", signinRes.status);
      
      if (signinRes.ok) {
        const { token, user } = await signinRes.json();
        console.log("🔐 Signin successful, user:", user);
        
        // Store token and set user in state
        await signin({ token, user, phantom: true });
        
        setSuccess("Welcome back! You're now signed in.");
        setTimeout(() => {
          onAuthSuccess?.();
        }, 1500);
      } else {
        const errorData = await signinRes.json().catch(() => ({}));
        console.error("🔐 Signin failed:", errorData);
        throw new Error(errorData.error || "Signin failed");
      }
    } catch (err) {
      console.error("🔐 Signin error:", err);
      setLocalError(err.message || "Signin failed");
    } finally {
      setIsLoading(false);
    }
  };

  const resetAuth = () => {
    setAuthMode(null);
    setFormData({ username: "", email: "" });
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
            <h2>Welcome to GainVault</h2>
            <button className={styles.closeButton} onClick={onClose}>×</button>
          </div>
          
          <div className={styles.authContent}>
            <div className={styles.choiceSection}>
              <h3>Choose your option:</h3>
              
              <button
                className={styles.choiceButton}
                onClick={() => setAuthMode("signup")}
                style={{ backgroundColor: '#2DDA7D', color: 'white' }}
              >
                <User size={20} />
                Create New Account
              </button>
              
              <button
                className={styles.choiceButton}
                onClick={() => setAuthMode("signin")}
                style={{ backgroundColor: '#4A90E2', color: 'white' }}
              >
                <Wallet size={20} />
                Sign In with Wallet
              </button>
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
            <h2>
              {authMode === "signup" ? "Create Account" : "Sign In"}
            </h2>
            <button className={styles.closeButton} onClick={onClose}>×</button>
            <button className={styles.backButton} onClick={resetAuth}>← Back</button>
          </div>
          
          <div className={styles.authContent}>
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
              <CheckCircle size={48} className={styles.successIcon} />
              <h3>Success!</h3>
              <p>{success}</p>
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
            <h2>Complete Your Profile</h2>
            <button className={styles.closeButton} onClick={onClose}>×</button>
            <button className={styles.backButton} onClick={resetAuth}>← Back</button>
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
                style={{ 
                  backgroundColor: '#2DDA7D', 
                  color: 'white', 
                  padding: '12px 24px',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? 0.6 : 1
                }}
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
            <h2>Sign In</h2>
            <button className={styles.closeButton} onClick={onClose}>×</button>
            <button className={styles.backButton} onClick={resetAuth}>← Back</button>
          </div>
          
          <div className={styles.authContent}>
            <div className={styles.signinSection}>
              <h3>Ready to sign in?</h3>
              <p>Click the button below to sign in with your connected wallet.</p>
              
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
                style={{ 
                  backgroundColor: '#4A90E2', 
                  color: 'white', 
                  padding: '12px 24px',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  opacity: isLoading ? 0.6 : 1
                }}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className={styles.spinner} />
                    Signing In...
                  </>
                ) : (
                  "Sign In with Wallet"
                )}
              </button>
            
            {/* Debug button */}
            <button
              type="button"
              onClick={async () => {
                if (!connected || !publicKey) {
                  setError("Please connect your Phantom wallet first");
                  return;
                }
                
                console.log("🔍 Testing debug endpoint...");
                try {
                  // Get nonce first
                  const nonceRes = await fetch(`https://gainvault.onrender.com/api/auth/nonce/${publicKey.toString()}`);
                  const { nonce } = await nonceRes.json();
                  
                  const message = `Sign this message to sign in to GainVault.\n\nNonce: ${nonce}`;
                  const encodedMessage = new TextEncoder().encode(message);
                  
                  const provider = window.phantom?.solana;
                  const signedMessage = await provider.signMessage(encodedMessage, "utf8");
                  const signatureArray = Array.from(signedMessage.signature);
                  const base64Signature = btoa(String.fromCharCode(...signatureArray));
                  
                  // Test debug endpoint
                  const debugRes = await fetch("https://gainvault.onrender.com/api/auth/debug-signin", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      publicKey: publicKey.toString(),
                      signature: base64Signature,
                      message,
                    }),
                  });
                  
                  const debugData = await debugRes.json();
                  console.log("🔍 Debug endpoint response:", debugData);
                  
                  if (debugRes.ok) {
                    setSuccess("Debug test passed! Check console for details.");
                  } else {
                    setLocalError(`Debug test failed: ${debugData.error}`);
                  }
                } catch (error) {
                  console.error("🔍 Debug test error:", error);
                  setLocalError(`Debug test error: ${error.message}`);
                }
              }}
              style={{
                backgroundColor: '#FF6B6B',
                color: 'white',
                padding: '8px 16px',
                border: 'none',
                borderRadius: '4px',
                fontSize: '14px',
                marginTop: '16px',
                cursor: 'pointer'
              }}
            >
              Debug Signin Test
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
