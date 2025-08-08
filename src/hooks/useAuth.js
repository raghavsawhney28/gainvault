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
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setLoading(false);
        return;
      }

      // Verify token with backend
      const response = await api.get('/auth/me');
      if (response.data.success) {
        setIsLoggedIn(true);
        setUser(response.data.user);
      } else {
        // Invalid token
        localStorage.removeItem('auth_token');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('auth_token');
      setError('Session expired. Please log in again.');
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData) => {
    try {
      setError(null);
      const response = await api.post('/auth/signup', userData);
      
      if (response.data.success) {
        return { success: true, message: response.data.message };
      } else {
        throw new Error(response.data.error || 'Signup failed');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Signup failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const signin = async (credentials) => {
    try {
      setError(null);
      const response = await api.post('/auth/signin', credentials);
      
      if (response.data.success) {
        const { token, user } = response.data;
        
        // Store token
        localStorage.setItem('auth_token', token);
        
        // Update state
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

  const logout = useCallback(async () => {
    try {
      // Call logout endpoint (optional)
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      // Clear local state regardless of API call result
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
    logout,
    clearError,
    checkAuthStatus
  };
};

export default useAuth;