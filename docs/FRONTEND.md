# Frontend Documentation

## Technology Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn UI
- **State Management**: React Hooks
- **API Integration**: Custom ApiService
- **Charts**: Recharts

## Project Structure

```
src/
├── app/                 # Next.js app router pages
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   ├── customer/       # Customer management components
│   ├── alerts/         # Alert system components
│   └── risk/           # Risk monitoring components
├── lib/                # Utilities and services
├── types/              # TypeScript type definitions
└── styles/             # Global styles
```

## Key Components

### Customer Management

#### `CustomerList`
- Displays paginated list of customers
- Features:
  - Advanced filtering
  - Sorting
  - Bulk operations
  - Risk score display
  - CSV import/export

```typescript
interface CustomerListProps {
  initialData?: Customer[]
  onCustomerSelect?: (customer: Customer) => void
}
```

#### `CustomerForm`
- Form for creating/editing customers
- Validation using react-hook-form
- Handles both create and update operations

### Risk Monitoring

#### `RiskDashboard`
- Main risk monitoring interface
- Features:
  - High-risk customer list
  - Risk distribution chart
  - Risk trend analysis
  - Risk increase alerts

```typescript
interface RiskDashboardProps {
  refreshInterval?: number
  showLegend?: boolean
}
```

#### `RiskScoreCard`
- Displays individual customer risk scores
- Shows risk change indicators
- Progress bar visualization

### Alert System

#### `AlertsTab`
- Main alerts management interface
- Contains:
  - Alert configuration
  - Alert history
  - Alert statistics

#### `AlertConfigForm`
- Configure alert thresholds
- Set up notifications
- Enable/disable alerts

#### `AlertHistory`
- Displays alert history
- Filtering by type and date
- Status indicators

## State Management

### Customer State
```typescript
interface CustomerState {
  customers: Customer[]
  loading: boolean
  error: string | null
  filters: CustomerFilters
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
  }
}
```

### Risk Monitoring State
```typescript
interface RiskState {
  dashboardData: RiskDashboardData | null
  loading: boolean
  error: string | null
  lastUpdated: Date | null
}
```

### Alert State
```typescript
interface AlertState {
  config: AlertConfig | null
  history: AlertHistory[]
  stats: AlertStats | null
  loading: boolean
  error: string | null
}
```

## API Integration

### ApiService
- Centralized API communication
- Authentication handling
- Error handling
- Response type safety

Example usage:
```typescript
const handleLoadCustomers = async () => {
  try {
    const data = await ApiService.getCustomers(filters)
    setCustomers(data.results)
  } catch (error) {
    handleError(error)
  }
}
```

## UI Components

### Common Components
- `Button`: Styled button with variants
- `Card`: Container component
- `Dialog`: Modal dialogs
- `Select`: Dropdown selection
- `Table`: Data table
- `Progress`: Progress bar
- `Badge`: Status indicators

### Charts
- `RiskDistributionChart`: Pie chart
- `RiskTrendChart`: Line chart
- `CustomerMetricsChart`: Bar chart

## Styling

### Tailwind Configuration
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {...},
        secondary: {...},
        // Custom colors
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    // Additional plugins
  ]
}
```

### Component Styling
```typescript
// Example styled component
const StyledCard = ({ children, className }: PropsWithChildren<{ className?: string }>) => (
  <div className={cn(
    "rounded-lg border bg-card text-card-foreground shadow-sm",
    className
  )}>
    {children}
  </div>
)
```

## Forms

### Form Validation
```typescript
const schema = z.object({
  surname: z.string().min(2),
  credit_score: z.number().min(300).max(850),
  // Additional validation rules
})

const { register, handleSubmit, errors } = useForm({
  resolver: zodResolver(schema)
})
```

### Error Handling
```typescript
const handleError = (error: unknown) => {
  const message = error instanceof Error 
    ? error.message 
    : 'An unexpected error occurred'
    
  toast({
    title: "Error",
    description: message,
    variant: "destructive"
  })
}
```

## Performance Optimization

### Code Splitting
- Dynamic imports for large components
- Lazy loading for routes
- Component-level code splitting

### Caching
- API response caching
- Static page generation
- Image optimization

### Monitoring
- Performance metrics tracking
- Error boundary implementation
- Loading state management

## Testing

### Component Testing
```typescript
describe('CustomerList', () => {
  it('renders customer data correctly', () => {
    render(<CustomerList />)
    // Test implementation
  })
})
```

### Integration Testing
```typescript
describe('Customer Management', () => {
  it('handles customer creation flow', async () => {
    // Test implementation
  })
})
```

## Best Practices

1. **Component Organization**
   - Single responsibility principle
   - Proper prop typing
   - Error boundary usage

2. **State Management**
   - Controlled component patterns
   - Custom hooks for logic
   - Proper error handling

3. **Performance**
   - Memoization where needed
   - Proper key usage in lists
   - Debounced search inputs

4. **Accessibility**
   - ARIA labels
   - Keyboard navigation
   - Color contrast compliance 