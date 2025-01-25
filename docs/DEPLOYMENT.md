# Deployment Guide

This guide covers the deployment process for the Customer Churn Prediction & Risk Monitoring System in different environments.

## Prerequisites

- Node.js 18+
- npm 8+
- Access to deployment environment
- Environment variables configured
- SSL certificates (for production)

## Deployment Environments

### Development

1. **Environment Setup**
```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NODE_ENV=development
```

2. **Start Development Server**
```bash
npm run dev
```

### Staging

1. **Environment Configuration**
```bash
# Create staging environment file
cp .env.example .env.staging
```

Edit `.env.staging`:
```env
NEXT_PUBLIC_API_URL=https://api.staging.example.com
NODE_ENV=production
```

2. **Build and Start**
```bash
# Build for staging
npm run build

# Start staging server
npm run start
```

### Production

1. **Environment Configuration**
```bash
# Create production environment file
cp .env.example .env.production
```

Edit `.env.production`:
```env
NEXT_PUBLIC_API_URL=https://api.production.example.com
NODE_ENV=production
```

2. **Production Build**
```bash
# Install dependencies
npm ci

# Build application
npm run build

# Start production server
npm run start
```

## Deployment Methods

### 1. Docker Deployment

#### Dockerfile
```dockerfile
# Base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy application files
COPY . .

# Build application
RUN npm run build

# Expose port
EXPOSE 3000

# Start application
CMD ["npm", "start"]
```

#### Docker Compose
```yaml
version: '3.8'
services:
  frontend:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_API_URL=https://api.example.com
```

#### Deploy with Docker
```bash
# Build image
docker build -t churn-prediction-frontend .

# Run container
docker run -p 3000:3000 churn-prediction-frontend
```

### 2. Cloud Platform Deployment

#### Vercel Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel
```

#### AWS Deployment

1. **Build for AWS**
```bash
# Build application
npm run build

# Prepare for AWS
zip -r deployment.zip .next package.json next.config.js public
```

2. **Deploy to Elastic Beanstalk**
- Upload `deployment.zip` to Elastic Beanstalk
- Configure environment variables
- Set up domain and SSL

### 3. Traditional Server Deployment

1. **Server Setup**
```bash
# Install Node.js
curl -sL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
npm install -g pm2
```

2. **Application Deployment**
```bash
# Clone repository
git clone https://github.com/yourusername/churn-prediction-frontend.git
cd churn-prediction-frontend

# Install dependencies
npm ci

# Build application
npm run build

# Start with PM2
pm2 start npm --name "churn-frontend" -- start
```

## SSL Configuration

### Using Nginx as Reverse Proxy

```nginx
server {
    listen 443 ssl;
    server_name example.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Monitoring & Logging

### Application Monitoring

1. **Setup Application Monitoring**
```javascript
// monitoring.js
const setupMonitoring = () => {
  // Configure monitoring service
  if (process.env.NODE_ENV === 'production') {
    // Initialize monitoring
  }
};
```

2. **Error Tracking**
```javascript
// Configure error tracking
if (process.env.NODE_ENV === 'production') {
  window.onerror = function(msg, url, lineNo, columnNo, error) {
    // Log error to monitoring service
    return false;
  };
}
```

### Performance Monitoring

1. **Setup Performance Monitoring**
```javascript
// Monitor page load performance
export function reportWebVitals(metric) {
  if (process.env.NODE_ENV === 'production') {
    // Send metrics to analytics service
  }
}
```

## Backup & Recovery

### Backup Strategy

1. **Code Backup**
- GitHub repository
- Regular backups of environment configurations
- Documentation versioning

2. **Data Backup**
- Regular database backups
- Environment variable backups
- SSL certificate backups

### Recovery Procedures

1. **Application Recovery**
```bash
# Restore from backup
git clone [backup-repo]
npm ci
npm run build

# Restore environment variables
cp backup.env .env.production

# Restart application
pm2 restart all
```

## Security Considerations

### Security Checklist

1. **Application Security**
- [ ] SSL/TLS enabled
- [ ] Security headers configured
- [ ] CORS policies set
- [ ] Rate limiting enabled
- [ ] Input validation
- [ ] XSS protection
- [ ] CSRF protection

2. **Server Security**
- [ ] Firewall configured
- [ ] Regular security updates
- [ ] Access logs enabled
- [ ] Intrusion detection
- [ ] DDoS protection

### Security Headers

```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains'
          }
        ]
      }
    ]
  }
}
```

## Troubleshooting

### Common Deployment Issues

1. **Build Failures**
```bash
# Clear build cache
rm -rf .next
npm cache clean --force
npm ci
npm run build
```

2. **Runtime Errors**
- Check environment variables
- Verify API connectivity
- Check server logs
- Monitor error tracking

3. **Performance Issues**
- Analyze server metrics
- Check resource utilization
- Monitor response times
- Review error logs

### Rollback Procedure

```bash
# Switch to last known good version
git checkout [last-good-commit]

# Rebuild and restart
npm ci
npm run build
pm2 restart all
```

## Maintenance

### Regular Maintenance Tasks

1. **Daily**
- Monitor error logs
- Check application health
- Review performance metrics

2. **Weekly**
- Update dependencies
- Backup configurations
- Review security alerts

3. **Monthly**
- Full system backup
- Security audit
- Performance optimization
- Update documentation 