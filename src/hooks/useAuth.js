import { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';

const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is authenticated on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      console.log('🔍 Checking auth status...');
      const token = localStorage.getItem('auth_token');
      console.log('🔍 Token found:', !!token);
      
      if (!token) {
        console.log('🔍 No token found, setting loading to false');
        setLoading(false);
        return;
      }

      const response = await api.get('/auth/me');
      console.log('🔍 Auth check response:', response.data);
      
      if (response.data.success) {
        console.log('🔍 Setting user as logged in:', response.data.user);
        setIsLoggedIn(true);
        setUser(response.data.user);
      } else {
        console.log('🔍 Auth check failed, removing token');
        localStorage.removeItem('auth_token');
      }
    } catch (error) {
      console.error('🔍 Auth check failed:', error);
      localStorage.removeItem('auth_token');
      setError('Session expired. Please log in again.');
    } finally {
      setLoading(false);
      console.log('🔍 Auth check completed, loading set to false');
    }
  };

  // Note: Signup is now handled directly in the AuthPage component
  // This function is kept for backward compatibility but not used
  const signup = async (userData) => {
    console.warn('Signup function is deprecated. Use wallet-based signup instead.');
    throw new Error('Please use wallet-based signup');
  };

  const signin = async (credentials) => {
  try {
    setError(null);
    console.log('🔐 useAuth signin called with:', credentials);

    // If phantom login, credentials will have { token, phantom: true, user? }
    if (credentials.phantom) {
      console.log('🔐 Phantom authentication detected');
      const { token, user: userData } = credentials;
      if (token) {
        localStorage.setItem('auth_token', token);
        console.log('🔐 Token stored in localStorage');
      }
      setIsLoggedIn(true);
      console.log('🔐 isLoggedIn set to true');
      
      // If user data is provided, use it directly
      if (userData) {
        setUser(userData);
        console.log('🔐 User data set directly:', userData);
        return { success: true, user: userData };
      }
      
      // Otherwise, fetch user data from the token
      try {
        const response = await api.get('/auth/me');
        if (response.data.success) {
          setUser(response.data.user);
          console.log('🔐 User data fetched and set:', response.data.user);
          return { success: true, user: response.data.user };
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        // Even if fetching user data fails, we're still logged in
        // Set a default user object with wallet address
        const defaultUser = { username: 'Trader', walletAddress: 'Connected' };
        setUser(defaultUser);
        console.log('🔐 Default user set:', defaultUser);
        return { success: true, user: defaultUser };
      }
      
      return { success: true };
    }

    // Normal email/password signin
    const response = await api.post('/auth/signin', credentials);

    if (response.data.success) {
      const { token, user } = response.data;

      if (token) {
        localStorage.setItem('auth_token', token);
      }

      setIsLoggedIn(true);
      setUser(user);

      return { success: true, user };
    } else {
      throw new Error(response.data.error || 'Login failed');
    }
  } catch (error) {
    const errorMessage = error.response?.data?.error || error.message || 'Login failed';
    setError(errorMessage);
    throw new Error(errorMessage);
  }
};


  // Alias for compatibility
  const login = signin;

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout'); // optional
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      localStorage.removeItem('auth_token');
      setIsLoggedIn(false);
      setUser(null);
      setError(null);
    }
  }, []);

  const clearError = () => {
    setError(null);
  };

  return {
    isLoggedIn,
    user,
    loading,
    error,
    signup,
    signin,
    login, // alias so old code works
    logout,
    clearError,
    checkAuthStatus
  };
};

export default useAuth;
