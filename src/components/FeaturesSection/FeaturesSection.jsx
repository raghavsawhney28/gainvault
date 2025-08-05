import React from 'react';
import { TrendingUp, Zap, Shield, Globe, Cpu, Headphones } from 'lucide-react';
import AnimatedSection from '../AnimatedSection/AnimatedSection';
import styles from './FeaturesSection.module.css';

const FeaturesSection = () => {
  const features = [
    {
      icon: TrendingUp,
      title: 'Risk-Free Trading',
      description: 'Trade with our capital, not yours. Keep the profits while we handle the risk.'
    },
    {
      icon: Zap,
      title: 'Instant Funding',
      description: 'Get funded quickly and start trading altcoins with substantial capital backing.'
    },
    {
      icon: Shield,
      title: 'Secure Platform',
      description: 'Trade with confidence on our secure, regulated platform with full transparency.'
    },
    {
      icon: Globe,
      title: 'Altcoin Focus',
      description: 'Specialized in altcoin trading with access to emerging and established cryptocurrencies.'
    },
    {
      icon: Cpu,
      title: 'Smart Tools',
      description: 'Advanced trading tools and analytics designed specifically for crypto markets.'
    },
    {
      icon: Headphones,
      title: 'Community Support',
      description: 'Join a community of funded traders with 24/7 support and shared strategies.'
    }
  ];

  return (
    <section className={styles.featuresSection} id="features">
      <div className={styles.container}>
        <AnimatedSection className={styles.featuresHeader}>
          <h2>Why Choose GainVault?</h2>
          <p>We provide the capital, tools, and support you need to succeed in altcoin trading. Focus on what you do best - trading.</p>
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
          <button className={styles.btnOutline}>Start Your Journey</button>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default FeaturesSection;