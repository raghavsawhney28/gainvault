import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { 
  RefreshCw, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Info,
  Clock,
  Target,
  Shield,
  Calendar,
  Zap,
  UserCheck,
  Lock,
  Monitor,
  FileText,
  ChevronRight,
  ExternalLink,
  AlertCircle,
  BarChart3,
  Activity,
  Timer,
  Globe,
  Smartphone
} from 'lucide-react';
import { 
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  LinearProgress,
  Chip,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import AnimatedSection from '../../components/AnimatedSection/AnimatedSection';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const { username } = useParams();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [refreshInterval, setRefreshInterval] = useState(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState('1W');
  const [tradeFilters, setTradeFilters] = useState({
    dateRange: '30d',
    symbol: '',
    result: 'all',
    flaggedOnly: false
  });

  // Mock data structure - replace with actual API calls
  const mockDashboardData = {
    accountSummary: {
      accountId: 'ACC001',
      userId: 'USER001',
      plan: { name: '$25K Standard', size: 25000, currency: 'USD' },
      phase: { 
        id: 'phase1', 
        name: 'Phase 1 - Elimination', 
        startedAt: '2024-01-15T00:00:00Z',
        endsAt: '2024-02-24T00:00:00Z',
        daysElapsed: 15,
        daysRemaining: 25
      },
      status: 'active',
      startBalance: 25000,
      currentBalance: 25250,
      currentEquity: 25250,
      peakEquity: 25300,
      troughEquity: 24800,
      profitTargetPercent: 20,
      overallLossCapPercent: null,
      maxDailyLossPercent: 2,
      maxRiskPerTradePercent: 0.8,
      openPositionsCount: 1,
      correlatedExposurePercent: 15,
      timezoneDisplay: { utc: 'UTC', local: 'UTC+05:30 (IST)' }
    },
    dayMetrics: {
      dayStartEquity: 25000,
      realizedPLToday: 150,
      unrealizedPLToday: 100,
      dailyLossPercent: 0.6,
      dailyBreached: false,
      nextResetAt: '2024-01-30T00:00:00Z'
    },
    challengeProgress: {
      phaseProfitPercent: 12.5,
      consistency: {
        daysTraded: 12,
        profitableDays: 9,
        profitableDaysPercent: 75
      },
      consecutiveLosingDaysCurrent: 0,
      consecutiveLosingDaysMax: 1,
      losingTradesLast7Days: 2,
      profitableDaysPhase2MinMet: false,
      profitConcentration: {
        maxSingleDayContributionPercent: 8,
        lastMaxDayDate: '2024-01-20'
      }
    },
    complianceFlags: {
      stopLossPlacedWithin10s: { compliant: true, ratio: 0.95 },
      scalpingUnder10mDetected: { detected: false, count: 0 },
      weekendHoldRisk: false,
      correlationExceeded: false,
      openPositionsLimitExceeded: false,
      intradayFrequencyExceeded: false,
      inactivityRisk: { breached: false, warning: false, hoursSinceLastTrade: 12 },
      automationSuspected: false,
      deviceIpViolation: false,
      lifetimeAttemptLocked: false
    },
    equityCurve: [
      { time: '2024-01-15T00:00:00Z', equity: 25000 },
      { time: '2024-01-16T00:00:00Z', equity: 25100 },
      { time: '2024-01-17T00:00:00Z', equity: 25050 },
      { time: '2024-01-18T00:00:00Z', equity: 25200 },
      { time: '2024-01-19T00:00:00Z', equity: 25150 },
      { time: '2024-01-20T00:00:00Z', equity: 25300 },
      { time: '2024-01-21T00:00:00Z', equity: 25250 },
      { time: '2024-01-22T00:00:00Z', equity: 25250 }
    ],
    tradeHistory: [
      {
        id: 'TR001',
        symbol: 'EURUSD',
        side: 'buy',
        lot: 0.1,
        entryPrice: 1.0850,
        exitPrice: 1.0870,
        openTime: '2024-01-22T08:00:00Z',
        closeTime: '2024-01-22T10:30:00Z',
        durationSec: 9000,
        plAmount: 20,
        plPercent: 0.08,
        slPlacedAtSec: 8,
        ruleFlags: []
      }
    ],
    newsLockouts: {
      nextLockout: {
        eventName: 'FOMC Meeting',
        impact: 'high',
        windowStart: '2024-01-31T18:00:00Z',
        windowEnd: '2024-01-31T22:00:00Z',
        isActive: false,
        countdownSec: 777600
      },
      lockoutListToday: []
    }
  };

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      // Replace with actual API call
      // const response = await api.get(`/dashboard/${username}`);
      // setDashboardData(response.data);
      
      // Using mock data for now
      setDashboardData(mockDashboardData);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError('Failed to fetch dashboard data');
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [username]);

  const startRefreshInterval = useCallback(() => {
    if (refreshInterval) clearInterval(refreshInterval);
    const interval = setInterval(fetchDashboardData, 30000); // 30 seconds
    setRefreshInterval(interval);
  }, [fetchDashboardData, refreshInterval]);

  const stopRefreshInterval = useCallback(() => {
    if (refreshInterval) {
      clearInterval(refreshInterval);
      setRefreshInterval(null);
    }
  }, [refreshInterval]);

  useEffect(() => {
    fetchDashboardData();
    startRefreshInterval();
    
    return () => {
      stopRefreshInterval();
    };
  }, [fetchDashboardData, startRefreshInterval, stopRefreshInterval]);

  const handleManualRefresh = () => {
    fetchDashboardData();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return styles.statusActive;
      case 'on-hold': return styles.statusOnHold;
      case 'passed': return styles.statusPassed;
      case 'failed': return styles.statusFailed;
      default: return styles.statusActive;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <Activity size={16} />;
      case 'on-hold': return <Clock size={16} />;
      case 'passed': return <CheckCircle size={16} />;
      case 'failed': return <XCircle size={16} />;
      default: return <Activity size={16} />;
    }
  };

  const getSeverityClass = (value, threshold, isPercentage = false) => {
    if (isPercentage) {
      if (value >= threshold * 0.8) return styles.severitySuccess;
      if (value >= threshold * 0.6) return styles.severityWarning;
      return styles.severityDanger;
    }
    
    if (value <= threshold * 0.8) return styles.severitySuccess;
    if (value <= threshold * 0.6) return styles.severityWarning;
    return styles.severityDanger;
  };

  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatPercentage = (value) => {
    return `${value.toFixed(2)}%`;
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now - time;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const getComplianceIcon = (compliant, warning = false) => {
    if (compliant && !warning) return <CheckCircle size={20} className={styles.complianceSuccess} />;
    if (warning) return <AlertTriangle size={20} className={styles.complianceWarning} />;
    return <XCircle size={20} className={styles.complianceDanger} />;
  };

  if (loading && !dashboardData) {
    return (
      <div className={styles.dashboardPage}>
        <div className={styles.container}>
          <div className={styles.skeletonLoader}>
            <div className={styles.skeletonHeader}></div>
            <div className={styles.skeletonCards}>
              {[1, 2, 3, 4].map(i => <div key={i} className={styles.skeletonCard}></div>)}
            </div>
            <div className={styles.skeletonChart}></div>
            <div className={styles.skeletonPanels}></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.dashboardPage}>
        <div className={styles.container}>
          <div className={styles.errorState}>
            <AlertCircle size={48} />
            <h2>Failed to load dashboard</h2>
            <p>{error}</p>
            <button onClick={fetchDashboardData} className={styles.retryButton}>
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!dashboardData) return null;

  const { accountSummary, dayMetrics, challengeProgress, complianceFlags, equityCurve, tradeHistory, newsLockouts } = dashboardData;

  return (
    <div className={styles.dashboardPage}>
      <div className={styles.container}>
        {/* Header Bar */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Box>
                  <Typography variant="body2" color="text.secondary">Plan</Typography>
                  <Typography variant="h4" component="h1">{accountSummary.plan.name}</Typography>
                  <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                    {formatCurrency(accountSummary.plan.size, accountSummary.plan.currency)}
                  </Typography>
                  <Chip 
                    label={accountSummary.phase.name} 
                    color="primary" 
                    variant="outlined"
                    sx={{ mt: 1 }}
                  />
                </Box>
              </Grid>

              <Grid size={{ xs: 12, sm: 4 }}>
                <Box display="flex" flexDirection="column" alignItems="center">
                  <Typography variant="body2" color="text.secondary">Status</Typography>
                  <Chip 
                    icon={getStatusIcon(accountSummary.status)}
                    label={accountSummary.status.charAt(0).toUpperCase() + accountSummary.status.slice(1)}
                    color={
                      accountSummary.status === 'active' ? 'success' :
                      accountSummary.status === 'on-hold' ? 'warning' :
                      accountSummary.status === 'passed' ? 'success' : 'error'
                    }
                    sx={{ mt: 1 }}
                  />
                  {lastUpdated && (
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                      Last updated: {formatTimeAgo(lastUpdated)}
                    </Typography>
                  )}
                </Box>
              </Grid>

              <Grid size={{ xs: 12, sm: 4 }}>
                <Box display="flex" flexDirection="column" alignItems="flex-end">
                  <Typography variant="body2" color="text.secondary">Actions</Typography>
                  <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                    <Button 
                      variant="contained" 
                      onClick={handleManualRefresh}
                      startIcon={<RefreshCw size={16} />}
                    >
                      Refresh
                    </Button>
                    <Button 
                      variant="outlined" 
                      href="/rules"
                      startIcon={<FileText size={16} />}
                      endIcon={<ExternalLink size={14} />}
                    >
                      Rules
                    </Button>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* News Lockout Banner */}
        {newsLockouts.nextLockout && (
          <Card sx={{ mb: 4, bgcolor: 'warning.50', border: '1px solid', borderColor: 'warning.200' }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={2}>
                <Calendar size={24} color="warning" />
                <Box flex={1}>
                  <Typography variant="h6" color="warning.dark">Upcoming Trading Lockout</Typography>
                  <Typography variant="body1" color="warning.main">
                    {newsLockouts.nextLockout.eventName} - {newsLockouts.nextLockout.impact} impact
                  </Typography>
                  <Typography variant="body2" color="warning.dark" sx={{ mt: 1 }}>
                    Lockout: {new Date(newsLockouts.nextLockout.windowStart).toLocaleString()} - {new Date(newsLockouts.nextLockout.windowEnd).toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Progress & Risk Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <AnimatedSection delay={100}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="flex-start" justifyContent="space-between">
                    <Box>
                      <Typography variant="body2" color="text.secondary">Profit Target</Typography>
                      <Typography variant="h4" component="div">
                        {formatPercentage(challengeProgress.phaseProfitPercent)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        of {formatPercentage(accountSummary.profitTargetPercent)} target
                      </Typography>
                    </Box>
                    <Target size={20} color="primary" />
                  </Box>
                  <Box sx={{ mt: 2 }}>
                    <LinearProgress 
                      variant="determinate" 
                      value={Math.min(100, challengeProgress.phaseProfitPercent)}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </AnimatedSection>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <AnimatedSection delay={200}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="flex-start" justifyContent="space-between">
                    <Box>
                      <Typography variant="body2" color="text.secondary">Daily Loss</Typography>
                      <Typography variant="h4" component="div" color="error.main">
                        {formatPercentage(dayMetrics.dailyLossPercent)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        of {formatPercentage(accountSummary.maxDailyLossPercent)} limit
                      </Typography>
                    </Box>
                    <TrendingDown size={20} color="error" />
                  </Box>
                  <Box sx={{ mt: 2 }}>
                    <LinearProgress 
                      variant="determinate" 
                      value={Math.min(100, (dayMetrics.dailyLossPercent / accountSummary.maxDailyLossPercent) * 100)}
                      color={dayMetrics.dailyLossPercent > accountSummary.maxDailyLossPercent * 0.8 ? "error" : "warning"}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </AnimatedSection>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <AnimatedSection delay={300}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="flex-start" justifyContent="space-between">
                    <Box>
                      <Typography variant="body2" color="text.secondary">Overall Drawdown</Typography>
                      <Typography variant="h4" component="div">
                        {formatPercentage(((accountSummary.peakEquity - accountSummary.currentEquity) / accountSummary.startBalance) * 100)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        from peak equity
                      </Typography>
                    </Box>
                    <BarChart3 size={20} color="primary" />
                  </Box>
                  <Box sx={{ mt: 2 }}>
                    <LinearProgress 
                      variant="determinate" 
                      value={Math.min(100, ((accountSummary.peakEquity - accountSummary.currentEquity) / accountSummary.startBalance) * 100)}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </AnimatedSection>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
            <AnimatedSection delay={400}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="flex-start" justifyContent="space-between">
                    <Box>
                      <Typography variant="body2" color="text.secondary">Consistency</Typography>
                      <Typography variant="h4" component="div" color="success.main">
                        {formatPercentage(challengeProgress.consistency.profitableDaysPercent)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {challengeProgress.consistency.profitableDays} of {challengeProgress.consistency.daysTraded} days
                      </Typography>
                    </Box>
                    <TrendingUp size={20} color="success" />
                  </Box>
                  <Box sx={{ mt: 2 }}>
                    <LinearProgress 
                      variant="determinate" 
                      value={challengeProgress.consistency.profitableDaysPercent}
                      color={challengeProgress.consistency.profitableDaysPercent >= 70 ? "success" : "warning"}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </AnimatedSection>
          </Grid>
        </Grid>

        {/* Compliance Overview Chart */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h5" component="h2" sx={{ mb: 3 }}>Compliance Overview</Typography>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Stop Loss Compliance</Typography>
                <Box sx={{ height: 200 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Compliant', value: complianceFlags.stopLossPlacedWithin10s.ratio * 100 },
                          { name: 'Non-compliant', value: (1 - complianceFlags.stopLossPlacedWithin10s.ratio) * 100 }
                        ]}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                      >
                        <Cell fill="#4caf50" />
                        <Cell fill="#f44336" />
                      </Pie>
                      <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Daily Performance</Typography>
                <Box sx={{ height: 200 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { metric: 'Daily Loss', value: dayMetrics.dailyLossPercent, target: accountSummary.maxDailyLossPercent }
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="metric" />
                      <YAxis />
                      <Tooltip formatter={(value) => `${value.toFixed(2)}%`} />
                      <Bar dataKey="value" fill="#f44336" />
                      <Bar dataKey="target" fill="#9e9e9e" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Equity Curve Panel */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
              <Typography variant="h5" component="h2">Equity Curve</Typography>
              <Box display="flex" gap={1}>
                {['1D', '1W', '1M', 'All'].map(timeframe => (
                  <Button
                    key={timeframe}
                    variant={selectedTimeframe === timeframe ? "contained" : "outlined"}
                    size="small"
                    onClick={() => setSelectedTimeframe(timeframe)}
                  >
                    {timeframe}
                  </Button>
                ))}
              </Box>
            </Box>
            
            {equityCurve.length > 0 ? (
              <Box sx={{ height: 320 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={equityCurve}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="time" 
                      tickFormatter={(value) => new Date(value).toLocaleDateString()}
                    />
                    <YAxis 
                      tickFormatter={(value) => formatCurrency(value)}
                    />
                    <Tooltip 
                      formatter={(value) => [formatCurrency(value), 'Equity']}
                      labelFormatter={(value) => new Date(value).toLocaleString()}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="equity" 
                      stroke="#4caf50" 
                      fill="#4caf50" 
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            ) : (
              <Box 
                display="flex" 
                flexDirection="column" 
                alignItems="center" 
                justifyContent="center" 
                sx={{ height: 320, color: 'text.secondary' }}
              >
                <BarChart3 size={48} sx={{ mb: 2, opacity: 0.5 }} />
                <Typography>Make your first trade to see the equity curve</Typography>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Compliance & Alerts Panel */}
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
                  {formatPercentage(complianceFlags.stopLossPlacedWithin10s.ratio * 100)}
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
                  {complianceFlags.scalpingUnder10mDetected.count} violations
                </div>
              </div>

              <div className={styles.complianceItem}>
                <div className={styles.complianceHeader}>
                  {getComplianceIcon(!complianceFlags.intradayFrequencyExceeded)}
                  <span>&le; 4 trades / 5 days</span>
                </div>
                <div className={styles.complianceValue}>
                  {tradeHistory.filter(t => {
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
                  {complianceFlags.inactivityRisk.hoursSinceLastTrade}h ago
                </div>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection className={styles.breachTimeline}>
            <h2>Breach Timeline</h2>
            <div className={styles.breachList}>
              {complianceFlags.dailyBreached && (
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
              {complianceFlags.scalpingUnder10mDetected.count > 0 && (
                <div className={styles.breachItem}>
                  <div className={styles.breachIcon}>
                    <AlertTriangle size={16} />
                  </div>
                  <div className={styles.breachContent}>
                    <span className={styles.breachRule}>Scalping Detected</span>
                    <span className={styles.breachTime}>{complianceFlags.scalpingUnder10mDetected.count} violations</span>
                  </div>
                </div>
              )}
              {!complianceFlags.dailyBreached && complianceFlags.scalpingUnder10mDetected.count === 0 && (
                <div className={styles.noBreaches}>
                  <CheckCircle size={20} />
                  <span>No recent breaches</span>
                </div>
              )}
            </div>
          </AnimatedSection>
        </div>

                {/* Phase Checklist */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h5" component="h2" align="center" sx={{ mb: 3 }}>Phase Requirements</Typography>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                <Card variant="outlined">
                  <CardContent>
                    <Box display="flex" alignItems="flex-start" justifyContent="space-between">
                      <Box>
                        <Typography variant="body2" color="text.secondary">Profit Target</Typography>
                        <Typography variant="h6" component="div">
                          {formatPercentage(challengeProgress.phaseProfitPercent)}
                        </Typography>
                      </Box>
                      <Target size={20} color="primary" />
                    </Box>
                    <Box sx={{ mt: 2 }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={Math.min(100, challengeProgress.phaseProfitPercent)}
                        color="success"
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                <Card variant="outlined">
                  <CardContent>
                    <Box display="flex" alignItems="flex-start" justifyContent="space-between">
                      <Box>
                        <Typography variant="body2" color="text.secondary">Consistency (70%)</Typography>
                        <Typography variant="h6" component="div">
                          {formatPercentage(challengeProgress.consistency.profitableDaysPercent)}
                        </Typography>
                      </Box>
                      <TrendingUp size={20} color="success" />
                    </Box>
                    <Box sx={{ mt: 2 }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={challengeProgress.consistency.profitableDaysPercent}
                        color={challengeProgress.consistency.profitableDaysPercent >= 70 ? "success" : "warning"}
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                <Card variant="outlined">
                  <CardContent>
                    <Box display="flex" alignItems="flex-start" justifyContent="space-between">
                      <Box>
                        <Typography variant="body2" color="text.secondary">Max 2 Consecutive Losing Days</Typography>
                        <Typography variant="h6" component="div">
                          {challengeProgress.consecutiveLosingDaysCurrent}/2
                        </Typography>
                      </Box>
                      <AlertTriangle size={20} color="warning" />
                    </Box>
                    <Box sx={{ mt: 2 }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={(challengeProgress.consecutiveLosingDaysCurrent / 2) * 100}
                        color={challengeProgress.consecutiveLosingDaysCurrent >= 2 ? "error" : "warning"}
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                <Card variant="outlined">
                  <CardContent>
                    <Box display="flex" alignItems="flex-start" justifyContent="space-between">
                      <Box>
                        <Typography variant="body2" color="text.secondary">≤ 3 Losing Trades (7d)</Typography>
                        <Typography variant="h6" component="div">
                          {challengeProgress.losingTradesLast7Days}/3
                        </Typography>
                      </Box>
                      <Clock size={20} color="primary" />
                    </Box>
                    <Box sx={{ mt: 2 }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={Math.min(100, (challengeProgress.losingTradesLast7Days / 3) * 100)}
                        color={challengeProgress.losingTradesLast7Days >= 3 ? "error" : "warning"}
                        sx={{ height: 8, borderRadius: 4 }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Trade Table & Filters */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
              <Typography variant="h5" component="h2">Trade History</Typography>
              <Box display="flex" gap={2} flexWrap="wrap">
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Date Range</InputLabel>
                  <Select
                    value={tradeFilters.dateRange}
                    label="Date Range"
                    onChange={(e) => setTradeFilters(prev => ({ ...prev, dateRange: e.target.value }))}
                  >
                    <MenuItem value="7d">Last 7 days</MenuItem>
                    <MenuItem value="30d">Last 30 days</MenuItem>
                    <MenuItem value="90d">Last 90 days</MenuItem>
                    <MenuItem value="all">All time</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  size="small"
                  placeholder="Symbol filter"
                  value={tradeFilters.symbol}
                  onChange={(e) => setTradeFilters(prev => ({ ...prev, symbol: e.target.value }))}
                  sx={{ minWidth: 120 }}
                />
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Result</InputLabel>
                  <Select
                    value={tradeFilters.result}
                    label="Result"
                    onChange={(e) => setTradeFilters(prev => ({ ...prev, result: e.target.value }))}
                  >
                    <MenuItem value="all">All results</MenuItem>
                    <MenuItem value="win">Wins only</MenuItem>
                    <MenuItem value="loss">Losses only</MenuItem>
                  </Select>
                </FormControl>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={tradeFilters.flaggedOnly}
                      onChange={(e) => setTradeFilters(prev => ({ ...prev, flaggedOnly: e.target.checked }))}
                    />
                  }
                  label="Flagged only"
                />
              </Box>
            </Box>

                      <div className={styles.tradeTable}>
              {tradeHistory.length > 0 ? (
                <TableContainer component={Paper} variant="outlined">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Symbol</TableCell>
                        <TableCell>Side</TableCell>
                        <TableCell>Lot</TableCell>
                        <TableCell>P/L</TableCell>
                        <TableCell>Open Time</TableCell>
                        <TableCell>Close Time</TableCell>
                        <TableCell>Duration</TableCell>
                        <TableCell>Flags</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {tradeHistory.map(trade => (
                        <TableRow key={trade.id}>
                          <TableCell>{trade.symbol}</TableCell>
                          <TableCell>
                            <Chip 
                              label={trade.side.toUpperCase()} 
                              color={trade.side === 'buy' ? 'success' : 'error'}
                              size="small"
                            />
                          </TableCell>
                          <TableCell>{trade.lot}</TableCell>
                          <TableCell>
                            <Typography 
                              color={trade.plAmount >= 0 ? 'success.main' : 'error.main'}
                              fontWeight="bold"
                            >
                              {formatCurrency(trade.plAmount)} ({formatPercentage(trade.plPercent)})
                            </Typography>
                          </TableCell>
                          <TableCell>{new Date(trade.openTime).toLocaleString()}</TableCell>
                          <TableCell>{new Date(trade.closeTime).toLocaleString()}</TableCell>
                          <TableCell>{Math.floor(trade.durationSec / 60)}m</TableCell>
                          <TableCell>
                            {trade.slPlacedAtSec > 10 && <Chip label="SL > 10s" color="error" size="small" sx={{ mr: 0.5 }} />}
                            {trade.durationSec < 600 && <Chip label="Scalping" color="warning" size="small" />}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Box 
                  display="flex" 
                  flexDirection="column" 
                  alignItems="center" 
                  justifyContent="center" 
                  sx={{ py: 6, color: 'text.secondary' }}
                >
                  <FileText size={48} sx={{ mb: 2, opacity: 0.5 }} />
                  <Typography>
                    No trades yet. First trade due in {48 - complianceFlags.inactivityRisk.hoursSinceLastTrade}h to satisfy 48h rule.
                  </Typography>
                </Box>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Footer Notes */}
        <Card>
          <CardContent>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Globe size={20} color="primary" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">UTC Time</Typography>
                    <Typography variant="body2" fontWeight="bold">{new Date().toISOString().slice(11, 19)}</Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Globe size={20} color="primary" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">IST Time</Typography>
                    <Typography variant="body2" fontWeight="bold">{new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' })}</Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Calendar size={20} color="primary" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">Weekend Rule</Typography>
                    <Typography variant="body2" fontWeight="bold">Flat by Friday 21:00 UTC</Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Smartphone size={20} color="primary" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">Device Policy</Typography>
                    <Typography variant="body2" fontWeight="bold">Single device & IP required</Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
