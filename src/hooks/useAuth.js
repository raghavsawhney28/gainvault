import { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';

const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Run auth check when mounted
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // ✅ Check if user is authenticated
  const checkAuthStatus = useCallback(async () => {
    try {
      console.log('🔍 Checking auth status...');
      const token = localStorage.getItem('auth_token');
      const storedUser = localStorage.getItem('auth_user');

      if (!token) {
        console.log('❌ No token found');
        setIsLoggedIn(false);
        setUser(null);
        setLoading(false);
        return;
      }

      if (storedUser) {
        const userData = JSON.parse(storedUser);
        console.log('✅ Found stored user:', userData);
        setUser(userData);
        setIsLoggedIn(true);
        setLoading(false);
        return;
      }

      // fallback: verify with backend
      console.log('🔄 Verifying with backend...');
      const response = await api.get('/auth/me');
      if (response.data.success) {
        console.log('✅ Backend verification successful:', response.data.user);
        setIsLoggedIn(true);
        setUser(response.data.user);
        localStorage.setItem('auth_user', JSON.stringify(response.data.user));
      } else {
        console.log('❌ Backend verification failed');
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        setIsLoggedIn(false);
        setUser(null);
      }
    } catch (error) {
      console.error('🔍 Auth check failed:', error);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      setIsLoggedIn(false);
      setUser(null);
      setError('Session expired. Please log in again.');
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Force refresh auth status
  const forceRefreshAuth = useCallback(async () => {
    console.log('🔄 Force refreshing auth status...');
    setLoading(true);
    await checkAuthStatus();
  }, [checkAuthStatus]);

  // Deprecated signup
  const signup = async () => {
    console.warn('Signup function is deprecated. Use wallet-based signup instead.');
    throw new Error('Please use wallet-based signup');
  };

  // ✅ Signin (Phantom OR normal)
  const signin = async (credentials) => {
    try {
      setError(null);

      // Phantom login
      if (credentials.phantom) {
        const { token, user: userData } = credentials;

        if (token) {
          localStorage.setItem('auth_token', token);
        }

        if (userData) {
          localStorage.setItem('auth_user', JSON.stringify(userData));
          setIsLoggedIn(true);
          setUser(userData);
          console.log('✅ Phantom signin successful:', userData);
          return { success: true, user: userData };
        }

        // fallback: fetch from backend
        try {
          const response = await api.get('/auth/me');
          if (response.data.success) {
            setUser(response.data.user);
            localStorage.setItem('auth_user', JSON.stringify(response.data.user));
            setIsLoggedIn(true);
            console.log('✅ Backend user fetch successful:', response.data.user);
            return { success: true, user: response.data.user };
          }
        } catch (error) {
          console.error('Failed to fetch user data:', error);
          const defaultUser = { username: 'Trader', walletAddress: 'Connected' };
          setUser(defaultUser);
          localStorage.setItem('auth_user', JSON.stringify(defaultUser));
          setIsLoggedIn(true);
          console.log('✅ Using default user:', defaultUser);
          return { success: true, user: defaultUser };
        }

        return { success: true };
      }

      // Normal email/password login
      const response = await api.post('/auth/signin', credentials);
      if (response.data.success) {
        const { token, user } = response.data;
        if (token) localStorage.setItem('auth_token', token);
        if (user) localStorage.setItem('auth_user', JSON.stringify(user));
        setIsLoggedIn(true);
        setUser(user);
        console.log('✅ Normal signin successful:', user);
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

  const login = signin; // alias

  // ✅ Clean logout
  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout'); // optional
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      setIsLoggedIn(false);
      setUser(null);
      setError(null);
    }
  }, []);

  const clearError = () => setError(null);

  return {
    isLoggedIn,
    user,
    loading,
    error,
    signup,
    signin,
    login,
    logout,
    clearError,
    checkAuthStatus,
    forceRefreshAuth,
  };
};

export default useAuth;
