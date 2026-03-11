# E2E Service System - API Documentation

## 1. Base URL

```
Development: http://localhost:3000/api
Production: https://api.e2e.com/api
```

## 2. Authentication

All endpoints require JWT token:

```
Authorization: Bearer <access_token>
X-Tenant-ID: <tenant_id>
```

## 3. Tenant Management (Super Admin)

### POST /api/admin/tenants
Create new tenant

**Request**:
```json
{
  "name": "Acme Corp",
  "subdomain": "acme",
  "plan": "Growth",
  "adminEmail": "admin@acme.com"
}
```

**Response**:
```json
{
  "id": "uuid",
  "name": "Acme Corp",
  "subdomain": "acme",
  "plan": "Growth",
  "status": "Active"
}
```

### GET /api/admin/tenants
List all tenants

**Response**:
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Acme Corp",
      "subdomain": "acme",
      "plan": "Growth",
      "activeUsers": 50
    }
  ]
}
```

## 4. Organization

### GET /api/organizations/:id
Get organization details

**Response**:
```json
{
  "id": "uuid",
  "tenantId": "uuid",
  "name": "Acme Corp",
  "industry": "Banking",
  "targets": {
    "complaints": -20,
    "csat": 2
  }
}
```

### PATCH /api/organizations/:id
Update organization

**Request**:
```json
{
  "targets": {
    "complaints": -25,
    "csat": 2.5
  }
}
```

## 5. Branches

### GET /api/branches
List branches

**Response**:
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Accra Main",
      "region": "Greater Accra",
      "staffCount": 25
    }
  ]
}
```

### POST /api/branches
Create branch

**Request**:
```json
{
  "name": "Kumasi Branch",
  "region": "Ashanti",
  "managerId": "uuid"
}
```

## 6. Users

### POST /api/users/import
Import users via CSV

**Request**: Multipart form-data with CSV file

**Response**:
```json
{
  "imported": 50,
  "failed": 2,
  "errors": [
    {"row": 5, "error": "Invalid email"}
  ]
}
```

### GET /api/users
List users

**Query Parameters**:
- `branchId` (optional)
- `role` (optional)

**Response**:
```json
{
  "data": [
    {
      "id": "uuid",
      "email": "john@acme.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "Manager",
      "branchId": "uuid"
    }
  ]
}
```

## 7. Sessions

### POST /api/sessions
Create session

**Request**:
```json
{
  "type": "Huddle",
  "title": "Daily Check-in",
  "scheduledAt": "2024-01-20T09:00:00Z",
  "durationMin": 15,
  "branchId": "uuid",
  "attendees": ["user-uuid-1", "user-uuid-2"]
}
```

### GET /api/sessions
List sessions

**Query Parameters**:
- `branchId` (optional)
- `type` (optional)
- `startDate` (optional)
- `endDate` (optional)

## 8. Roleplays

### POST /api/roleplays
Score roleplay

**Request**:
```json
{
  "sessionId": "uuid",
  "userId": "uuid",
  "scenarioId": "uuid",
  "score": 4,
  "coachNotes": "Good empathy shown"
}
```

## 9. Micro-Habits

### GET /api/habits/my
Get my habits (Staff)

**Response**:
```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Greet 3 customers",
      "description": "Smile and make eye contact",
      "completed": false,
      "streak": 7
    }
  ]
}
```

### POST /api/habits/:id/complete
Complete habit

**Request**:
```json
{
  "proofUrl": "https://...",
  "notes": "Completed during morning shift"
}
```

## 10. Coaching Logs

### POST /api/coaching-logs
Create coaching log

**Request**:
```json
{
  "staffId": "uuid",
  "date": "2024-01-15",
  "topic": "Tone of voice",
  "notes": "Practiced softer tone",
  "evidenceUrl": "https://..."
}
```

### PATCH /api/coaching-logs/:id/approve
Approve coaching log (Manager)

**Request**:
```json
{
  "approved": true
}
```

## 11. Metrics

### POST /api/metrics/import
Import metrics via CSV

**Request**: Multipart form-data with CSV file

### GET /api/metrics/csat-trend
Get CSAT trend

**Query Parameters**:
- `branchId` (optional)
- `startDate` (required)
- `endDate` (required)

**Response**:
```json
{
  "baseline": 3.5,
  "current": 3.8,
  "change": 0.3,
  "trend": [
    {"date": "2024-01-01", "score": 3.5},
    {"date": "2024-01-08", "score": 3.6}
  ]
}
```

### GET /api/metrics/branch-variance
Get branch variance

**Response**:
```json
{
  "data": [
    {
      "branchId": "uuid",
      "branchName": "Accra Main",
      "score": 90,
      "rank": 1
    }
  ]
}
```

## 12. Reports

### GET /api/reports/executive-scorecard
Generate executive scorecard (PDF)

**Query Parameters**:
- `startDate` (required)
- `endDate` (required)

**Response**: PDF file download

## 13. Rate Limiting

- 100 requests per minute per user
- 429 Too Many Requests if exceeded

## 14. Error Codes

```
400 Bad Request
401 Unauthorized
403 Forbidden
404 Not Found
422 Unprocessable Entity
429 Too Many Requests
500 Internal Server Error
```
