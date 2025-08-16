import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import HeroSection from './components/HeroSection/HeroSection';
import StatsSection from './components/StatsSection/StatsSection';
import FeaturesSection from './components/FeaturesSection/FeaturesSection';
import PricingSection from './components/PricingSection/PricingSection';
import Footer from './components/Footer/Footer';
import TradingChallenge from './pages/TradingChallenge/TradingChallenge';
import Rules from './pages/Rules/Rules';
import AuthPage from './components/AuthPage/AuthPage';
import useAuth from './hooks/useAuth';
import './App.css';

function App() {
  const { isLoggedIn, user, logout } = useAuth();
  const [showAuthModal, setShowAuthModal] = React.useState(false);

  const handleAuthSuccess = (user) => {
    setShowAuthModal(false);
    // The auth state should already be updated by the useAuth hook
    // No need to call checkAuthStatus again
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
          <main>
            <HeroSection />
            <StatsSection />
            <FeaturesSection />
            <PricingSection />
          </main>
        } />
        <Route path="/trading-challenge" element={<TradingChallenge />} />
        <Route path="/rules" element={<Rules />} />
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