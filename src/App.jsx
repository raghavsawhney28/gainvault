import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import HeroSection from './components/HeroSection/HeroSection';
import FeaturesSection from './components/FeaturesSection/FeaturesSection';
import PricingSection from './components/PricingSection/PricingSection';
import Footer from './components/Footer/Footer';
import TradingChallenge from './pages/TradingChallenge/TradingChallenge';
import Rules from './pages/Rules/Rules';
import Referral from './pages/Referral/Referral';
import AuthPage from './components/AuthPage/AuthPage';
import useAuth from './hooks/useAuth';
import './App.css';

function App() {
  const { isLoggedIn, user, logout, checkAuthStatus, forceRefreshAuth } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Check auth status when component mounts
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);

  const handleAuthSuccess = () => {
    console.log('🎉 Auth success callback triggered');
    setShowAuthModal(false);
    // Force a re-check of auth status
    setTimeout(() => {
      console.log('🔄 Force refreshing auth after success');
      forceRefreshAuth();
    }, 100);
  };

  const handleLogout = () => {
    logout();
  };

  const openAuthModal = () => {
    setShowAuthModal(true);
  };

  const closeAuthModal = () => {
    setShowAuthModal(false);
  };

  console.log('🔍 App Component Debug:', { isLoggedIn, user, username: user?.username });

  return (
    <div className="App">
      <Header 
        isLoggedIn={isLoggedIn}
        username={user?.username}
        onAuthClick={openAuthModal}
        onLogout={handleLogout}
      />
      <Routes>
        <Route path="/" element={
          <main className="main-content">
            <HeroSection />
            <FeaturesSection />
            <PricingSection />
          </main>
        } />
        <Route path="/trading-challenge" element={<TradingChallenge />} />
        <Route path="/rules" element={<Rules />} />
        <Route path="/referral" element={<Referral />} />
      </Routes>
      <Footer />
      {showAuthModal && (
        <AuthPage 
          onAuthSuccess={handleAuthSuccess}
          onClose={closeAuthModal}
        />
      )}
    </div>
  );
}

export default App;