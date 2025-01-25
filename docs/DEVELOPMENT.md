# Development Guide

## Development Environment

### Prerequisites
- Node.js 18+
- npm 8+
- Git
- VS Code (recommended)

### VS Code Extensions
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript and JavaScript Language Features
- GitLens

### Environment Setup

1. **Clone the Repository**
```bash
git clone https://github.com/yourusername/churn-prediction-frontend.git
cd churn-prediction-frontend
```

2. **Install Dependencies**
```bash
npm install
```

3. **Set Up Environment Variables**
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Development Workflow

### Branch Strategy

- `main`: Production-ready code
- `develop`: Development branch
- Feature branches: `feature/feature-name`
- Bug fixes: `fix/bug-name`
- Releases: `release/v1.x.x`

### Creating a New Feature

1. **Create a Feature Branch**
```bash
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name
```

2. **Development Process**
- Write code following style guide
- Add tests
- Update documentation
- Keep commits atomic

3. **Commit Messages**
```
feat: add customer risk score visualization

- Add RiskScoreCard component
- Implement risk trend chart
- Add risk score tooltips
```

4. **Pull Request Process**
- Update branch with develop
- Run tests and linting
- Create PR with description
- Request review
- Address feedback

### Code Style Guide

#### TypeScript
```typescript
// Use interfaces for object types
interface CustomerData {
  id: number;
  name: string;
  riskScore: number;
}

// Use type for unions/intersections
type RiskLevel = 'low' | 'medium' | 'high';

// Use proper naming
const calculateRiskScore = (customer: CustomerData): number => {
  // Implementation
};

// Use async/await
const fetchCustomerData = async (id: number): Promise<CustomerData> => {
  try {
    const response = await ApiService.getCustomer(id);
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};
```

#### React Components
```typescript
// Use functional components
const CustomerCard: React.FC<CustomerCardProps> = ({ 
  customer,
  onUpdate 
}) => {
  // State hooks at the top
  const [isLoading, setIsLoading] = useState(false);
  
  // Use custom hooks
  const { data, error } = useCustomerData(customer.id);
  
  // Event handlers
  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      await onUpdate(customer);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Render methods
  return (
    <Card>
      {/* Component JSX */}
    </Card>
  );
};
```

### Testing

#### Unit Tests
```typescript
describe('RiskScoreCalculator', () => {
  it('calculates risk score correctly', () => {
    const customer = {
      credit_score: 750,
      balance: 100000,
      is_active: true
    };
    
    const score = calculateRiskScore(customer);
    expect(score).toBeBetween(0, 1);
  });
  
  it('handles edge cases', () => {
    const emptyCustomer = {};
    expect(() => calculateRiskScore(emptyCustomer)).toThrow();
  });
});
```

#### Integration Tests
```typescript
describe('CustomerManagement', () => {
  it('creates and updates customer', async () => {
    const { getByText, getByLabelText } = render(<CustomerForm />);
    
    // Fill form
    fireEvent.change(getByLabelText('Name'), {
      target: { value: 'John Doe' }
    });
    
    // Submit form
    fireEvent.click(getByText('Submit'));
    
    // Assert
    await waitFor(() => {
      expect(getByText('Customer created')).toBeInTheDocument();
    });
  });
});
```

### Performance Optimization

#### Component Optimization
```typescript
// Use memo for expensive renders
const CustomerMetrics = React.memo(({ data }: CustomerMetricsProps) => {
  return (
    // Component JSX
  );
});

// Use callbacks for event handlers
const CustomerList = () => {
  const handleSort = useCallback((column: string) => {
    // Sort implementation
  }, []);
  
  return (
    // Component JSX
  );
};
```

#### Data Fetching
```typescript
// Use proper caching
const useCustomerData = (id: number) => {
  return useQuery(['customer', id], () => 
    ApiService.getCustomer(id), {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 30 * 60 * 1000 // 30 minutes
    }
  );
};
```

### Error Handling

#### Global Error Boundary
```typescript
class ErrorBoundary extends React.Component<Props, State> {
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }
    return this.props.children;
  }
}
```

#### API Error Handling
```typescript
const handleApiError = (error: unknown) => {
  if (error instanceof ApiError) {
    toast({
      title: 'API Error',
      description: error.message,
      variant: 'destructive'
    });
  } else {
    // Handle other types of errors
  }
};
```

### Documentation

#### Component Documentation
```typescript
/**
 * Displays a customer's risk score with visual indicators
 * 
 * @param customer - The customer data object
 * @param showTrend - Whether to show risk trend
 * @param onUpdate - Callback when risk score updates
 */
const RiskScoreDisplay: React.FC<RiskScoreProps> = ({
  customer,
  showTrend = false,
  onUpdate
}) => {
  // Implementation
};
```

#### API Documentation
```typescript
/**
 * Fetches customer risk data with optional filters
 * 
 * @param filters - Optional filters for the query
 * @returns Promise resolving to customer risk data
 * @throws {ApiError} When API request fails
 */
const getRiskData = async (filters?: RiskFilters): Promise<RiskData> => {
  // Implementation
};
```

## Deployment

### Build Process
```bash
# Production build
npm run build

# Type checking
npm run type-check

# Linting
npm run lint

# Run all checks
npm run verify
```

### Environment Variables
```env
# Production
NEXT_PUBLIC_API_URL=https://api.production.com
NODE_ENV=production

# Development
NEXT_PUBLIC_API_URL=http://localhost:8000
NODE_ENV=development
```

### Pre-deployment Checklist
- [ ] All tests passing
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] Documentation updated
- [ ] Environment variables set
- [ ] Performance metrics checked
- [ ] Browser testing completed

## Troubleshooting

### Common Issues

1. **Build Failures**
```bash
# Clear cache
npm cache clean --force
rm -rf .next
npm install
```

2. **Type Errors**
```bash
# Regenerate TypeScript types
npm run generate-types
```

3. **API Connection Issues**
- Check API URL in environment variables
- Verify CORS settings
- Check network connectivity

### Getting Help
- Check documentation
- Search issue tracker
- Ask in team chat
- Create detailed bug report 