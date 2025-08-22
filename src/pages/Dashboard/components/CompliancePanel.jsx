import React from 'react';
import AnimatedSection from '../../../components/AnimatedSection/AnimatedSection';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { formatPercentage, formatTimeAgo } from '../utils/formatters';
import styles from '../Dashboard.module.css';

const CompliancePanel = ({ complianceFlags, tradeHistory, lastUpdated, accountSummary, dayMetrics }) => {
  const getComplianceIcon = (compliant, warning = false) => {
    if (compliant && !warning) return <CheckCircle size={20} className={styles.complianceSuccess} />;
    if (warning) return <AlertTriangle size={20} className={styles.complianceWarning} />;
    return <XCircle size={20} className={styles.complianceDanger} />;
  };

  return (
    <div className={styles.compliancePanel}>
      <AnimatedSection className={styles.liveCompliance}>
        <h2>Live Compliance</h2>
        <div className={styles.complianceGrid}>
          <div className={styles.complianceItem}>
            <div className={styles.complianceHeader}>
              {getComplianceIcon(complianceFlags.stopLossPlacedWithin10s.compliant)}
              <span>Stop Loss ≤ 10s</span>
            </div>
            <div className={styles.complianceValue}>
              {formatPercentage((complianceFlags.stopLossPlacedWithin10s?.ratio || 0) * 100)}
            </div>
          </div>

          <div className={styles.complianceItem}>
            <div className={styles.complianceHeader}>
              {getComplianceIcon(!complianceFlags.openPositionsLimitExceeded)}
              <span>Open Positions ≤ 1</span>
            </div>
            <div className={styles.complianceValue}>
              {accountSummary.openPositionsCount}/1
            </div>
          </div>

          <div className={styles.complianceItem}>
            <div className={styles.complianceHeader}>
              {getComplianceIcon(!complianceFlags.correlationExceeded)}
              <span>Correlation ≤ 25%</span>
            </div>
            <div className={styles.complianceValue}>
              {formatPercentage(accountSummary.correlatedExposurePercent)}
            </div>
          </div>

          <div className={styles.complianceItem}>
            <div className={styles.complianceHeader}>
              {getComplianceIcon(!complianceFlags.scalpingUnder10mDetected.detected)}
              <span>No Scalping &lt; 10m</span>
            </div>
            <div className={styles.complianceValue}>
              {complianceFlags.scalpingUnder10mDetected?.count || 0} violations
            </div>
          </div>

          <div className={styles.complianceItem}>
            <div className={styles.complianceHeader}>
              {getComplianceIcon(!complianceFlags.intradayFrequencyExceeded)}
              <span>&le; 4 trades / 5 days</span>
            </div>
            <div className={styles.complianceValue}>
              {(tradeHistory || []).filter(t => {
                const tradeDate = new Date(t.closeTime);
                const fiveDaysAgo = new Date();
                fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);
                return tradeDate >= fiveDaysAgo;
              }).length}/4
            </div>
          </div>

          <div className={styles.complianceItem}>
            <div className={styles.complianceHeader}>
              {getComplianceIcon(!complianceFlags.inactivityRisk.breached, complianceFlags.inactivityRisk.warning)}
              <span>48h Activity Rule</span>
            </div>
            <div className={styles.complianceValue}>
              {complianceFlags.inactivityRisk?.hoursSinceLastTrade || 0}h ago
            </div>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className={styles.breachTimeline}>
        <h2>Breach Timeline</h2>
        <div className={styles.breachList}>
          {dayMetrics.dailyBreached && (
            <div className={styles.breachItem}>
              <div className={styles.breachIcon}>
                <XCircle size={16} />
              </div>
              <div className={styles.breachContent}>
                <span className={styles.breachRule}>Daily Loss Limit</span>
                <span className={styles.breachTime}>{formatTimeAgo(lastUpdated)}</span>
              </div>
            </div>
          )}
          {(complianceFlags.scalpingUnder10mDetected?.count || 0) > 0 && (
            <div className={styles.breachItem}>
              <div className={styles.breachIcon}>
                <AlertTriangle size={16} />
              </div>
              <div className={styles.breachContent}>
                <span className={styles.breachRule}>Scalping Detected</span>
                <span className={styles.breachTime}>{complianceFlags.scalpingUnder10mDetected?.count || 0} violations</span>
              </div>
            </div>
          )}
          {!dayMetrics.dailyBreached && (complianceFlags.scalpingUnder10mDetected?.count || 0) === 0 && (
            <div className={styles.noBreaches}>
              <CheckCircle size={20} />
              <span>No recent breaches</span>
            </div>
          )}
        </div>
      </AnimatedSection>
    </div>
  );
};

export default CompliancePanel;
