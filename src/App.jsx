import React from 'react';
import Header from './components/Header/Header';
import HeroSection from './components/HeroSection/HeroSection';
import StatsSection from './components/StatsSection/StatsSection';
import FeaturesSection from './components/FeaturesSection/FeaturesSection';
import PricingSection from './components/PricingSection/PricingSection';
import Footer from './components/Footer/Footer';
import './App.css';

function App() {
  return (
    <div className="App">
      <Header />
      <main>
        <HeroSection />
        <StatsSection />
        <FeaturesSection />
        <PricingSection />
      </main>
      <Footer />
    </div>
  );
}

export default App;