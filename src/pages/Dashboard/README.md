# Dashboard Component

## Overview
The Dashboard component provides a comprehensive real-time tracking interface for users' funded trading challenges. It displays progress metrics, compliance status, and rule enforcement in an intuitive, responsive design.

## Features

### 1. Real-time Data Display
- **Account Summary**: Plan details, phase information, balance metrics
- **Progress Tracking**: Profit targets, daily loss limits, consistency metrics
- **Live Compliance**: Real-time rule compliance monitoring
- **Trade History**: Comprehensive trade logging with filtering

### 2. Key Metrics
- **Profit Target Progress**: Visual progress bars for phase objectives
- **Daily Loss Monitoring**: Real-time tracking against 2% daily limit
- **Overall Drawdown**: Peak-to-current equity tracking
- **Consistency Score**: Profitable days percentage (target: 70%)

### 3. Compliance Monitoring
- **Stop Loss Compliance**: 10-second placement tracking
- **Position Limits**: Single position enforcement
- **Correlation Exposure**: 25% limit monitoring
- **Scalping Detection**: <10 minute trade flagging
- **Activity Rules**: 48-hour trading requirements
- **Weekend Rules**: Friday 21:00 UTC flat requirement

### 4. Phase Requirements
- **Phase 1**: 40 days, +20% net, 70% profitable days
- **Phase 2**: 50 days, +10% net, ≥20 profitable days
- **Final Hold**: 15 consecutive days, zero breaches

## Data Structure

### Account Summary
```javascript
{
  accountId: string,
  plan: { name: string, size: number, currency: string },
  phase: { id: string, name: string, startedAt: string, daysElapsed: number },
  status: 'active' | 'on-hold' | 'passed' | 'failed',
  startBalance: number,
  currentEquity: number,
  openPositionsCount: number,
  correlatedExposurePercent: number
}
```

### Compliance Flags
```javascript
{
  stopLossPlacedWithin10s: { compliant: boolean, ratio: number },
  scalpingUnder10mDetected: { detected: boolean, count: number },
  weekendHoldRisk: boolean,
  correlationExceeded: boolean,
  inactivityRisk: { breached: boolean, warning: boolean, hoursSinceLastTrade: number }
}
```

## Usage

### Route
```
/dashboard/:username
```

### Component Import
```javascript
import Dashboard from './pages/Dashboard/Dashboard';
```

## Styling

The component uses CSS Modules with the following key classes:
- `.dashboardPage`: Main container styling
- `.progressCards`: Grid layout for metric cards
- `.compliancePanel`: Two-column compliance display
- `.phaseChecklist`: Phase requirement tracking
- `.tradeSection`: Trade history with filters

## Responsive Design

- **Desktop**: Full grid layouts with side-by-side panels
- **Tablet**: Stacked layouts with adjusted spacing
- **Mobile**: Single-column layouts with optimized touch targets

## Performance Features

- **Auto-refresh**: 30-second intervals for real-time updates
- **Skeleton Loading**: Smooth loading states
- **Memoized Calculations**: Optimized re-renders
- **Debounced Filters**: Efficient trade table filtering

## Integration Points

### Backend API
- `GET /dashboard/:username` - Main dashboard data
- Real-time updates via WebSocket (future implementation)

### Authentication
- Protected route requiring user authentication
- Username parameter validation

### Rules Integration
- Links to Rules page for detailed rule explanations
- Rule-specific compliance tracking

## Future Enhancements

1. **Real-time Charts**: Integration with charting libraries
2. **WebSocket Updates**: Live data streaming
3. **Advanced Filtering**: Date ranges, symbol groups
4. **Export Functionality**: PDF reports, CSV data
5. **Mobile App**: React Native companion app

## Testing

### Key Test Scenarios
- Daily loss breach detection
- Phase progression tracking
- Compliance rule enforcement
- Mobile responsiveness
- Data refresh functionality

### Mock Data
The component includes comprehensive mock data for development and testing purposes.

## Dependencies

- React Router for navigation
- Lucide React for icons
- CSS Modules for styling
- AnimatedSection for animations
- Custom hooks for data management
