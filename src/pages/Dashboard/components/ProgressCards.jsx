import React from 'react';
import { Card, CardContent, Typography, Box, Grid, LinearProgress } from '@mui/material';
import { TrendingUp, TrendingDown, Target, BarChart3 } from 'lucide-react';
import AnimatedSection from '../../../components/AnimatedSection/AnimatedSection';
import { formatPercentage } from '../utils/formatters';

const ProgressCards = ({ accountSummary, dayMetrics, challengeProgress }) => {
  return (
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
  );
};

export default ProgressCards;
