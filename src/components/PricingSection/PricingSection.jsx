import React, { useState, useCallback, useMemo } from 'react';
import { Star, TrendingUp, Clock, Target, AlertTriangle, Zap, ChevronLeft, ChevronRight, Shield, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AnimatedSection from '../AnimatedSection/AnimatedSection';
import styles from './PricingSection.module.css';

const PricingSection = () => {
  const [selectedPlan, setSelectedPlan] = useState('SKILLED');
  const [challengeType, setChallengeType] = useState('twoStage');
  const [currentPlanIndex, setCurrentPlanIndex] = useState(2);
  const navigate = useNavigate();

  const challengePlans = [
    {
      name: "BASE",
      value: "$25,000",
      cost: 69,
      singleStageCost: 124,
      details: {
        profitTarget: ["20%", "10%"],
        maxDailyLoss: ["2%", "2%"],
        maxLoss: ["8%", "8%"],
        tradingPeriod: ["8 weeks", "10 weeks"],
        maxLeverage: ["1:3", "1:3"],
        maxRiskPerTrade: ["0.8%", "0.8%"]
      }
    },
    {
      name: "STARTER",
      value: "$50,000",
      tag: "BEST SELLER",
      cost: 129,
      singleStageCost: 232,
      details: {
        profitTarget: ["20%", "10%"],
        maxDailyLoss: ["2%", "2%"],
        maxLoss: ["8%", "8%"],
        tradingPeriod: ["8 weeks", "10 weeks"],
        maxLeverage: ["1:3", "1:3"],
        maxRiskPerTrade: ["0.8%", "0.8%"]
      }
    },
    {
      name: "SKILLED",
      value: "$100,000",
      tag: "NEW",
      cost: 179,
      singleStageCost: 322,
      isDefault: true,
      details: {
        profitTarget: ["20%", "10%"],
        maxDailyLoss: ["2%", "2%"],
        maxLoss: ["8%", "8%"],
        tradingPeriod: ["8 weeks", "10 weeks"],
        maxLeverage: ["1:3", "1:3"],
        maxRiskPerTrade: ["0.8%", "0.8%"]
      }
    },
    {
      name: "INTERMEDIATE",
      value: "$200,000",
      cost: 269,
      singleStageCost: 484,
      details: {
        profitTarget: ["20%", "10%"],
        maxDailyLoss: ["2%", "2%"],
        maxLoss: ["8%", "8%"],
        tradingPeriod: ["8 weeks", "10 weeks"],
        maxLeverage: ["1:3", "1:3"],
        maxRiskPerTrade: ["0.8%", "0.8%"]
      }
    },
    {
      name: "ADVANCED",
      value: "$500,000",
      cost: 549,
      singleStageCost: 988,
      details: {
        profitTarget: ["20%", "10%"],
        maxDailyLoss: ["2%", "2%"],
        maxLoss: ["8%", "8%"],
        tradingPeriod: ["8 weeks", "10 weeks"],
        maxLeverage: ["1:3", "1:3"],
        maxRiskPerTrade: ["0.8%", "0.8%"]
      }
    },
    {
      name: "EXPERT",
      value: "$1,000,000",
      tag: "POPULAR",
      cost: 1199,
      singleStageCost: 2158,
      details: {
        profitTarget: ["20%", "10%"],
        maxDailyLoss: ["2%", "2%"],
        maxLoss: ["8%", "8%"],
        tradingPeriod: ["8 weeks", "10 weeks"],
        maxLeverage: ["1:3", "1:3"],
        maxRiskPerTrade: ["0.8%", "0.8%"]
      }
    }
  ];

  const selectedPlanData = challengePlans.find(plan => plan.name === selectedPlan);

  const handlePlanSelect = (planName) => {
    setSelectedPlan(planName);
    const index = challengePlans.findIndex(plan => plan.name === planName);
    setCurrentPlanIndex(index);
  };

  const handleChallengeTypeChange = (type) => {
    setChallengeType(type);
  };

  const handleStartChallenge = () => {
    navigate('/trading-challenge', { 
      state: { 
        selectedPlan, 
        challengeType 
      } 
    });
  };

  const getCurrentPrice = () => {
    return challengeType === 'twoStage' ? selectedPlanData.cost : selectedPlanData.singleStageCost;
  };

  const nextPlan = () => {
    const nextIndex = (currentPlanIndex + 1) % challengePlans.length;
    setCurrentPlanIndex(nextIndex);
    setSelectedPlan(challengePlans[nextIndex].name);
  };

  const prevPlan = () => {
    const prevIndex = currentPlanIndex === 0 ? challengePlans.length - 1 : currentPlanIndex - 1;
    setCurrentPlanIndex(prevIndex);
    setSelectedPlan(challengePlans[prevIndex].name);
  };

  return (
    <section className={styles.pricingSection} id="pricing">
      <div className={styles.container}>
        <AnimatedSection className={styles.pricingHeader}>
          <h2>CHALLENGE PLANS</h2>
          <p>Choose your path to prop trading success</p>
        </AnimatedSection>

        {/* Challenge Type Toggle */}
        <div className={styles.challengeTypeToggle}>
          <button
            className={`${styles.toggleButton} ${challengeType === 'twoStage' ? styles.active : ''}`}
            onClick={() => handleChallengeTypeChange('twoStage')}
          >
            Two Stages
          </button>
          <button
            className={`${styles.toggleButton} ${challengeType === 'singleStage' ? styles.active : ''}`}
            onClick={() => handleChallengeTypeChange('singleStage')}
          >
            Single Stage
          </button>
        </div>

        {/* Key Trading Rules Summary */}
        <div className={styles.rulesSummary}>
          <h3>Key Trading Rules & Requirements</h3>
          <div className={styles.rulesGrid}>
            <div className={styles.ruleItem}>
              <div className={styles.ruleIcon}>
                <Shield size={20} />
              </div>
              <div className={styles.ruleContent}>
                <h4>Risk Management</h4>
                <p>Max 0.8% risk per trade, 2% daily loss cap, mandatory stop losses</p>
              </div>
            </div>
            <div className={styles.ruleItem}>
              <div className={styles.ruleIcon}>
                <TrendingUp size={20} />
              </div>
              <div className={styles.ruleContent}>
                <h4>Position Management</h4>
                <p>1 position max, no weekend holding, 25% correlation limit</p>
              </div>
            </div>
            <div className={styles.ruleItem}>
              <div className={styles.ruleIcon}>
                <Clock size={20} />
              </div>
              <div className={styles.ruleContent}>
                <h4>Trading Frequency</h4>
                <p>Min 10min holds, max 4 trades/week, activity every 48h required</p>
              </div>
            </div>
            <div className={styles.ruleItem}>
              <div className={styles.ruleIcon}>
                <XCircle size={20} />
              </div>
              <div className={styles.ruleContent}>
                <h4>Prohibited</h4>
                <p>No automation, no news trading, no scalping under 10min</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Plan Navigation */}
        <div className={styles.mobilePlanNav}>
          <button 
            className={styles.navButton} 
            onClick={prevPlan}
            aria-label="Previous plan"
          >
            <ChevronLeft size={20} />
          </button>
          
          <div className={styles.currentPlanDisplay}>
            <div className={styles.planName}>{selectedPlanData.name}</div>
            <div className={styles.planValue}>{selectedPlanData.value}</div>
            {selectedPlanData.tag && (
              <div className={styles.planTag}>
                {selectedPlanData.tag === "BEST SELLER" && <Star size={12} />}
                {selectedPlanData.tag === "NEW" && <TrendingUp size={12} />}
                {selectedPlanData.tag === "POPULAR" && <Zap size={12} />}
                {selectedPlanData.tag}
              </div>
            )}
          </div>
          
          <button 
            className={styles.navButton} 
            onClick={nextPlan}
            aria-label="Next plan"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Desktop Plan Selection */}
        <div className={styles.desktopPlanSelection}>
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

        {/* Plan Progress Indicator */}
        <div className={styles.planProgress}>
          {challengePlans.map((_, index) => (
            <div 
              key={index}
              className={`${styles.progressDot} ${index === currentPlanIndex ? styles.active : ''}`}
              onClick={() => {
                setCurrentPlanIndex(index);
                setSelectedPlan(challengePlans[index].name);
              }}
            />
          ))}
        </div>

        {/* Simplified Objective Section */}
        <div className={styles.objectiveSection}>
          <h3>Challenge Objectives</h3>
          
          {/* Mobile-friendly objective display */}
          <div className={styles.objectiveGrid}>
            <div className={styles.objectiveCard}>
              <div className={styles.cardHeader}>
                <div className={styles.cardIcon}>
                  <Target size={24} />
                </div>
                <h4>Profit Target</h4>
              </div>
              <div className={styles.cardContent}>
                {challengeType === 'twoStage' ? (
                  <div className={styles.stagesContainer}>
                    <div className={styles.stageItem}>
                      <div className={styles.stageBadge}>Stage 1</div>
                      <div className={styles.stageValue}>{selectedPlanData.details.profitTarget[0]}</div>
                    </div>
                    <div className={styles.stageItem}>
                      <div className={styles.stageBadge}>Stage 2</div>
                      <div className={styles.stageValue}>{selectedPlanData.details.profitTarget[1]}</div>
                    </div>
                  </div>
                ) : (
                  <div className={styles.singleValue}>
                    <div className={styles.valueDisplay}>{selectedPlanData.details.profitTarget[0]}</div>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.objectiveCard}>
              <div className={styles.cardHeader}>
                <div className={styles.cardIcon}>
                  <AlertTriangle size={24} />
                </div>
                <h4>Max Daily Loss</h4>
              </div>
              <div className={styles.cardContent}>
                {challengeType === 'twoStage' ? (
                  <div className={styles.stagesContainer}>
                    <div className={styles.stageItem}>
                      <div className={styles.stageBadge}>Stage 1</div>
                      <div className={styles.stageValue}>{selectedPlanData.details.maxDailyLoss[0]}</div>
                    </div>
                    <div className={styles.stageItem}>
                      <div className={styles.stageBadge}>Stage 2</div>
                      <div className={styles.stageValue}>{selectedPlanData.details.maxDailyLoss[1]}</div>
                    </div>
                  </div>
                ) : (
                  <div className={styles.singleValue}>
                    <div className={styles.valueDisplay}>{selectedPlanData.details.maxDailyLoss[0]}</div>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.objectiveCard}>
              <div className={styles.cardHeader}>
                <div className={styles.cardIcon}>
                  <AlertTriangle size={24} />
                </div>
                <h4>Max Loss</h4>
              </div>
              <div className={styles.cardContent}>
                {challengeType === 'twoStage' ? (
                  <div className={styles.stagesContainer}>
                    <div className={styles.stageItem}>
                      <div className={styles.stageBadge}>Stage 1</div>
                      <div className={styles.stageValue}>{selectedPlanData.details.maxLoss[0]}</div>
                    </div>
                    <div className={styles.stageItem}>
                      <div className={styles.stageBadge}>Stage 2</div>
                      <div className={styles.stageValue}>{selectedPlanData.details.maxLoss[1]}</div>
                    </div>
                  </div>
                ) : (
                  <div className={styles.singleValue}>
                    <div className={styles.valueDisplay}>{selectedPlanData.details.maxLoss[0]}</div>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.objectiveCard}>
              <div className={styles.cardHeader}>
                <div className={styles.cardIcon}>
                  <Clock size={24} />
                </div>
                <h4>Trading Period</h4>
              </div>
              <div className={styles.cardContent}>
                {challengeType === 'twoStage' ? (
                  <div className={styles.stagesContainer}>
                    <div className={styles.stageItem}>
                      <div className={styles.stageBadge}>Stage 1</div>
                      <div className={styles.stageValue}>{selectedPlanData.details.tradingPeriod[0]}</div>
                    </div>
                    <div className={styles.stageItem}>
                      <div className={styles.stageBadge}>Stage 2</div>
                      <div className={styles.stageValue}>{selectedPlanData.details.tradingPeriod[1]}</div>
                    </div>
                  </div>
                ) : (
                  <div className={styles.singleValue}>
                    <div className={styles.valueDisplay}>{selectedPlanData.details.tradingPeriod[0]}</div>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.objectiveCard}>
              <div className={styles.cardHeader}>
                <div className={styles.cardIcon}>
                  <Zap size={24} />
                </div>
                <h4>Max Leverage</h4>
              </div>
              <div className={styles.cardContent}>
                {challengeType === 'twoStage' ? (
                  <div className={styles.stagesContainer}>
                    <div className={styles.stageItem}>
                      <div className={styles.stageBadge}>Stage 1</div>
                      <div className={styles.stageValue}>{selectedPlanData.details.maxLeverage[0]}</div>
                    </div>
                    <div className={styles.stageItem}>
                      <div className={styles.stageBadge}>Stage 2</div>
                      <div className={styles.stageValue}>{selectedPlanData.details.maxLeverage[1]}</div>
                    </div>
                  </div>
                ) : (
                  <div className={styles.singleValue}>
                    <div className={styles.valueDisplay}>{selectedPlanData.details.maxLeverage[0]}</div>
                  </div>
                )}
              </div>
            </div>

            <div className={styles.objectiveCard}>
              <div className={styles.cardHeader}>
                <div className={styles.cardIcon}>
                  <Shield size={24} />
                </div>
                <h4>Max Risk Per Trade</h4>
              </div>
              <div className={styles.cardContent}>
                {challengeType === 'twoStage' ? (
                  <div className={styles.stagesContainer}>
                    <div className={styles.stageItem}>
                      <div className={styles.stageBadge}>Stage 1</div>
                      <div className={styles.stageValue}>{selectedPlanData.details.maxRiskPerTrade[0]}</div>
                    </div>
                    <div className={styles.stageItem}>
                      <div className={styles.stageBadge}>Stage 2</div>
                      <div className={styles.stageValue}>{selectedPlanData.details.maxRiskPerTrade[1]}</div>
                    </div>
                  </div>
                ) : (
                  <div className={styles.singleValue}>
                    <div className={styles.valueDisplay}>{selectedPlanData.details.maxRiskPerTrade[0]}</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Desktop table */}
          <div className={styles.desktopTable}>
            <div className={styles.tableHeader}>
              <div className={styles.headerCell}>Gainvault</div>
              {challengeType === 'twoStage' ? (
                <>
                  <div className={styles.headerCell}>Stage 1</div>
                  <div className={styles.headerCell}>Stage 2</div>
                </>
              ) : (
                <div className={styles.headerCell}>Single Stage</div>
              )}
            </div>
            
            <div className={styles.tableRow}>
              <div className={styles.labelCell}>
                <Target size={16} />
                <span>Profit Target</span>
              </div>
              {challengeType === 'twoStage' ? (
                <>
                  <div className={styles.valueCell}>{selectedPlanData.details.profitTarget[0]}</div>
                  <div className={styles.valueCell}>{selectedPlanData.details.profitTarget[1]}</div>
                </>
              ) : (
                <div className={styles.valueCell}>{selectedPlanData.details.profitTarget[0]}</div>
              )}
            </div>

            <div className={styles.tableRow}>
              <div className={styles.labelCell}>
                <AlertTriangle size={16} />
                <span>Max Daily Loss</span>
              </div>
              {challengeType === 'twoStage' ? (
                <>
                  <div className={styles.valueCell}>{selectedPlanData.details.maxDailyLoss[0]}</div>
                  <div className={styles.valueCell}>{selectedPlanData.details.maxDailyLoss[1]}</div>
                </>
              ) : (
                <div className={styles.valueCell}>{selectedPlanData.details.maxDailyLoss[0]}</div>
              )}
            </div>

            <div className={styles.tableRow}>
              <div className={styles.labelCell}>
                <AlertTriangle size={16} />
                <span>Max Loss</span>
              </div>
              {challengeType === 'twoStage' ? (
                <>
                  <div className={styles.valueCell}>{selectedPlanData.details.maxLoss[0]}</div>
                  <div className={styles.valueCell}>{selectedPlanData.details.maxLoss[1]}</div>
                </>
              ) : (
                <div className={styles.valueCell}>{selectedPlanData.details.maxLoss[0]}</div>
              )}
            </div>

            <div className={styles.tableRow}>
              <div className={styles.labelCell}>
                <Clock size={16} />
                <span>Trading Period</span>
              </div>
              {challengeType === 'twoStage' ? (
                <>
                  <div className={styles.valueCell}>{selectedPlanData.details.tradingPeriod[0]}</div>
                  <div className={styles.valueCell}>{selectedPlanData.details.tradingPeriod[1]}</div>
                </>
              ) : (
                <div className={styles.valueCell}>{selectedPlanData.details.tradingPeriod[0]}</div>
              )}
            </div>

            <div className={styles.tableRow}>
              <div className={styles.labelCell}>
                <Zap size={16} />
                <span>Max Leverage</span>
              </div>
              {challengeType === 'twoStage' ? (
                <>
                  <div className={styles.valueCell}>{selectedPlanData.details.maxLeverage[0]}</div>
                  <div className={styles.valueCell}>{selectedPlanData.details.maxLeverage[1]}</div>
                </>
              ) : (
                <div className={styles.valueCell}>{selectedPlanData.details.maxLeverage[0]}</div>
              )}
            </div>

            <div className={styles.tableRow}>
              <div className={styles.labelCell}>
                <Shield size={16} />
                <span>Max Risk Per Trade</span>
              </div>
              {challengeType === 'twoStage' ? (
                <>
                  <div className={styles.valueCell}>{selectedPlanData.details.maxRiskPerTrade[0]}</div>
                  <div className={styles.valueCell}>{selectedPlanData.details.maxRiskPerTrade[1]}</div>
                </>
              ) : (
                <div className={styles.valueCell}>{selectedPlanData.details.maxRiskPerTrade[0]}</div>
              )}
            </div>
          </div>
        </div>

        {/* Action Section */}
        <div className={styles.actionSection}>
          <div className={styles.footnote}>
            *To proceed to the next stage, all positions must be closed
          </div>
          <div className={styles.challengeAction}>
            <div className={styles.challengePrice}>${getCurrentPrice()}</div>
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