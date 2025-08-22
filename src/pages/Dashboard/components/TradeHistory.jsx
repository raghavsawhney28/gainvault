import React from 'react';
import { Card, CardContent, Typography, Box, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem, FormControl, InputLabel, TextField, Checkbox, FormControlLabel, Chip } from '@mui/material';
import { FileText } from 'lucide-react';
import { formatCurrency, formatPercentage } from '../utils/formatters';

const TradeHistory = ({ tradeHistory, tradeFilters, onTradeFiltersChange, complianceFlags }) => {
  return (
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
                onChange={(e) => onTradeFiltersChange({ ...tradeFilters, dateRange: e.target.value })}
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
              onChange={(e) => onTradeFiltersChange({ ...tradeFilters, symbol: e.target.value })}
              sx={{ minWidth: 120 }}
            />
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Result</InputLabel>
              <Select
                value={tradeFilters.result}
                label="Result"
                onChange={(e) => onTradeFiltersChange({ ...tradeFilters, result: e.target.value })}
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
                  onChange={(e) => onTradeFiltersChange({ ...tradeFilters, flaggedOnly: e.target.checked })}
                />
              }
              label="Flagged only"
            />
          </Box>
        </Box>

        <div className="tradeTable">
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
  );
};

export default TradeHistory;
