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
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import ReactApexChart from 'react-apexcharts';
import AnimatedSection from '../../components/AnimatedSection/AnimatedSection';
import styles from './Dashboard.module.css';
import {
  DashboardHeader,
  NewsLockoutBanner,
  ProgressCards,
  EquityCurveChart,
  CompliancePanel,
  TradeHistory
} from './components';
import { formatCurrency, formatPercentage, formatTimeAgo } from './utils/formatters';

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
      { time: '2024-01-15T00:00:00Z', equity: 25000 }, // Start from funded amount
      { time: '2024-01-16T00:00:00Z', equity: 24800 }, // Small loss
      { time: '2024-01-17T00:00:00Z', equity: 24900 }, // Small gain
      { time: '2024-01-18T00:00:00Z', equity: 25200 }, // Profit
      { time: '2024-01-19T00:00:00Z', equity: 25100 }, // Small profit
      { time: '2024-01-20T00:00:00Z', equity: 25300 }, // More profit
      { time: '2024-01-21T00:00:00Z', equity: 25400 }, // Continued profit
      { time: '2024-01-22T00:00:00Z', equity: 25250 } // Current equity
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

  // Calculate equity range for chart
  const minEquity = Math.min(...equityCurve.map(item => item.equity));
  const maxEquity = Math.max(...equityCurve.map(item => item.equity));

  return (
    <div className={styles.dashboardPage}>
      <div className={styles.container}>
        <DashboardHeader 
          accountSummary={accountSummary}
          lastUpdated={lastUpdated}
          onRefresh={handleManualRefresh}
          getStatusIcon={getStatusIcon}
        />

        <NewsLockoutBanner nextLockout={newsLockouts.nextLockout} />

        <ProgressCards 
          accountSummary={accountSummary}
          dayMetrics={dayMetrics}
          challengeProgress={challengeProgress}
        />

        {/* Compliance Overview Chart */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Typography variant="h5" component="h2" sx={{ mb: 3 }}>Compliance Overview</Typography>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Stop Loss Compliance</Typography>
                <Box sx={{ height: 200 }}>
                  <PieChart width={200} height={200}>
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
                  </PieChart>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Daily Performance</Typography>
                <Box sx={{ height: 200 }}>
                  <BarChart
                    width={200}
                    height={200}
                    data={[
                      { metric: 'Daily Loss', value: dayMetrics.dailyLossPercent, target: accountSummary.maxDailyLossPercent }
                    ]}
                  >
                    <Bar dataKey="value" fill="#f44336" />
                    <Bar dataKey="target" fill="#9e9e9e" />
                  </BarChart>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <EquityCurveChart 
          equityCurve={equityCurve}
          accountSummary={accountSummary}
          selectedTimeframe={selectedTimeframe}
          onTimeframeChange={setSelectedTimeframe}
          minEquity={minEquity}
        />

        <CompliancePanel 
          complianceFlags={complianceFlags}
          tradeHistory={tradeHistory}
          lastUpdated={lastUpdated}
          accountSummary={accountSummary}
          dayMetrics={dayMetrics}
        />

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

        <TradeHistory 
          tradeHistory={tradeHistory}
          tradeFilters={tradeFilters}
          onTradeFiltersChange={setTradeFilters}
          complianceFlags={complianceFlags}
        />

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
