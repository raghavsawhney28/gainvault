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
        <Route path="/rules" element={<Rules />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;