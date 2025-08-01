import React from 'react';
import { TrendingUp, Zap, Shield, Globe, Cpu, Headphones } from 'lucide-react';
import AnimatedSection from '../AnimatedSection/AnimatedSection';
import styles from './FeaturesSection.module.css';

const FeaturesSection = () => {
  const features = [
    {
      icon: TrendingUp,
      title: 'Advanced Analytics',
      description: 'Real-time market analysis with AI-powered insights and predictive modeling.'
    },
    {
      icon: Zap,
      title: 'Lightning Execution',
      description: 'Ultra-low latency trading with sub-millisecond order execution.'
    },
    {
      icon: Shield,
      title: 'Bank-Grade Security',
      description: 'Multi-layer security protocols and encrypted data transmission.'
    },
    {
      icon: Globe,
      title: 'Global Markets',
      description: 'Access to 150+ markets worldwide including forex, stocks, and crypto.'
    },
    {
      icon: Cpu,
      title: 'AI Trading Bots',
      description: 'Automated trading strategies powered by machine learning algorithms.'
    },
    {
      icon: Headphones,
      title: '24/7 Support',
      description: 'Round-the-clock market access with real-time support.'
    }
  ];

  return (
    <section className={styles.featuresSection} id="features">
      <div className={styles.container}>
        <AnimatedSection className={styles.featuresHeader}>
          <h2>Professional Trading Made Simple</h2>
          <p>Experience the power of institutional-grade trading tools designed for both beginners and professional traders.</p>
        </AnimatedSection>
        
        <div className={styles.featuresGrid}>
          {features.map((feature, index) => (
            <AnimatedSection key={index} delay={index * 100} className={styles.featureCard}>
              <feature.icon className={styles.featureIcon} size={32} />
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection className={styles.featuresCta}>
          <button className={styles.btnOutline}>Explore All Features</button>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default FeaturesSection;