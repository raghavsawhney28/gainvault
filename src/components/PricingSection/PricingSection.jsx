import React, { useState } from 'react';
import { Star, TrendingUp, Clock, Target, AlertTriangle, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AnimatedSection from '../AnimatedSection/AnimatedSection';
import styles from './PricingSection.module.css';

const PricingSection = () => {
  const [selectedPlan, setSelectedPlan] = useState('SKILLED');
  const navigate = useNavigate();

  const challengePlans = [
    {
      name: "BASE",
      value: "$5,000",
      cost: 69,
      details: {
        profitTarget: ["10%", "5%"],
        maxDailyLoss: ["5%", "5%"],
        maxLoss: ["10%", "8%"],
        minTradingDays: ["5", "5"],
        tradingPeriod: ["Unlimited", "Unlimited"],
        maxLeverage: ["1:5", "1:5"],
      }
    },
    {
      name: "STARTER",
      value: "$10,000",
      tag: "BEST SELLER",
      cost: 129,
      details: {
        profitTarget: ["10%", "5%"],
        maxDailyLoss: ["5%", "5%"],
        maxLoss: ["10%", "8%"],
        minTradingDays: ["5", "5"],
        tradingPeriod: ["Unlimited", "Unlimited"],
        maxLeverage: ["1:5", "1:5"],
      }
    },
    {
      name: "SKILLED",
      value: "$15,000",
      tag: "NEW",
      cost: 179,
      isDefault: true,
      details: {
        profitTarget: ["10%", "5%"],
        maxDailyLoss: ["5%", "5%"],
        maxLoss: ["10%", "8%"],
        minTradingDays: ["5", "5"],
        tradingPeriod: ["Unlimited", "Unlimited"],
        maxLeverage: ["1:5", "1:5"],
      }
    },
    {
      name: "INTERMEDIATE",
      value: "$25,000",
      cost: 269,
      details: {
        profitTarget: ["10%", "5%"],
        maxDailyLoss: ["5%", "5%"],
        maxLoss: ["10%", "8%"],
        minTradingDays: ["5", "5"],
        tradingPeriod: ["Unlimited", "Unlimited"],
        maxLeverage: ["1:5", "1:5"],
      }
    },
    {
      name: "ADVANCED",
      value: "$50,000",
      cost: 549,
      details: {
        profitTarget: ["10%", "5%"],
        maxDailyLoss: ["5%", "5%"],
        maxLoss: ["10%", "8%"],
        minTradingDays: ["5", "5"],
        tradingPeriod: ["Unlimited", "Unlimited"],
        maxLeverage: ["1:5", "1:5"],
      }
    },
    {
      name: "EXPERT",
      value: "$100,000",
      tag: "POPULAR",
      cost: 1199,
      details: {
        profitTarget: ["10%", "5%"],
        maxDailyLoss: ["5%", "5%"],
        maxLoss: ["10%", "8%"],
        minTradingDays: ["5", "5"],
        tradingPeriod: ["Unlimited", "Unlimited"],
        maxLeverage: ["1:5", "1:5"],
      }
    }
  ];

  const selectedPlanData = challengePlans.find(plan => plan.name === selectedPlan);

  const handlePlanSelect = (planName) => {
    setSelectedPlan(planName);
  };

  const handleStartChallenge = () => {
    navigate('/trading-challenge');
  };

  return (
    <section className={styles.pricingSection} id="pricing">
      <div className={styles.container}>
        <AnimatedSection className={styles.pricingHeader}>
          <h2>CHALLENGE PLANS</h2>
        </AnimatedSection>

        {/* Challenge Plan Selection */}
        <div className={styles.planSelection}>
          {challengePlans.map((plan) => (
            <button
              key={plan.name}
              className={`${styles.planButton} ${selectedPlan === plan.name ? styles.selected : ''}`}
              onClick={() => handlePlanSelect(plan.name)}
            >
              <div className={styles.planName}>{plan.name}</div>
              <div className={styles.planValue}>{plan.value}</div>
              {plan.tag && (
                <div className={styles.planTag}>
                  {plan.tag === "BEST SELLER" && <Star size={12} />}
                  {plan.tag === "NEW" && <TrendingUp size={12} />}
                  {plan.tag === "POPULAR" && <Zap size={12} />}
                  {plan.tag}
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Objective Table */}
        <div className={styles.objectiveSection}>
          <h3>Objective</h3>
          <div className={styles.objectiveTable}>
            <div className={styles.tableHeader}>
              <div className={styles.headerCell}>Gainvault</div>
              <div className={styles.headerCell}>Stage 1</div>
              <div className={styles.headerCell}>Stage 2</div>
            </div>
            
            <div className={styles.tableRow}>
              <div className={styles.labelCell}>
                <Target size={16} />
                Profit Target
              </div>
              <div className={styles.valueCell}>{selectedPlanData.details.profitTarget[0]}</div>
              <div className={styles.valueCell}>{selectedPlanData.details.profitTarget[1]}</div>
            </div>

            <div className={styles.tableRow}>
              <div className={styles.labelCell}>
                <AlertTriangle size={16} />
                Max Daily Loss
              </div>
              <div className={styles.valueCell}>{selectedPlanData.details.maxDailyLoss[0]}</div>
              <div className={styles.valueCell}>{selectedPlanData.details.maxDailyLoss[1]}</div>
            </div>

            <div className={styles.tableRow}>
              <div className={styles.labelCell}>
                <AlertTriangle size={16} />
                Max Loss
              </div>
              <div className={styles.valueCell}>{selectedPlanData.details.maxLoss[0]}</div>
              <div className={styles.valueCell}>{selectedPlanData.details.maxLoss[1]}</div>
            </div>

            <div className={styles.tableRow}>
              <div className={styles.labelCell}>
                <Clock size={16} />
                Min Trading Days
              </div>
              <div className={styles.valueCell}>{selectedPlanData.details.minTradingDays[0]}</div>
              <div className={styles.valueCell}>{selectedPlanData.details.minTradingDays[1]}</div>
            </div>

            <div className={styles.tableRow}>
              <div className={styles.labelCell}>
                <Clock size={16} />
                Trading Period
              </div>
              <div className={styles.valueCell}>{selectedPlanData.details.tradingPeriod[0]}</div>
              <div className={styles.valueCell}>{selectedPlanData.details.tradingPeriod[1]}</div>
            </div>

            <div className={styles.tableRow}>
              <div className={styles.labelCell}>
                <Zap size={16} />
                Max Leverage
              </div>
              <div className={styles.valueCell}>{selectedPlanData.details.maxLeverage[0]}</div>
              <div className={styles.valueCell}>{selectedPlanData.details.maxLeverage[1]}</div>
            </div>
          </div>
        </div>

        {/* Action Section */}
        <div className={styles.actionSection}>
          <div className={styles.footnote}>
            *To proceed to the next stage, all positions must be closed
          </div>
          <div className={styles.challengeAction}>
            <div className={styles.challengePrice}>${selectedPlanData.cost}</div>
            <button 
              className={styles.startChallengeButton}
              onClick={handleStartChallenge}
            >
              Start Challenge
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;