import React, { useState } from 'react';
import { 
  Clock, 
  Target, 
  Shield, 
  AlertTriangle, 
  XCircle, 
  CheckCircle, 
  Info, 
  Calendar,
  TrendingUp,
  TrendingDown,
  Zap,
  UserCheck,
  Lock,
  Monitor,
  FileText,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import AnimatedSection from '../../components/AnimatedSection/AnimatedSection';
import styles from './Rules.module.css';

const Rules = () => {
  const [expandedSections, setExpandedSections] = useState(new Set(['A1', 'B1'])); // Default open sections
  const [selectedPhase, setSelectedPhase] = useState('phase1');

  const toggleSection = (sectionId) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const isSectionExpanded = (sectionId) => expandedSections.has(sectionId);

  const phases = [
    {
      id: 'phase1',
      name: 'Phase 1 - Elimination',
      duration: '40 days',
      target: '+20% net',
      color: '#FF4757',
      requirements: [
        'Profit Target: +20% net',
        'Consistency: 70% of trading days must be net profitable',
        'Max Consecutive Losing Days: 2',
        'Max Losing Trades in 7-Day Window: 3'
      ]
    },
    {
      id: 'phase2',
      name: 'Phase 2 - Verification',
      duration: '50 days',
      target: '+10% net',
      color: '#FFA502',
      requirements: [
        'Profit Target: +10% net',
        'Profitable Day Requirement: Minimum 20 profitable days',
        'Same constraints as Phase 1 apply',
        'Scrutiny is higher'
      ]
    },
    {
      id: 'final',
      name: 'Final Hold - Stability',
      duration: '15 consecutive days',
      target: 'Maintain profits',
      color: '#2ED573',
      requirements: [
        'Objective: Maintain net achieved profits with zero breaches',
        'No withdrawals or external adjustments',
        'Positions must comply with all rules',
        'Any violation restarts the hold or returns to Phase 2'
      ]
    }
  ];

  const rules = [
    {
      id: 'A1',
      title: 'Tracks and Timeline',
      icon: Clock,
      color: '#6366F1',
      content: (
        <div className={styles.ruleContent}>
          <div className={styles.timelineGrid}>
            <div className={styles.timelineItem}>
              <div className={styles.timelinePhase}>Phase 1</div>
              <div className={styles.timelineDuration}>40 days</div>
              <div className={styles.timelineDesc}>Elimination</div>
            </div>
            <div className={styles.timelineItem}>
              <div className={styles.timelinePhase}>Phase 2</div>
              <div className={styles.timelineDuration}>50 days</div>
              <div className={styles.timelineDesc}>Verification</div>
            </div>
            <div className={styles.timelineItem}>
              <div className={styles.timelinePhase}>Final Hold</div>
              <div className={styles.timelineDuration}>15 days</div>
              <div className={styles.timelineDesc}>Stability</div>
            </div>
          </div>
          <div className={styles.totalTimeline}>
            <strong>Total Maximum Evaluation Timeline: 105 days</strong>
          </div>
        </div>
      )
    },
    {
      id: 'A2',
      title: 'Funding Tiers',
      icon: Target,
      color: '#10B981',
      content: (
        <div className={styles.ruleContent}>
          <div className={styles.fundingTiers}>
            <div className={styles.tierItem}>
              <span className={styles.tierAmount}>$25,000</span>
              <span className={styles.tierLabel}>Standard</span>
            </div>
            <div className={styles.tierItem}>
              <span className={styles.tierAmount}>$50,000</span>
              <span className={styles.tierLabel}>Standard</span>
            </div>
            <div className={styles.tierItem}>
              <span className={styles.tierAmount}>$100,000</span>
              <span className={styles.tierLabel}>Standard</span>
            </div>
          </div>
          <div className={styles.tierNote}>
            <Info size={16} />
            <span>Scaling available by committee review after 6 months of audited consistency</span>
          </div>
        </div>
      )
    },
    {
      id: 'B1',
      title: 'Risk Management',
      icon: Shield,
      color: '#FF4757',
      severity: 'critical',
      content: (
        <div className={styles.ruleContent}>
          <div className={styles.ruleGrid}>
            <div className={styles.ruleItem}>
              <div className={styles.ruleHeader}>
                <span className={styles.ruleLabel}>Max Risk Per Trade</span>
                <span className={styles.ruleValue}>0.8%</span>
              </div>
              <p>Of starting account balance</p>
            </div>
            <div className={styles.ruleItem}>
              <div className={styles.ruleHeader}>
                <span className={styles.ruleLabel}>Stop Loss</span>
                <span className={styles.ruleValue}>Mandatory</span>
              </div>
              <p>Must be placed within 10 seconds of order execution</p>
            </div>
            <div className={styles.ruleItem}>
              <div className={styles.ruleHeader}>
                <span className={styles.ruleLabel}>Daily Loss Cap</span>
                <span className={styles.ruleValue}>2%</span>
              </div>
              <p>System will pause trading until next session if breached</p>
            </div>
            <div className={styles.ruleItem}>
              <div className={styles.ruleHeader}>
                <span className={styles.ruleLabel}>Profit Concentration</span>
                <span className={styles.ruleValue}>15% max</span>
              </div>
              <p>No single day may account for more than 15% of phase's total profit target</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'B2',
      title: 'Position Management',
      icon: TrendingUp,
      color: '#FFA502',
      severity: 'high',
      content: (
        <div className={styles.ruleContent}>
          <div className={styles.ruleGrid}>
            <div className={styles.ruleItem}>
              <div className={styles.ruleHeader}>
                <span className={styles.ruleLabel}>Open Positions</span>
                <span className={styles.ruleValue}>1 maximum</span>
              </div>
              <p>No pyramiding or scaling into positions</p>
            </div>
            <div className={styles.ruleItem}>
              <div className={styles.ruleHeader}>
                <span className={styles.ruleLabel}>Correlation Limit</span>
                <span className={styles.ruleValue}>25% max</span>
              </div>
              <p>No correlated exposure exceeding 25% across instruments</p>
            </div>
            <div className={styles.ruleItem}>
              <div className={styles.ruleHeader}>
                <span className={styles.ruleLabel}>Weekend Holding</span>
                <span className={styles.ruleValue}>Prohibited</span>
              </div>
              <p>All positions must be flat by Friday 21:00 UTC</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'B3',
      title: 'Trading Timeframes & Frequency',
      icon: Zap,
      color: '#6366F1',
      severity: 'medium',
      content: (
        <div className={styles.ruleContent}>
          <div className={styles.ruleGrid}>
            <div className={styles.ruleItem}>
              <div className={styles.ruleHeader}>
                <span className={styles.ruleLabel}>Scalping</span>
                <span className={styles.ruleValue}>10 min min</span>
              </div>
              <p>Prohibited for holds under 10 minutes</p>
            </div>
            <div className={styles.ruleItem}>
              <div className={styles.ruleHeader}>
                <span className={styles.ruleLabel}>Intraday Frequency</span>
                <span className={styles.ruleValue}>4 max</span>
              </div>
              <p>No more than 4 trades over any consecutive 5-day window</p>
            </div>
            <div className={styles.ruleItem}>
              <div className={styles.ruleHeader}>
                <span className={styles.ruleLabel}>Activity Requirement</span>
                <span className={styles.ruleValue}>48 hours</span>
              </div>
              <p>Minimum 1 executed and closed trade every 48 hours (rolling)</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'C1',
      title: 'Automation & External Influence',
      icon: XCircle,
      color: '#FF4757',
      severity: 'critical',
      content: (
        <div className={styles.ruleContent}>
          <div className={styles.prohibitedList}>
            <h4>Banned Tools & Practices:</h4>
            <ul>
              <li>All automated tools (EAs, bots, scripts)</li>
              <li>Tick scalping and latency arbitrage</li>
              <li>Reverse/hedge arbitrage</li>
              <li>Grid/martingale strategies</li>
              <li>Latency/data feed exploitation</li>
              <li>Emulators and third-party services</li>
            </ul>
            <div className={styles.zeroTolerance}>
              <AlertTriangle size={20} />
              <span>Zero tolerance - Immediate termination for any violation</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'C2',
      title: 'News & Event Trading',
      icon: Calendar,
      color: '#FFA502',
      severity: 'high',
      content: (
        <div className={styles.ruleContent}>
          <div className={styles.newsTrading}>
            <div className={styles.newsWindow}>
              <div className={styles.newsTime}>
                <span className={styles.newsLabel}>Before Event:</span>
                <span className={styles.newsValue}>4 hours</span>
              </div>
              <div className={styles.newsTime}>
                <span className={styles.newsLabel}>After Event:</span>
                <span className={styles.newsValue}>2 hours</span>
              </div>
            </div>
            <p>Absolute ban from opening/closing trades during these windows</p>
            <div className={styles.newsNote}>
              <Info size={16} />
              <span>GainVault controls the calendar; system enforces automatically</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'D1',
      title: 'Phase Requirements',
      icon: Target,
      color: '#10B981',
      severity: 'info',
      content: (
        <div className={styles.ruleContent}>
          <div className={styles.phaseRequirements}>
            {phases.map((phase) => (
              <div key={phase.id} className={styles.phaseCard} style={{ borderColor: phase.color }}>
                <div className={styles.phaseHeader}>
                  <h4>{phase.name}</h4>
                  <span className={styles.phaseDuration}>{phase.duration}</span>
                </div>
                <div className={styles.phaseTarget}>
                  <span className={styles.targetLabel}>Target:</span>
                  <span className={styles.targetValue}>{phase.target}</span>
                </div>
                <ul className={styles.phaseList}>
                  {phase.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )
    }
  ];

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'critical': return <XCircle size={20} className={styles.severityCritical} />;
      case 'high': return <AlertTriangle size={20} className={styles.severityHigh} />;
      case 'medium': return <Info size={20} className={styles.severityMedium} />;
      case 'info': return <Info size={20} className={styles.severityInfo} />;
      default: return <Info size={20} className={styles.severityInfo} />;
    }
  };

  const getSeverityClass = (severity) => {
    switch (severity) {
      case 'critical': return styles.severityCritical;
      case 'high': return styles.severityHigh;
      case 'medium': return styles.severityMedium;
      case 'info': return styles.severityInfo;
      default: return styles.severityInfo;
    }
  };

  return (
    <div className={styles.rulesPage}>
      <div className={styles.container}>
        {/* Header Section */}
        <AnimatedSection className={styles.rulesHeader}>
          <h1>GainVault Trading Rules</h1>
          <p className={styles.subtitle}>Comprehensive Evaluation & Funding Program</p>
          
          {/* Quick Stats */}
          <div className={styles.headerStats}>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>105</span>
              <span className={styles.statLabel}>Max Days</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>3</span>
              <span className={styles.statLabel}>Phases</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>$100K</span>
              <span className={styles.statLabel}>Max Funding</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>1</span>
              <span className={styles.statLabel}>Lifetime Attempt</span>
            </div>
          </div>
        </AnimatedSection>

        {/* Phase Overview */}
        <AnimatedSection className={styles.phaseOverview}>
          <h2>Program Phases</h2>
          <div className={styles.phaseGrid}>
            {phases.map((phase) => (
              <div 
                key={phase.id}
                className={`${styles.phaseCard} ${selectedPhase === phase.id ? styles.selected : ''}`}
                onClick={() => setSelectedPhase(phase.id)}
                style={{ borderColor: phase.color }}
              >
                <div className={styles.phaseIcon} style={{ backgroundColor: phase.color }}>
                  {phase.id === 'phase1' && <TrendingDown size={24} />}
                  {phase.id === 'phase2' && <Target size={24} />}
                  {phase.id === 'final' && <CheckCircle size={24} />}
                </div>
                <div className={styles.phaseContent}>
                  <h3>{phase.name}</h3>
                  <div className={styles.phaseDetails}>
                    <span className={styles.phaseDuration}>{phase.duration}</span>
                    <span className={styles.phaseTarget}>{phase.target}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>

        {/* Rules Sections */}
        <div className={styles.rulesContainer}>
          {rules.map((rule, index) => (
            <AnimatedSection key={rule.id} delay={index * 100}>
              <div className={styles.ruleSection}>
                <div 
                  className={styles.ruleHeader}
                  onClick={() => toggleSection(rule.id)}
                >
                  <div className={styles.ruleTitle}>
                    <div className={styles.ruleIcon} style={{ backgroundColor: rule.color }}>
                      <rule.icon size={20} />
                    </div>
                    <div>
                      <h3>{rule.title}</h3>
                      {rule.severity && (
                        <div className={styles.severityIndicator}>
                          {getSeverityIcon(rule.severity)}
                          <span className={getSeverityClass(rule.severity)}>
                            {rule.severity.charAt(0).toUpperCase() + rule.severity.slice(1)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className={styles.ruleToggle}>
                    {isSectionExpanded(rule.id) ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                  </div>
                </div>
                
                {isSectionExpanded(rule.id) && (
                  <div className={styles.ruleBody}>
                    {rule.content}
                  </div>
                )}
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Quick Compliance Checklist */}
        <AnimatedSection className={styles.complianceChecklist}>
          <h2>Quick Compliance Checklist</h2>
          <div className={styles.checklistGrid}>
            <div className={styles.checklistItem}>
              <CheckCircle size={20} className={styles.checkIcon} />
              <span>SL always, within 10 seconds</span>
            </div>
            <div className={styles.checklistItem}>
              <CheckCircle size={20} className={styles.checkIcon} />
              <span>Risk per trade ≤0.8%</span>
            </div>
            <div className={styles.checklistItem}>
              <CheckCircle size={20} className={styles.checkIcon} />
              <span>1 open position max; no weekend holds</span>
            </div>
            <div className={styles.checklistItem}>
              <CheckCircle size={20} className={styles.checkIcon} />
              <span>No trading 4h before / 2h after any event</span>
            </div>
            <div className={styles.checklistItem}>
              <CheckCircle size={20} className={styles.checkIcon} />
              <span>No automation, no copying, no signals</span>
            </div>
            <div className={styles.checklistItem}>
              <CheckCircle size={20} className={styles.checkIcon} />
              <span>Trade at least once every 48 hours</span>
            </div>
            <div className={styles.checklistItem}>
              <CheckCircle size={20} className={styles.checkIcon} />
              <span>Single device, single IP; no VPNs</span>
            </div>
            <div className={styles.checklistItem}>
              <CheckCircle size={20} className={styles.checkIcon} />
              <span>One lifetime attempt; no exceptions</span>
            </div>
          </div>
        </AnimatedSection>

        {/* Footer Notice */}
        <AnimatedSection className={styles.rulesFooter}>
          <div className={styles.noticeSection}>
            <AlertTriangle size={24} />
            <div>
              <h3>Important Notice</h3>
              <p>
                These rules are automatically enforced by our evaluation platform. 
                Violations may result in immediate account termination, lifetime ineligibility, 
                or other penalties as specified. This is a one-lifetime opportunity - 
                ensure full compliance with all requirements.
              </p>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default Rules;