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
  const [hasAttemptedAuth, setHasAttemptedAuth] = useState(false);
  const [signupContext, setSignupContext] = useState(null); // store data from failed signin
  const [localError, setLocalError] = useState("");

  const {
    connected,
    connecting,
    publicKey,
    connectWallet,
    handleSignup,
    isPhantomInstalled,
  } = usePhantomWallet();

  const { error, clearError, isLoggedIn, signin } = useAuth();
  
  // Use local error state for form validation
  const setError = (message) => setLocalError(message);
  const errorToShow = localError || error;

  // ✅ Auto-close modal once logged in
  useEffect(() => {
    console.log("🔹 Auth state changed - isLoggedIn:", isLoggedIn);
    if (isLoggedIn) {
      console.log("🔹 User is logged in, closing modal...");
      onAuthSuccess?.();
    }
  }, [isLoggedIn, onAuthSuccess]);

  // ✅ Wallet connect triggers auto-login attempt
  useEffect(() => {
    console.log("🔗 useEffect triggered - connected:", connected, "publicKey:", publicKey, "isLoading:", isLoading, "hasAttemptedAuth:", hasAttemptedAuth, "isLoggedIn:", isLoggedIn);
    
    // Don't start auth flow if user is already logged in
    if (isLoggedIn) {
      console.log("🔗 User already logged in, skipping auth flow");
      return;
    }
    
    if (connected && publicKey && !isLoading && !hasAttemptedAuth) {
      console.log("🔗 Starting authentication flow...");
      setHasAttemptedAuth(true);
      handleWalletAuth();
    }
  }, [connected, publicKey, isLoading, hasAttemptedAuth, isLoggedIn]);

  const handleWalletAuth = async () => {
    try {
      console.log("🔗 Starting wallet authentication...");
      setIsLoading(true);
      clearError();
      
      // Get nonce from backend
      console.log("🔗 Fetching nonce...");
      const nonceRes = await fetch(`https://gainvault.onrender.com/api/auth/nonce/${publicKey.toString()}`);
      const { nonce } = await nonceRes.json();
      console.log("🔗 Nonce received:", nonce);
      
      const message = `Sign this message to authenticate with GainVault.\n\nNonce: ${nonce}`;
      const encodedMessage = new TextEncoder().encode(message);

      // User signs the message
      console.log("🔗 Requesting message signature...");
      const provider = window.phantom?.solana;
      
      if (!provider) {
        throw new Error("Phantom provider not found");
      }
      
      // Request message signature with proper parameters
      const signedMessage = await provider.signMessage(encodedMessage, "utf8");
      console.log("🔗 Raw signed message:", signedMessage);
      
      if (!signedMessage || !signedMessage.signature) {
        throw new Error("Message signing failed - no signature received");
      }
      
      const base64Signature = Buffer.from(signedMessage.signature).toString("base64");
      console.log("🔗 Message signed successfully, signature:", base64Signature);

      // Store signup context for later use
      setSignupContext({ nonce, message, signature: base64Signature });

      // Try to sign in first (for existing users)
      console.log("🔗 Attempting sign in...");
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
          console.log("🔗 Sign in successful, user:", user);
          
          // Update the global auth state
          await signin({ token, user, phantom: true });
          
          setSuccess("Welcome back! You're now signed in.");
          setAuthStep("success");
          setTimeout(() => {
            onAuthSuccess?.();
          }, 2000);
          return;
        } else {
          console.log("🔗 Sign in failed with status:", signinRes.status);
          const errorData = await signinRes.json().catch(() => ({}));
          console.log("🔗 Sign in error data:", errorData);
        }
      } catch (signinError) {
        console.log("🔗 Sign in error:", signinError);
      }

      // If sign in fails, user needs to sign up
      console.log("🔗 User needs to sign up, switching to signup step");
      setAuthStep("signup");
      
    } catch (error) {
      console.error("❌ Wallet auth failed:", error);
      setError("Authentication failed. Please try again.");
    } finally {
      setIsLoading(false);
      console.log("🔗 Wallet auth completed");
    }
  };

  const handleInputChange = (field, value) => {
    console.log(`🔹 Input change - ${field}:`, value);
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

  const handleFormSignup = async (e) => {
    e.preventDefault();
    console.log("🔹 Form submission started");
    console.log("🔹 Form data:", formData);
    
    if (!validateForm()) {
      console.log("❌ Form validation failed");
      return;
    }
    console.log("✅ Form validation passed");

    setIsLoading(true);
    setSuccess("");
    clearError();

    try {
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

  const toggleAuthMode = () => {
    console.log("🔄 Toggling auth mode...");
    setFormData({ username: "", email: "" });
    clearError();
    setSuccess("");
    setAuthStep("connect");
    setHasAttemptedAuth(false);
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
                onClick={async () => {
                  console.log("🔗 Connect wallet button clicked");
                  console.log("🔗 Current state - connected:", connected, "connecting:", connecting, "publicKey:", publicKey);
                  try {
                    await connectWallet();
                    console.log("🔗 Connect wallet completed");
                  } catch (error) {
                    console.error("❌ Connect wallet error:", error);
                  }
                }}
                disabled={connecting || isLoading}
              >
                <Wallet size={16} />
                {connecting ? "Connecting..." : "Connect Phantom Wallet"}
              </button>
            )}
          </div>
        );

      case "signup":
        console.log("🔹 Rendering signup form");
        console.log("🔹 Form data:", formData);
        console.log("🔹 Error state:", errorToShow);
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
              onClick={() => console.log("🔹 Submit button clicked")}
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
            
            {/* Debug button */}
            <button
              type="button"
              onClick={() => {
                console.log("🔹 Debug button clicked");
                console.log("🔹 Current form data:", formData);
                console.log("🔹 Current error:", errorToShow);
                console.log("🔹 Current loading state:", isLoading);
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
              Debug Form State
            </button>
            
            {/* Test message signing button */}
            <button
              type="button"
              onClick={async () => {
                console.log("🔐 Testing message signing...");
                try {
                  const provider = window.phantom?.solana;
                  if (!provider) {
                    console.log("❌ Phantom provider not found");
                    return;
                  }
                  
                  const testMessage = "Test message for GainVault";
                  const encodedMessage = new TextEncoder().encode(testMessage);
                  
                  console.log("🔐 Requesting test signature...");
                  const signedMessage = await provider.signMessage(encodedMessage, "utf8");
                  console.log("🔐 Test signature result:", signedMessage);
                  
                  if (signedMessage && signedMessage.signature) {
                    console.log("✅ Test message signing successful!");
                  } else {
                    console.log("❌ Test message signing failed");
                  }
                } catch (error) {
                  console.error("❌ Test message signing error:", error);
                }
              }}
              style={{
                backgroundColor: '#4A90E2',
                color: 'white',
                padding: '8px 16px',
                border: 'none',
                borderRadius: '4px',
                fontSize: '14px',
                marginTop: '8px',
                cursor: 'pointer'
              }}
            >
              Test Message Signing
            </button>
            
            {/* Manual sign-in test button */}
            <button
              type="button"
              onClick={async () => {
                console.log("🔐 Testing manual sign-in...");
                try {
                  const testUser = { username: "TestUser", email: "test@example.com" };
                  const testToken = "test_token_123";
                  
                  console.log("🔐 Calling signin with test data...");
                  await signin({ token: testToken, user: testUser, phantom: true });
                  console.log("✅ Manual sign-in test completed!");
                } catch (error) {
                  console.error("❌ Manual sign-in test error:", error);
                }
              }}
              style={{
                backgroundColor: '#9B59B6',
                color: 'white',
                padding: '8px 16px',
                border: 'none',
                borderRadius: '4px',
                fontSize: '14px',
                marginTop: '8px',
                cursor: 'pointer'
              }}
            >
              Test Manual Sign-In
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
          {authStep !== "connect" && (
            <button 
              className={styles.resetButton} 
              onClick={() => {
                console.log("🔄 Resetting auth state...");
                setAuthStep("connect");
                setIsLoading(false);
                setSuccess("");
                clearError();
                setLocalError("");
                setHasAttemptedAuth(false);
              }}
              style={{
                backgroundColor: '#FF6B6B',
                color: 'white',
                padding: '8px 16px',
                border: 'none',
                borderRadius: '4px',
                fontSize: '14px',
                marginRight: '40px',
                cursor: 'pointer'
              }}
            >
              Reset
            </button>
          )}
        </div>

        <div className={styles.authContent}>{renderContent()}</div>
      </div>
    </div>
  );
};

export default AuthPage;
