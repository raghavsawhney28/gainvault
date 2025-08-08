import React, { useState } from 'react';
import { User, Lock, Wallet, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';
import usePhantomWallet from '../../hooks/usePhantomWallet';
import styles from './AuthPage.module.css';

const AuthPage = ({ onAuthSuccess, onClose }) => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const {
    connected,
    connecting,
    publicKey,
    connectWallet,
    formatAddress,
    isPhantomInstalled
  } = usePhantomWallet();

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.username.trim()) {
      setError('Username is required');
      return false;
    }
    if (formData.username.length < 3) {
      setError('Username must be at least 3 characters long');
      return false;
    }
    if (!formData.password) {
      setError('Password is required');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    if (isSignUp) {
      if (!connected || !publicKey) {
        setError('Please connect your Phantom wallet first');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
    }
    return true;
  };

  const simulateApiCall = (endpoint, data) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (endpoint === 'signup') {
          // Simulate existing username check
          if (data.username.toLowerCase() === 'admin') {
            reject(new Error('Username already exists'));
            return;
          }
          resolve({ success: true, message: 'Account created successfully' });
        } else if (endpoint === 'signin') {
          // Simulate authentication
          const validUsers = ['testuser', 'demo', 'trader'];
          if (validUsers.includes(data.username.toLowerCase()) && data.password === 'password123') {
            resolve({ 
              success: true, 
              user: { username: data.username, walletAddress: publicKey?.toString() }
            });
          } else {
            reject(new Error('Invalid username or password'));
          }
        }
      }, 1500);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      if (isSignUp) {
        const response = await simulateApiCall('signup', {
          username: formData.username,
          password: formData.password,
          walletAddress: publicKey.toString()
        });
        
        setSuccess(response.message);
        setTimeout(() => {
          setIsSignUp(false);
          setFormData({ username: '', password: '', confirmPassword: '' });
          setSuccess('');
        }, 2000);
      } else {
        const response = await simulateApiCall('signin', {
          username: formData.username,
          password: formData.password
        });
        
        onAuthSuccess(response.user);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
    setFormData({ username: '', password: '', confirmPassword: '' });
    setError('');
    setSuccess('');
  };

  return (
    <div className={styles.authOverlay}>
      <div className={styles.authModal}>
        <div className={styles.authHeader}>
          <h2>{isSignUp ? 'Create Account' : 'Sign In'}</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>

        <div className={styles.authContent}>
          {isSignUp && (
            <div className={styles.walletSection}>
              <h3>Connect Wallet</h3>
              {!isPhantomInstalled ? (
                <div className={styles.walletPrompt}>
                  <AlertCircle size={20} />
                  <span>Phantom wallet not detected</span>
                  <button 
                    className={styles.installButton}
                    onClick={() => window.open('https://phantom.app/', '_blank')}
                  >
                    Install Phantom
                  </button>
                </div>
              ) : connected ? (
                <div className={styles.walletConnected}>
                  <CheckCircle size={20} />
                  <span>Connected: {formatAddress(publicKey)}</span>
                </div>
              ) : (
                <button 
                  className={styles.connectButton}
                  onClick={connectWallet}
                  disabled={connecting}
                >
                  <Wallet size={16} />
                  {connecting ? 'Connecting...' : 'Connect Phantom Wallet'}
                </button>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.authForm}>
            <div className={styles.formGroup}>
              <label>Username</label>
              <div className={styles.inputWrapper}>
                <User size={18} />
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  placeholder="Enter your username"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Password</label>
              <div className={styles.inputWrapper}>
                <Lock size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className={styles.eyeButton}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {isSignUp && (
              <div className={styles.formGroup}>
                <label>Confirm Password</label>
                <div className={styles.inputWrapper}>
                  <Lock size={18} />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    placeholder="Confirm your password"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className={styles.eyeButton}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div className={styles.errorMessage}>
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            {success && (
              <div className={styles.successMessage}>
                <CheckCircle size={16} />
                {success}
              </div>
            )}

            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={isLoading || (isSignUp && !connected)}
            >
              {isLoading ? (
                <>
                  <div className={styles.spinner}></div>
                  {isSignUp ? 'Creating Account...' : 'Signing In...'}
                </>
              ) : (
                isSignUp ? 'Create Account' : 'Sign In'
              )}
            </button>
          </form>

          <div className={styles.authToggle}>
            <span>
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            </span>
            <button onClick={toggleAuthMode} disabled={isLoading}>
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </div>

          {!isSignUp && (
            <div className={styles.demoCredentials}>
              <h4>Demo Credentials:</h4>
              <p>Username: <code>testuser</code> | Password: <code>password123</code></p>
              <p>Username: <code>demo</code> | Password: <code>password123</code></p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;