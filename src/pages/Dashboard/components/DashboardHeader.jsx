import React from 'react';
import { Card, CardContent, Typography, Box, Grid, Chip, Button } from '@mui/material';
import { RefreshCw, FileText, ExternalLink } from 'lucide-react';
import { formatCurrency, formatTimeAgo } from '../utils/formatters';

const DashboardHeader = ({ 
  accountSummary, 
  lastUpdated, 
  onRefresh, 
  getStatusIcon 
}) => {
  return (
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
                  onClick={onRefresh}
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
  );
};

export default DashboardHeader;
