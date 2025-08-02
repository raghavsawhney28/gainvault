import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import HeroSection from './components/HeroSection/HeroSection';
import StatsSection from './components/StatsSection/StatsSection';
import FeaturesSection from './components/FeaturesSection/FeaturesSection';
import PricingSection from './components/PricingSection/PricingSection';
import Footer from './components/Footer/Footer';
import TradingChallenge from './pages/TradingChallenge/TradingChallenge';
import './App.css';

function App() {
  return (
    <div className="App">
      <Header />
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
      </Routes>
      <Footer />
    </div>
  );
}

export default App;