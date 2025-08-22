import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { Calendar } from 'lucide-react';

const NewsLockoutBanner = ({ nextLockout }) => {
  if (!nextLockout) return null;

  return (
    <Card sx={{ mb: 4, bgcolor: 'warning.50', border: '1px solid', borderColor: 'warning.200' }}>
      <CardContent>
        <Box display="flex" alignItems="center" gap={2}>
          <Calendar size={24} color="warning" />
          <Box flex={1}>
            <Typography variant="h6" color="warning.dark">Upcoming Trading Lockout</Typography>
            <Typography variant="body1" color="warning.main">
              {nextLockout.eventName} - {nextLockout.impact} impact
            </Typography>
            <Typography variant="body2" color="warning.dark" sx={{ mt: 1 }}>
              Lockout: {new Date(nextLockout.windowStart).toLocaleString()} - {new Date(nextLockout.windowEnd).toLocaleString()}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default NewsLockoutBanner;
