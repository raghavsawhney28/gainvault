import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { Routes, Route } from 'react-router-dom';
import { MantineProvider, createTheme } from '@mantine/core';
import '@mantine/core/styles.css';
import Header from './components/Header/Header';
import HeroSection from './components/HeroSection/HeroSection';
import FeaturesSection from './components/FeaturesSection/FeaturesSection';
import PricingSection from './components/PricingSection/PricingSection';
// import NewSection from './components/NewSection/NewSection';
import Footer from './components/Footer/Footer';
import TradingChallenge from './pages/TradingChallenge/TradingChallenge';
import Rules from './pages/Rules/Rules';
import Referral from './pages/Referral/Referral';
import Dashboard from './pages/Dashboard/Dashboard';
import AuthPage from './components/AuthPage/AuthPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import useAuth from './hooks/useAuth';
import { SmoothCursor } from './components/ui/smooth-cursor';
import Particles from './components/magicui/particles';
import ScrollToTop from './components/ScrollToTop';
import './App.css';

// Create a dark theme
const darkTheme = createTheme({
  colorScheme: 'dark',
  colors: {
    dark: [
      '#C1C2C5',
      '#A6A7AB',
      '#909296',
      '#5C5F66',
      '#373A40',
      '#2C2E33',
      '#25262B',
      '#1A1B1E',
      '#141517',
      '#101113',
    ],
  },
});

function App() {
  const { isLoggedIn, user, logout, checkAuthStatus, forceRefreshAuth } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Check auth status when component mounts
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  // Handle query parameter routing for deployed environments
  useEffect(() => {
    const handleQueryRouting = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const path = urlParams.get('');
      
      if (path && path !== '/') {
        // Remove the query parameter and update the URL
        const newUrl = window.location.origin + path;
        window.history.replaceState(null, null, newUrl);
      }
    };

    handleQueryRouting();
  }, []);

  const handleAuthSuccess = useCallback(() => {
    console.log('🎉 Auth success callback triggered');
    setShowAuthModal(false);
    // Force a re-check of auth status
    setTimeout(() => {
      console.log('🔄 Force refreshing auth after success');
      forceRefreshAuth();
    }, 100);
  }, [forceRefreshAuth]);

  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  const openAuthModal = useCallback(() => {
    setShowAuthModal(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setShowAuthModal(false);
  }, []);

  // Memoize user data to prevent unnecessary re-renders
  const userData = useMemo(() => ({
    isLoggedIn,
    username: user?.username
  }), [isLoggedIn, user?.username]);

  // Memoize main content to prevent unnecessary re-renders
  const mainContent = useMemo(() => (
    <main className="main-content cursor-none">
      <HeroSection className="cursor-none" />
      <FeaturesSection className="cursor-none" />
      <PricingSection className="cursor-none" />
      {/* <NewSection className="cursor-none" /> */}
    </main>
  ), []);

  console.log('🔍 App Component Debug:', { isLoggedIn, user, username: user?.username });

  return (
    <MantineProvider theme={darkTheme} defaultColorScheme="dark">
      <div className="App cursor-none">
        <SmoothCursor size="small" />
        {/* Particles background covering the entire body */}
        <Particles 
          quantity={150}
          staticity={60}
          ease={50}
          size={1.2}
          color="#00ff88"
          className="particles-background"
        />
        <Header 
          isLoggedIn={userData.isLoggedIn}
          username={userData.username}
          onAuthClick={openAuthModal}
          onLogout={handleLogout}
          className="cursor-none"
        />
        <ScrollToTop />
        <Routes>
          <Route path="/" element={mainContent} />
          <Route path="/trading-challenge" element={<TradingChallenge className="cursor-none" />} />
          <Route path="/rules" element={<Rules className="cursor-none" />} />
          <Route path="/referral" element={<Referral />} />
          <Route path="/dashboard/:username" element={<Dashboard className="cursor-none" />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="*" element={mainContent} />
        </Routes>
        {/* <BlankSection className="cursor-none" /> */}
        <Footer className="cursor-none" />
        {showAuthModal && (
          <AuthPage 
            onAuthSuccess={handleAuthSuccess}
            onClose={closeAuthModal}
            className="cursor-none"
          />
        )}
      </div>
    </MantineProvider>
  );
}

export default memo(App);