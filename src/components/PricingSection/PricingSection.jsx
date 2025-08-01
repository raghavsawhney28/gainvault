import React from 'react';
import { Star } from 'lucide-react';
import AnimatedSection from '../AnimatedSection/AnimatedSection';
import styles from './PricingSection.module.css';

const PricingSection = () => {
  const plans = [
    {
      name: 'Starter',
      price: '$0',
      period: '/Forever Free',
      description: 'Perfect for beginners exploring trading',
      features: [
        'Basic trading tools',
        'Real-time market data',
        'Educational resources',
        'Community support',
        'Mobile app access'
      ],
      buttonText: 'Get Started',
      buttonClass: 'btnSecondary'
    },
    {
      name: 'Professional',
      price: '$49',
      period: '/per month',
      description: 'Advanced tools for serious traders',
      popular: true,
      features: [
        'Advanced charting tools',
        'AI-powered analytics',
        'Priority customer support',
        'Advanced order types',
        'Risk management tools',
        'API access',
        'Custom indicators'
      ],
      buttonText: 'Start Free Trial',
      buttonClass: 'btnPrimary'
    },
    {
      name: 'Enterprise',
      price: '$199',
      period: '/per month',
      description: 'Institutional-grade trading platform',
      features: [
        'Everything in Professional',
        'Dedicated account manager',
        'Custom integrations',
        'White-label solutions',
        'Advanced security features',
        'SLA guarantee',
        'Custom reporting'
      ],
      buttonText: 'Contact Sales',
      buttonClass: 'btnOutline'
    }
  ];

  return (
    <section className={styles.pricingSection} id="pricing">
      <div className={styles.container}>
        <AnimatedSection className={styles.pricingHeader}>
          <h2>Choose Your Trading Plan</h2>
          <p>Start with our free plan and upgrade as you grow. All plans include our core trading features with varying levels of advanced tools.</p>
        </AnimatedSection>

        <div className={styles.pricingGrid}>
          {plans.map((plan, index) => (
            <AnimatedSection key={index} delay={index * 100} className={`${styles.pricingCard} ${plan.popular ? styles.popular : ''}`}>
              {plan.popular && (
                <div className={styles.popularBadge}>
                  <Star size={14} /> Most Popular
                </div>
              )}
              <div className={styles.planHeader}>
                <h3>{plan.name}</h3>
                <div className={styles.planPrice}>
                  <span className={styles.price}>{plan.price}</span>
                  <span className={styles.period}>{plan.period}</span>
                </div>
                <p className={styles.planDescription}>{plan.description}</p>
              </div>
              <ul className={styles.featuresList}>
                {plan.features.map((feature, idx) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>
              <button className={`${styles.btnFull} ${styles[plan.buttonClass]}`}>
                {plan.buttonText}
              </button>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection className={styles.pricingGuarantee}>
          <p>All plans include SSL encryption, 99.9% uptime guarantee, and 24/7 customer support.</p>
          <div className={styles.guaranteeBadge}>30-day money-back guarantee</div>
        </AnimatedSection>
      </div>
    </section>
  );
};

export default PricingSection;