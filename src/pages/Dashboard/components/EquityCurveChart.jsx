import React from 'react';
import { Card, CardContent, Typography, Box, Button } from '@mui/material';
import { BarChart3 } from 'lucide-react';
import ReactApexChart from 'react-apexcharts';
import { formatCurrency } from '../utils/formatters';

const EquityCurveChart = ({ 
  equityCurve, 
  accountSummary, 
  selectedTimeframe, 
  onTimeframeChange,
  minEquity 
}) => {
  return (
    <Card sx={{ mb: 4 }}>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Box>
            <Typography variant="h5" component="h2">Equity Curve</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Funded Account: {formatCurrency(accountSummary.startBalance, accountSummary.plan.currency)} | 
              Current Equity: {formatCurrency(accountSummary.currentEquity, accountSummary.plan.currency)} | 
              P&L: {formatCurrency(accountSummary.currentEquity - accountSummary.startBalance, accountSummary.plan.currency)} 
              ({((accountSummary.currentEquity - accountSummary.startBalance) / accountSummary.startBalance * 100).toFixed(2)}%)
            </Typography>
          </Box>
          <Box display="flex" gap={1}>
            {['1D', '1W', '1M', 'All'].map(timeframe => (
              <Button
                key={timeframe}
                variant={selectedTimeframe === timeframe ? "contained" : "outlined"}
                size="small"
                onClick={() => onTimeframeChange(timeframe)}
              >
                {timeframe}
              </Button>
            ))}
          </Box>
        </Box>
        
        {equityCurve.length > 0 ? (
          <Box sx={{ height: 360, width: '100%' }}>
            <ReactApexChart
              type="area"
              options={{
                chart: {
                  type: 'area',
                  height: 320,
                  toolbar: { show: false },
                  zoom: { enabled: false },
                  animations: { enabled: true, easing: 'easeinout', speed: 800 },
                },
                dataLabels: { enabled: false },
                stroke: {
                  curve: 'smooth',
                  width: 2,
                  colors: ['#2563eb'],
                },
                xaxis: {
                  type: 'datetime',
                  labels: {
                    formatter: function(val) {
                      return new Date(val).toLocaleDateString();
                    }
                  },
                  tooltip: { enabled: false },
                },
                yaxis: {
                  labels: {
                    formatter: function(val) {
                      return formatCurrency(val);
                    }
                  },
                  min: Math.min(accountSummary.startBalance - 1000, minEquity - 500),
                  max: accountSummary.startBalance + 3000,
                  title: { text: 'Equity' },
                },
                fill: {
                  type: 'gradient',
                  gradient: {
                    shadeIntensity: 1,
                    type: 'vertical',
                    opacityFrom: 0.6,
                    opacityTo: 0.05,
                    colorStops: [
                      { offset: 0, color: minEquity < accountSummary.startBalance ? '#ff3143' : '#10a367', opacity: 0.6 },
                      { offset: 100, color: minEquity < accountSummary.startBalance ? '#ff3143' : '#10a367', opacity: 0.05 }
                    ]
                  }
                },
                colors: [minEquity < accountSummary.startBalance ? '#ff3143' : '#10a367'],
                tooltip: {
                  x: { format: 'dd MMM yyyy' },
                  y: {
                    formatter: function(val) {
                      return formatCurrency(val);
                    },
                  },
                  marker: { show: false },
                },
                markers: {
                  size: 4,
                  colors: ['#2563eb'],
                  strokeColors: '#ffffff',
                  strokeWidth: 2,
                  hover: { size: 6 },
                },
                grid: {
                  show: true,
                  borderColor: '#e0e0e0',
                  strokeDashArray: 5,
                  position: 'back',
                },
                legend: { show: false },
                annotations: {
                  yaxis: [
                    {
                      y: accountSummary.startBalance,
                      borderColor: '#6b7280',
                      borderWidth: 1,
                      strokeDashArray: 5,
                      label: {
                        borderColor: '#6b7280',
                        style: { color: '#6b7280', background: 'transparent' },
                        text: `Baseline: ${formatCurrency(accountSummary.startBalance)}`,
                      },
                    },
                  ],
                },
              }}
              series={[
                {
                  name: 'Equity',
                  data: equityCurve.map(item => ({
                    x: new Date(item.time).getTime(),
                    y: item.equity
                  }))
                }
              ]}
            />
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
        
        {/* Color Legend */}
        <Box display="flex" justifyContent="center" alignItems="center" gap={3} sx={{ mt: 2 }}>
          <Box display="flex" alignItems="center" gap={1}>
            <Box 
              sx={{ 
                width: 16, 
                height: 16, 
                backgroundColor: '#10a367',
                borderRadius: '2px'
              }} 
            />
            <Typography variant="caption" color="text.secondary">
              Above baseline (profit zone)
            </Typography>
          </Box>
          {minEquity < accountSummary.startBalance && (
            <Box display="flex" alignItems="center" gap={1}>
              <Box 
                sx={{ 
                  width: 16, 
                  height: 16, 
                  backgroundColor: '#ff3143',
                  borderRadius: '2px'
                }} 
              />
              <Typography variant="caption" color="text.secondary">
                Below baseline (loss zone)
              </Typography>
            </Box>
          )}
          <Box display="flex" alignItems="center" gap={1}>
            <Box 
              sx={{ 
                width: 16, 
                height: 16, 
                border: '1px dashed #6b7280',
                borderRadius: '2px'
              }} 
            />
            <Typography variant="caption" color="text.secondary">
              Baseline ({formatCurrency(accountSummary.startBalance)})
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default EquityCurveChart;
