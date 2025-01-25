# Setup Guide

This guide will help you set up the Customer Churn Prediction & Risk Monitoring System for development and production environments.

## Prerequisites

- Node.js 18+ and npm
- Python 3.8+
- PostgreSQL 13+
- Git

## Frontend Setup

1. **Clone the Repository**
```bash
git clone https://github.com/yourusername/churn-prediction-frontend.git
cd churn-prediction-frontend
```

2. **Install Dependencies**
```bash
npm install
```

3. **Environment Configuration**
```bash
# Copy the example environment file
cp .env.example .env.local

# Edit .env.local with your settings
NEXT_PUBLIC_API_URL=http://localhost:8000
```

4. **Start Development Server**
```bash
npm run dev
```

5. **Build for Production**
```bash
npm run build
npm start
```

## Backend Setup

1. **Clone the Backend Repository**
```bash
git clone https://github.com/yourusername/churn-prediction-backend.git
cd churn-prediction-backend
```

2. **Create Python Virtual Environment**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install Python Dependencies**
```bash
pip install -r requirements.txt
```

4. **Database Setup**
```bash
# Create PostgreSQL database
createdb churn_prediction

# Run migrations
alembic upgrade head
```

5. **Environment Configuration**
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your settings
DATABASE_URL=postgresql://username:password@localhost/churn_prediction
SECRET_KEY=your-secret-key
```

6. **Start Backend Server**
```bash
uvicorn app.main:app --reload
```

## ML Model Setup

1. **Train Initial Model**
```bash
python scripts/train_model.py
```

2. **Verify Model**
```bash
python scripts/verify_model.py
```

## Development Tools

### Code Quality Tools

1. **Install ESLint and Prettier**
```bash
npm install --save-dev eslint prettier
```

2. **Install Python Development Tools**
```bash
pip install black flake8 mypy
```

3. **Run Linters**
```bash
# Frontend
npm run lint

# Backend
flake8 app
black app
mypy app
```

### Testing

1. **Run Frontend Tests**
```bash
npm test
```

2. **Run Backend Tests**
```bash
pytest
```

## Production Deployment

### Frontend Deployment

1. **Build the Application**
```bash
npm run build
```

2. **Configure Environment Variables**
- Set `NODE_ENV=production`
- Configure API URL
- Set other production variables

3. **Start the Server**
```bash
npm start
```

### Backend Deployment

1. **Configure Production Database**
```bash
# Set up production database
createdb churn_prediction_prod

# Run migrations
alembic upgrade head
```

2. **Configure Environment Variables**
- Set `ENVIRONMENT=production`
- Configure database URL
- Set security keys and tokens

3. **Start Production Server**
```bash
gunicorn app.main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker
```

## Monitoring Setup

1. **Configure Logging**
```bash
# Set up logging configuration
cp logging.conf.example logging.conf
```

2. **Set Up Monitoring Tools**
- Configure error tracking (e.g., Sentry)
- Set up performance monitoring
- Configure alert notifications

## Troubleshooting

### Common Issues

1. **Database Connection Issues**
- Verify PostgreSQL is running
- Check database credentials
- Ensure database exists

2. **API Connection Issues**
- Verify API URL in frontend environment
- Check CORS settings
- Verify network connectivity

3. **Build Issues**
- Clear npm cache: `npm cache clean --force`
- Delete node_modules and reinstall
- Check Node.js version compatibility

### Getting Help

- Check the [FAQ](FAQ.md)
- Review [Common Issues](COMMON_ISSUES.md)
- Open an issue on GitHub
- Contact the development team 