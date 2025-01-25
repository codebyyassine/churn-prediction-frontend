# API Documentation

## Base URL

```
http://localhost:8000/api
```

## Authentication

The API uses Basic Authentication. Include credentials in the Authorization header:

```
Authorization: Basic base64(username:password)
```

## Endpoints

### Customer Management

#### Get Customers
```http
GET /customers/
```

Query Parameters:
- `page`: Page number (default: 1)
- `page_size`: Items per page (default: 10)
- `geography`: Filter by geography
- `gender`: Filter by gender
- `min_age`: Minimum age
- `max_age`: Maximum age
- `min_credit_score`: Minimum credit score
- `max_credit_score`: Maximum credit score
- `min_balance`: Minimum balance
- `max_balance`: Maximum balance
- `exited`: Filter by churn status
- `has_cr_card`: Filter by credit card status
- `is_active_member`: Filter by active status
- `search`: Search term
- `ordering`: Sort field

Response:
```json
{
  "count": 100,
  "next": "http://localhost:8000/api/customers/?page=2",
  "previous": null,
  "results": [
    {
      "customer_id": 1,
      "surname": "Smith",
      "credit_score": 750,
      "geography": "France",
      "gender": "Female",
      "age": 35,
      "tenure": 5,
      "balance": 125000.00,
      "num_of_products": 2,
      "has_cr_card": true,
      "is_active_member": true,
      "estimated_salary": 75000.00,
      "exited": false
    }
  ]
}
```

#### Create Customer
```http
POST /customers/
```

Request Body:
```json
{
  "surname": "Smith",
  "credit_score": 750,
  "geography": "France",
  "gender": "Female",
  "age": 35,
  "tenure": 5,
  "balance": 125000.00,
  "num_of_products": 2,
  "has_cr_card": true,
  "is_active_member": true,
  "estimated_salary": 75000.00
}
```

#### Update Customer
```http
PUT /customers/{customer_id}/
```

Request Body: Same as Create Customer

#### Delete Customer
```http
DELETE /customers/{customer_id}/
```

### Risk Monitoring

#### Get Risk Dashboard
```http
GET /risk/dashboard/
```

Response:
```json
{
  "high_risk_customers": [
    {
      "customer_id": 1,
      "surname": "Smith",
      "risk_score": 0.85,
      "risk_change": 0.15
    }
  ],
  "risk_distribution": {
    "low_risk": 60,
    "medium_risk": 30,
    "high_risk": 10
  },
  "risk_trend": [
    {
      "date": "2024-01-01",
      "average_risk": 0.25
    }
  ]
}
```

#### Get Customer Risk Score
```http
GET /risk/monitoring/{customer_id}/
```

Response:
```json
{
  "customer_id": 1,
  "probability": 0.85,
  "risk_change": 0.15,
  "last_updated": "2024-01-01T12:00:00Z"
}
```

#### Get Batch Risk Scores
```http
GET /risk/monitoring/batch/?customer_ids=1,2,3
```

Response:
```json
[
  {
    "customer_id": 1,
    "probability": 0.85,
    "risk_change": 0.15
  }
]
```

### Alert Management

#### Get Alert Configuration
```http
GET /alerts/config/
```

Response:
```json
{
  "high_risk_threshold": 0.75,
  "risk_increase_threshold": 0.1,
  "notification_email": "alerts@example.com",
  "webhook_url": "https://example.com/webhook",
  "enabled": true
}
```

#### Update Alert Configuration
```http
POST /alerts/config/
```

Request Body:
```json
{
  "high_risk_threshold": 0.75,
  "risk_increase_threshold": 0.1,
  "notification_email": "alerts@example.com",
  "webhook_url": "https://example.com/webhook",
  "enabled": true
}
```

#### Get Alert History
```http
GET /alerts/history/
```

Query Parameters:
- `alert_type`: Filter by alert type (HIGH_RISK, RISK_INCREASE, SUMMARY)
- `start_date`: Filter by start date
- `end_date`: Filter by end date
- `status`: Filter by status (SUCCESS, FAILURE)

Response:
```json
{
  "results": [
    {
      "alert_id": 1,
      "alert_type": "HIGH_RISK",
      "customer_id": 1,
      "risk_score": 0.85,
      "created_at": "2024-01-01T12:00:00Z",
      "status": "SUCCESS"
    }
  ]
}
```

#### Get Alert Statistics
```http
GET /alerts/stats/
```

Response:
```json
{
  "total_alerts": 100,
  "successful_alerts": 95,
  "success_rate": 0.95,
  "alerts_by_type": {
    "HIGH_RISK": 40,
    "RISK_INCREASE": 35,
    "SUMMARY": 25
  },
  "recent_failures": [
    {
      "alert_id": 1,
      "alert_type": "HIGH_RISK",
      "error_message": "Failed to send email",
      "created_at": "2024-01-01T12:00:00Z"
    }
  ]
}
```

## Error Responses

The API uses standard HTTP status codes and returns error details in the response body:

```json
{
  "detail": "Error message describing what went wrong"
}
```

Common status codes:
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

## Rate Limiting

The API implements rate limiting per user:
- 100 requests per minute for authenticated users
- 10 requests per minute for unauthenticated users

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
``` 