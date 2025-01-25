# DevOps Guide

## Infrastructure as Code (IaC)

### Terraform Configuration

```hcl
# main.tf
provider "aws" {
  region = "us-west-2"
}

module "vpc" {
  source = "./modules/vpc"
  # VPC configuration
}

module "ecs" {
  source = "./modules/ecs"
  # ECS configuration
}

module "rds" {
  source = "./modules/rds"
  # RDS configuration
}
```

### Kubernetes Manifests

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: churn-prediction-frontend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
      - name: frontend
        image: churn-prediction-frontend:latest
        ports:
        - containerPort: 3000
```

## CI/CD Pipeline

### GitHub Actions Workflow

```yaml
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run lint
      - run: npm run test
      - run: npm run build

  deploy-staging:
    needs: test
    if: github.ref == 'refs/heads/develop'
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to staging
        run: |
          # Staging deployment steps

  deploy-production:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to production
        run: |
          # Production deployment steps
```

## Container Management

### Docker Compose (Development)

```yaml
# docker-compose.yml
version: '3.8'
services:
  frontend:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
    volumes:
      - .:/app
      - /app/node_modules

  backend:
    build: ../backend
    ports:
      - "8000:8000"
    environment:
      - POSTGRES_HOST=db
    depends_on:
      - db

  db:
    image: postgres:13
    environment:
      - POSTGRES_DB=churn_prediction
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### Production Kubernetes Configuration

```yaml
# kubernetes/
├── frontend/
│   ├── deployment.yaml
│   ├── service.yaml
│   └── ingress.yaml
├── backend/
│   ├── deployment.yaml
│   ├── service.yaml
│   └── configmap.yaml
└── database/
    ├── statefulset.yaml
    └── persistent-volume.yaml
```

## Monitoring & Observability

### Prometheus Configuration

```yaml
# prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'frontend'
    static_configs:
      - targets: ['localhost:3000']
    metrics_path: '/metrics'

  - job_name: 'backend'
    static_configs:
      - targets: ['localhost:8000']
    metrics_path: '/metrics'
```

### Grafana Dashboard

```json
{
  "dashboard": {
    "panels": [
      {
        "title": "Request Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(http_requests_total[5m])"
          }
        ]
      },
      {
        "title": "Error Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(http_errors_total[5m])"
          }
        ]
      }
    ]
  }
}
```

## Logging

### ELK Stack Configuration

```yaml
# docker-compose.logging.yml
version: '3.8'
services:
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:7.9.3
    environment:
      - discovery.type=single-node
    ports:
      - "9200:9200"

  logstash:
    image: docker.elastic.co/logstash/logstash:7.9.3
    volumes:
      - ./logstash/pipeline:/usr/share/logstash/pipeline
    depends_on:
      - elasticsearch

  kibana:
    image: docker.elastic.co/kibana/kibana:7.9.3
    ports:
      - "5601:5601"
    depends_on:
      - elasticsearch
```

## Automation Scripts

### Database Backup

```bash
#!/bin/bash
# backup-db.sh

# Configuration
DB_NAME="churn_prediction"
BACKUP_DIR="/backups/postgres"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup
pg_dump $DB_NAME > $BACKUP_DIR/backup_$DATE.sql

# Cleanup old backups (keep last 7 days)
find $BACKUP_DIR -type f -mtime +7 -delete
```

### Deployment Script

```bash
#!/bin/bash
# deploy.sh

# Configuration
ENV=$1
DOCKER_REGISTRY="your-registry.azurecr.io"
APP_NAME="churn-prediction-frontend"

# Build and push Docker image
docker build -t $DOCKER_REGISTRY/$APP_NAME:$VERSION .
docker push $DOCKER_REGISTRY/$APP_NAME:$VERSION

# Update Kubernetes deployment
kubectl set image deployment/$APP_NAME \
  $APP_NAME=$DOCKER_REGISTRY/$APP_NAME:$VERSION
```

## Security

### Network Policies

```yaml
# network-policy.yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: frontend-policy
spec:
  podSelector:
    matchLabels:
      app: frontend
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: ingress-nginx
    ports:
    - protocol: TCP
      port: 3000
```

### Secret Management

```yaml
# sealed-secrets.yaml
apiVersion: bitnami.com/v1alpha1
kind: SealedSecret
metadata:
  name: app-secrets
spec:
  encryptedData:
    API_KEY: AgBy8hHF3...
    DB_PASSWORD: AgDD4hPL9...
```

## Disaster Recovery

### Backup Strategy

1. **Application State**
```bash
# Backup Kubernetes state
kubectl get all -A -o yaml > cluster-backup.yaml

# Backup Persistent Volumes
velero backup create app-backup --include-namespaces=production
```

2. **Database Backup**
```bash
# Automated backup script
0 2 * * * /scripts/backup-db.sh >> /var/log/backup.log 2>&1
```

### Recovery Procedures

1. **Application Recovery**
```bash
# Restore Kubernetes state
kubectl apply -f cluster-backup.yaml

# Restore Persistent Volumes
velero restore create --from-backup app-backup
```

2. **Database Recovery**
```bash
# Restore from backup
psql churn_prediction < backup_20240101_020000.sql
```

## Performance Optimization

### Resource Limits

```yaml
# resource-limits.yaml
apiVersion: v1
kind: LimitRange
metadata:
  name: resource-limits
spec:
  limits:
  - default:
      memory: 512Mi
      cpu: 500m
    defaultRequest:
      memory: 256Mi
      cpu: 250m
    type: Container
```

### Horizontal Pod Autoscaling

```yaml
# hpa.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: frontend-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: frontend
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 80
```

## Maintenance

### Health Checks

```yaml
# health-check.yaml
livenessProbe:
  httpGet:
    path: /health
    port: 3000
  initialDelaySeconds: 30
  periodSeconds: 10

readinessProbe:
  httpGet:
    path: /ready
    port: 3000
  initialDelaySeconds: 5
  periodSeconds: 5
```

### Automated Updates

```yaml
# flux-automation.yaml
apiVersion: source.toolkit.fluxcd.io/v1beta2
kind: GitRepository
metadata:
  name: frontend-source
spec:
  interval: 1m
  url: https://github.com/yourusername/churn-prediction-frontend
  ref:
    branch: main
```

## Best Practices

1. **Infrastructure**
   - Use Infrastructure as Code (IaC)
   - Implement proper versioning
   - Maintain environment parity
   - Regular security updates

2. **CI/CD**
   - Automated testing
   - Continuous deployment
   - Environment-specific configurations
   - Rollback capabilities

3. **Monitoring**
   - Real-time alerting
   - Performance metrics
   - Log aggregation
   - Error tracking

4. **Security**
   - Regular security scans
   - Secret management
   - Network policies
   - Access control 