import React, { useState } from 'react';
import { AlertTriangle, Clock, TrendingDown, Target, Shield, Zap, Calendar, UserX, Bot } from 'lucide-react';
import AnimatedSection from '../../components/AnimatedSection/AnimatedSection';
import styles from './Rules.module.css';

const Rules = () => {
  const [selectedRule, setSelectedRule] = useState(null);

  const rules = [
    {
      id: 'R1',
      name: 'Daily Drawdown Limit',
      icon: TrendingDown,
      violation: 'User loses more than X% in a single day',
      threshold: 'Loss > 5% of account on a single day',
      enforcement: 'Evaluated daily (EOD)',
      action: 'Mark user as DISQUALIFIED immediately',
      severity: 'high',
      color: '#FF4757'
    },
    {
      id: 'R2',
      name: 'Max Drawdown Limit',
      icon: AlertTriangle,
      violation: 'Total loss from peak equity > Y%',
      threshold: '(peak_balance - current_balance) > 10%',
      enforcement: 'Evaluated on trade or daily',
      action: 'Disqualify immediately',
      severity: 'high',
      color: '#FF4757'
    },
    {
      id: 'R3',
      name: 'Target ROI Not Reached',
      icon: Target,
      violation: "User didn't hit ROI target within challenge window",
      threshold: 'ROI < 12% at session end',
      enforcement: 'On session expiration',
      action: 'Mark as FAILED, show reason',
      severity: 'medium',
      color: '#FFA502'
    },
    {
      id: 'R4',
      name: 'Hedging Violation',
      icon: Shield,
      violation: 'Opposite trades on same symbol in a small time window',
      threshold: 'e.g., BUY and SELL within 5 mins on same symbol',
      enforcement: 'On each trade attempt or daily batch',
      action: 'Disqualify, log timestamp and symbol',
      severity: 'high',
      color: '#FF4757'
    },
    {
      id: 'R5',
      name: 'Over-Leveraging',
      icon: TrendingDown,
      violation: 'Trade size exceeds risk limits',
      threshold: 'trade_value > 2% of balance',
      enforcement: 'On each trade',
      action: 'Block trade or disqualify',
      severity: 'medium',
      color: '#FFA502'
    },
    {
      id: 'R6',
      name: 'High-Frequency Scalping',
      icon: Zap,
      violation: 'Closing trades in <2 mins repeatedly',
      threshold: '> 3 trades with < 2 min hold',
      enforcement: 'Evaluate trade history',
      action: 'Warning or Disqualify',
      severity: 'low',
      color: '#2ED573',
      optional: true
    },
    {
      id: 'R7',
      name: 'Trading During News',
      icon: Calendar,
      violation: 'Placing trades during restricted economic events',
      threshold: 'Based on timestamp vs. news calendar',
      enforcement: 'Before trade allowed',
      action: 'Reject trade, show warning',
      severity: 'medium',
      color: '#FFA502',
      conditional: true
    },
    {
      id: 'R8',
      name: 'Inactivity',
      icon: UserX,
      violation: 'User has not traded for N days (e.g. 7)',
      threshold: 'last_trade.timestamp < today - 7 days',
      enforcement: 'Daily cron job',
      action: 'Disqualify for inactivity',
      severity: 'low',
      color: '#747D8C'
    },
    {
      id: 'R9',
      name: 'External Signal/Bot Use',
      icon: Bot,
      violation: 'Abnormal patterns or account mirroring detected',
      threshold: 'Behavioral, manual/ML detection',
      enforcement: 'Review flagged trades',
      action: 'Admin review, possibly disqualify',
      severity: 'high',
      color: '#FF4757',
      manual: true
    }
  ];

  const getSeverityClass = (severity) => {
    switch (severity) {
      case 'high': return styles.severityHigh;
      case 'medium': return styles.severityMedium;
      case 'low': return styles.severityLow;
      default: return styles.severityMedium;
    }
  };

  const handleRuleClick = (rule) => {
    setSelectedRule(selectedRule?.id === rule.id ? null : rule);
  };

  return (
    <div className={styles.rulesPage}>
      <div className={styles.container}>
        <AnimatedSection className={styles.rulesHeader}>
          <h1>Disqualification Enforcement Rules</h1>
          <p className={styles.subtitle}>Prop Funding Evaluation Platform</p>
          <div className={styles.headerStats}>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>{rules.length}</span>
              <span className={styles.statLabel}>Total Rules</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>{rules.filter(r => r.severity === 'high').length}</span>
              <span className={styles.statLabel}>Critical Rules</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>{rules.filter(r => r.optional || r.conditional).length}</span>
              <span className={styles.statLabel}>Conditional</span>
            </div>
          </div>
        </AnimatedSection>

        <div className={styles.rulesGrid}>
          {rules.map((rule, index) => (
            <AnimatedSection key={rule.id} delay={index * 100}>
              <div 
                className={`${styles.ruleCard} ${selectedRule?.id === rule.id ? styles.selected : ''}`}
                onClick={() => handleRuleClick(rule)}
                style={{ '--rule-color': rule.color }}
              >
                <div className={styles.ruleHeader}>
                  <div className={styles.ruleIcon}>
                    <rule.icon size={24} />
                  </div>
                  <div className={styles.ruleTitle}>
                    <h3>{rule.id}</h3>
                    <h4>{rule.name}</h4>
                  </div>
                  <div className={`${styles.severityBadge} ${getSeverityClass(rule.severity)}`}>
                    {rule.severity}
                  </div>
                </div>

                {rule.optional && (
                  <div className={styles.ruleBadge}>Optional</div>
                )}
                {rule.conditional && (
                  <div className={styles.ruleBadge}>If Enforced</div>
                )}
                {rule.manual && (
                  <div className={styles.ruleBadge}>Manual Review</div>
                )}

                <div className={styles.ruleContent}>
                  <div className={styles.ruleSection}>
                    <h5>Violation Description</h5>
                    <p>{rule.violation}</p>
                  </div>

                  {selectedRule?.id === rule.id && (
                    <div className={styles.expandedContent}>
                      <div className={styles.ruleSection}>
                        <h5>Threshold/Logic</h5>
                        <code className={styles.codeBlock}>{rule.threshold}</code>
                      </div>

                      <div className={styles.ruleSection}>
                        <h5>When Enforced</h5>
                        <p>{rule.enforcement}</p>
                      </div>

                      <div className={styles.ruleSection}>
                        <h5>System Action</h5>
                        <p className={styles.actionText}>{rule.action}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className={styles.ruleFooter}>
                  <span className={styles.clickHint}>
                    {selectedRule?.id === rule.id ? 'Click to collapse' : 'Click for details'}
                  </span>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection className={styles.rulesFooter}>
          <div className={styles.legendSection}>
            <h3>Severity Levels</h3>
            <div className={styles.legendGrid}>
              <div className={styles.legendItem}>
                <div className={`${styles.legendColor} ${styles.severityHigh}`}></div>
                <span>High - Immediate disqualification</span>
              </div>
              <div className={styles.legendItem}>
                <div className={`${styles.legendColor} ${styles.severityMedium}`}></div>
                <span>Medium - Warning or conditional action</span>
              </div>
              <div className={styles.legendItem}>
                <div className={`${styles.legendColor} ${styles.severityLow}`}></div>
                <span>Low - Monitoring or delayed action</span>
              </div>
            </div>
          </div>

          <div className={styles.noticeSection}>
            <AlertTriangle size={20} />
            <p>
              These rules are automatically enforced by our evaluation platform. 
              Violations may result in immediate account disqualification or other penalties as specified.
            </p>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default Rules;