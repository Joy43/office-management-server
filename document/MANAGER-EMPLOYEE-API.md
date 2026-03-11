# Manager Employee Management API Implementation

## Overview

Implemented a complete employee management system for managers with filtering, searching, pagination, and comprehensive habit tracking data.

## Created Files

### 1. Filter DTO (`manager-employee-filter.dto.ts`)

Query parameters for filtering and pagination:

- **searchName**: Search employees by name or email
- **status**: Filter by performance status (Great/Needs/Bad/All)
- **assignedTrainerId**: Filter by assigned trainer ID
- **page**: Page number (default: 1)
- **limit**: Records per page (default: 10)

### 2. Response DTO (`manager-employee-response.dto.ts`)

Structured response matching the UI requirements:

#### EmployeeDataDto

- **id**: Employee UUID
- **name**: Employee name
- **email**: Employee email
- **profilePicture**: Profile picture URL
- **phone**: Phone number
- **totalHabits**: Total habits assigned
- **score**: Performance score (0-5 scale)
- **status**: Performance status (Great/Needs/Bad)
- **assignedTrainer**: Trainer information (id, name, profilePicture)
- **habits**: Array of habit details with:
  - habitId, habitName, habitDescription
  - completionPercentage (last 30 days)
  - streak (consecutive completion days)

#### ManagerEmployeeResponseDto

- **totalEmployees**: Total filtered employees count
- **currentPage**: Current page number
- **totalPages**: Total available pages
- **limit**: Records per page
- **employees**: Array of EmployeeDataDto

## Updated Files

### 3. Service (`meneger.session.service.ts`)

Enhanced `getManagerEmployee` method with:

#### Features

- **Multi-field search**: Search by name or email (case-insensitive)
- **Status filtering**: Filter by performance status
- **Trainer filtering**: Filter by assigned trainer
- **Pagination**: Skip/take with page and limit
- **Habit tracking**:
  - Calculates completion percentage (30-day window)
  - Tracks current streak
  - Computes overall performance score
- **Performance scoring**:
  - Score: Average completion percentage / 20 (0-5 scale)
  - Status: Great (≥4.0), Needs (2.5-3.9), Bad (<2.5)

#### Data Processing

1. Fetches employees with habit assignments and logs
2. Calculates completion percentage per habit (last 30 days)
3. Computes streak for each habit
4. Determines overall score and status
5. Identifies assigned trainer (TAINER role)
6. Applies post-query filters
7. Returns paginated response

### 4. Controller (`manager.session.controller.ts`)

Updated endpoint to accept query parameters:

```typescript
@Get('get-manager-employee')
async getManagerEmployee(
  @GetUser('sub') tenantId: string,
  @Query() filterDto: ManagerEmployeeFilterDto,
)
```

## API Usage

### Endpoint

```
GET /MANAGER-dashboard/get-manager-employee
```

### Query Parameters

```
?searchName=John
&status=Great
&assignedTrainerId=uuid
&page=1
&limit=10
```

### Example Response

```json
{
  "status": "success",
  "message": "Manager employees retrieved successfully",
  "data": {
    "totalEmployees": 50,
    "currentPage": 1,
    "totalPages": 5,
    "limit": 10,
    "employees": [
      {
        "id": "uuid",
        "name": "John Doe",
        "email": "john@example.com",
        "profilePicture": "url",
        "phone": "+1234567890",
        "totalHabits": 14,
        "score": 4.5,
        "status": "Great",
        "assignedTrainer": {
          "id": "trainer-uuid",
          "name": "Daniel",
          "profilePicture": "url"
        },
        "habits": [
          {
            "habitId": "habit-uuid",
            "habitName": "Greet 3 customers by name",
            "habitDescription": "Use customer names when greeting",
            "completionPercentage": 60,
            "streak": 14
          }
        ]
      }
    ]
  }
}
```

## UI Mapping

The response structure directly maps to the Employee Management UI:

- **Name column**: `employee.name` + `employee.profilePicture`
- **Habit Name column**: `habits[0].habitName` (first habit)
- **Habits column**: `habits[0].completionPercentage`
- **Streak column**: `habits[0].streak`
- **Total Habits column**: `totalHabits`
- **Score column**: `score`
- **Assigned Trainer column**: `assignedTrainer.name`
- **Status column**: `status` with color indicators
- **Search bar**: Uses `searchName` query parameter
- **Filter button**: Uses `status` and `assignedTrainerId`
- **Export CSV**: Can use the response data
- **Pagination**: Uses `page` and `limit`

## Notes

- Employees with role `STAFF` are fetched (based on UserRole enum)
- Completion percentage is calculated over the last 30 days
- Streak counts consecutive days with completed habits
- Post-query filtering is applied for status and trainer filters
- All calculations happen server-side for accuracy
