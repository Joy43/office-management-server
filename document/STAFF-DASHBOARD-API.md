# Staff Dashboard API Documentation

This document provides comprehensive API documentation for the Staff Dashboard endpoints based on the dashboard UI design.

## Overview

The Staff Dashboard provides three main endpoints:

1. **Dashboard Stats** - Habit completion metrics and today's progress
2. **Habit Analytics** - Weekly habit completion trend graph
3. **Today's Huddles** - List of huddles scheduled for today

---

## API Endpoints

### 1. Get Dashboard Data

Get comprehensive dashboard statistics including habit completion, total habits, best streak, and today's progress.

**Endpoint:** `GET /staff/dashboard`

**Authentication:** Required (Bearer Token)

**Headers:**

```json
{
  "Authorization": "Bearer {access_token}"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "stats": {
      "habitCompleted": 15,
      "totalHabits": 15,
      "bestStreak": 80
    },
    "todaysProgress": {
      "percentage": 90,
      "habitsRemaining": 3,
      "completedCount": 15,
      "totalCount": 15
    }
  }
}
```

**Response Fields:**

| Field                            | Type   | Description                                               |
| -------------------------------- | ------ | --------------------------------------------------------- |
| `stats.habitCompleted`           | number | Number of habits completed today                          |
| `stats.totalHabits`              | number | Total number of habits assigned to staff                  |
| `stats.bestStreak`               | number | Longest consecutive days of completing at least one habit |
| `todaysProgress.percentage`      | number | Percentage of habits completed today (0-100)              |
| `todaysProgress.habitsRemaining` | number | Number of habits remaining to complete today              |
| `todaysProgress.completedCount`  | number | Number of habits completed today                          |
| `todaysProgress.totalCount`      | number | Total habits assigned for today                           |

**Dashboard UI Mapping:**

- **Habit Completed Card:** `stats.habitCompleted`
- **Total Habits Card:** `stats.totalHabits`
- **Best Streak Card:** `stats.bestStreak`
- **Today's Progress Circle:** `todaysProgress.percentage`
- **Habits Remaining Badge:** `todaysProgress.habitsRemaining`

---

### 2. Get Habit Analysis Graph Data

Get weekly habit completion analytics with trend data for visualization.

**Endpoint:** `GET /staff/dashboard/habit-analysis`

**Authentication:** Required (Bearer Token)

**Headers:**

```json
{
  "Authorization": "Bearer {access_token}"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "period": "Weekly",
    "weekRange": {
      "start": "2026-02-10",
      "end": "2026-02-16"
    },
    "percentageChange": 12,
    "weeklyData": [
      {
        "day": "Mon",
        "date": "2026-02-10",
        "completedHabits": 4
      },
      {
        "day": "Tue",
        "date": "2026-02-11",
        "completedHabits": 5
      },
      {
        "day": "Wed",
        "date": "2026-02-12",
        "completedHabits": 6
      },
      {
        "day": "Thu",
        "date": "2026-02-13",
        "completedHabits": 6
      },
      {
        "day": "Fri",
        "date": "2026-02-14",
        "completedHabits": 7
      },
      {
        "day": "Sat",
        "date": "2026-02-15",
        "completedHabits": 5
      },
      {
        "day": "Sun",
        "date": "2026-02-16",
        "completedHabits": 4
      }
    ],
    "summary": {
      "totalCompleted": 37,
      "averagePerDay": 5.3
    }
  }
}
```

**Response Fields:**

| Field                          | Type   | Description                                          |
| ------------------------------ | ------ | ---------------------------------------------------- |
| `period`                       | string | Time period for the analysis (always "Weekly")       |
| `weekRange.start`              | string | Start date of the week (Monday) in YYYY-MM-DD format |
| `weekRange.end`                | string | End date of the week (Sunday) in YYYY-MM-DD format   |
| `percentageChange`             | number | Percentage change compared to previous week          |
| `weeklyData`                   | array  | Array of daily habit completion data                 |
| `weeklyData[].day`             | string | Day name (Mon-Sun)                                   |
| `weeklyData[].date`            | string | Date in YYYY-MM-DD format                            |
| `weeklyData[].completedHabits` | number | Number of habits completed on that day               |
| `summary.totalCompleted`       | number | Total habits completed in the week                   |
| `summary.averagePerDay`        | number | Average habits completed per day                     |

**Dashboard UI Mapping:**

- **Graph Title:** "Habit Analytics" with `percentageChange` indicator
- **X-Axis:** `weeklyData[].day` (Mon, Tue, Wed, Thu, Fri, Sat, Sun)
- **Y-Axis:** `weeklyData[].completedHabits`
- **Period Dropdown:** `period` value

**Graph Visualization:**

```
  8 ┤
  7 ┤         ●
  6 ┤     ●   ●   ●
  5 ┤   ●         ●
  4 ┤ ●               ●
  3 ┤
  2 ┤
  0 ┤────────────────────
    Mon Tue Wed Thu Fri Sat Sun
```

---

### 3. Get Today's Huddles

Get all huddles scheduled for today where the staff member is a participant.

**Endpoint:** `GET /staff/dashboard/today-huddle`

**Authentication:** Required (Bearer Token)

**Headers:**

```json
{
  "Authorization": "Bearer {access_token}"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "date": "2026-02-12",
    "totalHuddles": 4,
    "huddles": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "name": "Morning Meeting",
        "meetingId": "Meeting ID: 550E8400",
        "duration": "60min",
        "dateTime": {
          "date": "2026-02-12",
          "time": "09:20",
          "displayDate": "February 12, 2026",
          "displayTime": "09:20"
        },
        "status": "completed",
        "myParticipationStatus": "completed",
        "meetLink": "https://meet.google.com/abc-defg-hij",
        "participants": {
          "total": 5,
          "completed": 3,
          "joined": 2,
          "list": [
            {
              "userId": "user-id-1",
              "name": "John Doe",
              "email": "john.doe@example.com",
              "profilePicture": "https://example.com/profile1.jpg",
              "status": "completed",
              "joinedAt": "2026-02-12T09:20:00.000Z",
              "completedAt": "2026-02-12T10:20:00.000Z"
            },
            {
              "userId": "user-id-2",
              "name": "Jane Smith",
              "email": "jane.smith@example.com",
              "profilePicture": "https://example.com/profile2.jpg",
              "status": "joined",
              "joinedAt": "2026-02-12T09:25:00.000Z",
              "completedAt": null
            }
          ]
        },
        "creator": {
          "id": "creator-id",
          "name": "Admin User",
          "email": "admin@example.com",
          "profilePicture": "https://example.com/admin.jpg"
        },
        "branch": {
          "id": "branch-id",
          "name": "Main Branch"
        },
        "createdAt": "2026-02-10T08:00:00.000Z",
        "updatedAt": "2026-02-12T10:20:00.000Z"
      }
    ]
  }
}
```

**Response Fields:**

| Field                              | Type   | Description                                                       |
| ---------------------------------- | ------ | ----------------------------------------------------------------- |
| `date`                             | string | Today's date in YYYY-MM-DD format                                 |
| `totalHuddles`                     | number | Total number of huddles for today                                 |
| `huddles`                          | array  | Array of huddle objects                                           |
| `huddles[].id`                     | string | Unique huddle ID                                                  |
| `huddles[].name`                   | string | Huddle topic/name                                                 |
| `huddles[].meetingId`              | string | Display meeting ID (first 8 chars uppercase)                      |
| `huddles[].duration`               | string | Duration in minutes (e.g., "60min")                               |
| `huddles[].dateTime`               | object | Date and time information                                         |
| `huddles[].dateTime.date`          | string | Date in YYYY-MM-DD format                                         |
| `huddles[].dateTime.time`          | string | Time in HH:MM format                                              |
| `huddles[].dateTime.displayDate`   | string | Formatted date for display                                        |
| `huddles[].dateTime.displayTime`   | string | Formatted time for display                                        |
| `huddles[].status`                 | string | Huddle status: "scheduled", "completed", "cancelled"              |
| `huddles[].myParticipationStatus`  | string | Current user's status: "pending", "joined", "completed", "absent" |
| `huddles[].meetLink`               | string | Meeting link (Google Meet, Zoom, etc.)                            |
| `huddles[].participants`           | object | Participant information                                           |
| `huddles[].participants.total`     | number | Total number of participants                                      |
| `huddles[].participants.completed` | number | Number who completed                                              |
| `huddles[].participants.joined`    | number | Number who joined                                                 |
| `huddles[].participants.list`      | array  | Array of participant details                                      |
| `huddles[].creator`                | object | Huddle creator information                                        |
| `huddles[].branch`                 | object | Branch information (nullable)                                     |

**Dashboard UI Mapping - Table Columns:**

| Column           | Data Source                                                     |
| ---------------- | --------------------------------------------------------------- |
| **Name**         | `name` + `meetingId`                                            |
| **Duration**     | `duration`                                                      |
| **Date & Time**  | `dateTime.displayDate` + `dateTime.displayTime`                 |
| **Status**       | `status` (badge with color)                                     |
| **Participants** | `participants.list` (avatar stack) + `participants.total` count |
| **Action**       | Action button (colored by `myParticipationStatus`)              |

**Status Badge Colors:**

- `completed` → Green badge
- `scheduled` → Blue badge
- `cancelled` → Red badge

**Participant Status Types:**

- `pending` → Waiting to join
- `joined` → Currently in meeting
- `completed` → Finished the meeting
- `absent` → Did not attend

---

## Database Schema Analysis

### Key Tables Used

#### 1. **HabitAssignment**

Tracks which habits are assigned to which staff members.

```prisma
model HabitAssignment {
  id String @id @default(uuid())
  assignedBy String
  startDate DateTime
  endDate DateTime
  habitId String
  userId String
  branchId String?

  habit MicroHabit @relation(fields: [habitId])
  user User @relation(fields: [userId])
  branch Branch? @relation(fields: [branchId])
  assignedByUser User @relation(fields: [assignedBy])
}
```

#### 2. **HabitLog**

Records daily habit completion.

```prisma
model HabitLog {
  id String @id @default(uuid())
  date DateTime
  completed Boolean @default(false)
  proofUrl String?

  tenantId String
  habitId String
  userId String

  habit MicroHabit @relation(fields: [habitId])
  user User @relation(fields: [userId])
}
```

#### 3. **MicroHabit**

Individual habit definitions.

```prisma
model MicroHabit {
  id String @id @default(uuid())
  title String
  description String?
  points String @default("0")

  tenantId String
  userId String
  habitAddingId String?

  user User @relation(fields: [userId])
  habitAdding HabitAdding? @relation(fields: [habitAddingId])
  habitAssignments HabitAssignment[]
  habitLogs HabitLog[]
}
```

#### 4. **Huddle**

Huddle/meeting information.

```prisma
model Huddle {
  id String @id @default(uuid())
  topic String
  duration String @default("15")
  meetLink String?
  HuddleStatus HuddleStatus @default(scheduled)
  startTime String
  selectedDate String

  creatorId String
  branchId String?

  branch Branch? @relation(fields: [branchId])
  creator User @relation("HuddleCreator", fields: [creatorId])
  membersParticipating User[] @relation("HuddleParticipants")
  participantStatuses HuddleParticipant[]
}

enum HuddleStatus {
  scheduled
  completed
  cancelled
}
```

#### 5. **HuddleParticipant**

Tracks individual participation status.

```prisma
model HuddleParticipant {
  id String @id @default(uuid())
  huddleId String
  userId String
  status ParticipantStatus @default(pending)
  completedAt DateTime?
  joinedAt DateTime?
  notes String?

  huddle Huddle @relation(fields: [huddleId])
  user User @relation(fields: [userId])
}

enum ParticipantStatus {
  pending
  joined
  completed
  absent
}
```

---

## Data Calculation Logic

### 1. Habit Completed (Today)

```typescript
// Count habit logs completed today for assigned habits
const habitCompletedToday = await prisma.habitLog.count({
  where: {
    userId: staffId,
    habitId: { in: assignedHabitIds },
    date: { gte: startOfDay, lte: endOfDay },
    completed: true,
  },
});
```

### 2. Total Habits

```typescript
// Count active habit assignments
const habitAssignments = await prisma.habitAssignment.findMany({
  where: {
    userId: staffId,
    startDate: { lte: now },
    endDate: { gte: now },
  },
});
const totalHabits = habitAssignments.length;
```

### 3. Best Streak

```typescript
// Find longest consecutive days with at least one completed habit
// Algorithm:
// 1. Get all completed habit logs ordered by date
// 2. Iterate through logs and count consecutive days
// 3. Return the maximum consecutive count
```

### 4. Today's Progress Percentage

```typescript
const percentage =
  totalHabits > 0 ? Math.round((habitCompletedToday / totalHabits) * 100) : 0;
```

### 5. Weekly Habit Analysis

```typescript
// For each day in the current week (Mon-Sun):
// 1. Count completed habits for that day
// 2. Calculate percentage change from previous week
// 3. Provide summary statistics
```

### 6. Today's Huddles

```typescript
// Query huddles where:
// 1. selectedDate matches today's date
// 2. Staff member is in membersParticipating
// 3. Include all participant statuses
// 4. Order by startTime ascending
```

---

## Error Responses

### 401 Unauthorized

```json
{
  "statusCode": 401,
  "message": "Unauthorized",
  "error": "Unauthorized"
}
```

### 403 Forbidden

```json
{
  "statusCode": 403,
  "message": "Access denied. Staff role required.",
  "error": "Forbidden"
}
```

### 500 Internal Server Error

```json
{
  "statusCode": 500,
  "message": "Internal server error",
  "error": "Internal Server Error"
}
```

---

## Usage Examples

### cURL Examples

#### 1. Get Dashboard Data

```bash
curl -X GET 'http://localhost:3000/staff/dashboard' \
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'
```

#### 2. Get Habit Analysis

```bash
curl -X GET 'http://localhost:3000/staff/dashboard/habit-analysis' \
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'
```

#### 3. Get Today's Huddles

```bash
curl -X GET 'http://localhost:3000/staff/dashboard/today-huddle' \
  -H 'Authorization: Bearer YOUR_ACCESS_TOKEN'
```

### JavaScript/TypeScript Examples

```typescript
// Using fetch API
const getDashboardData = async () => {
  const response = await fetch('http://localhost:3000/staff/dashboard', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  const data = await response.json();
  return data;
};

const getHabitAnalysis = async () => {
  const response = await fetch(
    'http://localhost:3000/staff/dashboard/habit-analysis',
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  const data = await response.json();
  return data;
};

const getTodayHuddles = async () => {
  const response = await fetch(
    'http://localhost:3000/staff/dashboard/today-huddle',
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
  const data = await response.json();
  return data;
};
```

### React Component Example

```tsx
import { useEffect, useState } from 'react';

const StaffDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [habitAnalysis, setHabitAnalysis] = useState(null);
  const [todayHuddles, setTodayHuddles] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('accessToken');

      // Fetch all dashboard data
      const [dashboard, analysis, huddles] = await Promise.all([
        fetch('/staff/dashboard', {
          headers: { Authorization: `Bearer ${token}` },
        }).then((r) => r.json()),
        fetch('/staff/dashboard/habit-analysis', {
          headers: { Authorization: `Bearer ${token}` },
        }).then((r) => r.json()),
        fetch('/staff/dashboard/today-huddle', {
          headers: { Authorization: `Bearer ${token}` },
        }).then((r) => r.json()),
      ]);

      setDashboardData(dashboard.data);
      setHabitAnalysis(analysis.data);
      setTodayHuddles(huddles.data);
    };

    fetchData();
  }, []);

  return (
    <div className="dashboard">
      {/* Top Stats Cards */}
      <div className="stats-grid">
        <StatCard
          title="Habit Completed"
          value={dashboardData?.stats.habitCompleted}
        />
        <StatCard
          title="Total Habits"
          value={dashboardData?.stats.totalHabits}
        />
        <StatCard title="Best Streak" value={dashboardData?.stats.bestStreak} />
      </div>

      {/* Habit Analytics Chart */}
      <div className="analytics">
        <HabitChart data={habitAnalysis?.weeklyData} />
      </div>

      {/* Today's Progress */}
      <div className="progress">
        <CircularProgress
          percentage={dashboardData?.todaysProgress.percentage}
          remaining={dashboardData?.todaysProgress.habitsRemaining}
        />
      </div>

      {/* Today's Huddles Table */}
      <div className="huddles">
        <HuddlesTable huddles={todayHuddles?.huddles} />
      </div>
    </div>
  );
};
```

---

## UI Component Specifications

### Top Stats Cards

- **Layout:** 3 cards in a row
- **Card Style:** White background, rounded corners, shadow
- **Icon:** Purple circle icon
- **Number:** Large purple text
- **Title:** Small gray text

### Habit Analytics Chart

- **Type:** Line chart with dots
- **Color:** Purple line (#8B5CF6)
- **X-Axis:** Day names (Mon-Sun)
- **Y-Axis:** Number of habits (0-8)
- **Header:** "Habit Analytics" + percentage change badge
- **Dropdown:** Monthly/Weekly filter

### Today's Progress Circle

- **Type:** Circular progress indicator
- **Color:** Pink/Magenta (#EC4899)
- **Center Text:** Large percentage number
- **Bottom Badge:** "X habits remaining" in small text

### Today's Huddles Table

- **Columns:** Name, Duration, Date & Time, Status, Participants, Action
- **Status Badge:** Colored badge (green for completed)
- **Participants:** Avatar stack with +N indicator
- **Action Button:** Colored circular button with icon

---

## Testing Checklist

- [ ] Test with staff having no habits assigned
- [ ] Test with staff having no huddles today
- [ ] Test with staff having completed all habits
- [ ] Test with staff having incomplete habits
- [ ] Test streak calculation across multiple weeks
- [ ] Test huddle participant status updates
- [ ] Test with different timezones
- [ ] Test with past date huddles
- [ ] Test with future date huddles
- [ ] Test pagination if many huddles exist

---

## Performance Considerations

1. **Caching:** Consider caching dashboard data for 5-15 minutes
2. **Indexing:** Ensure indexes on:
   - `habit_logs(userId, date, completed)`
   - `habit_assignments(userId, startDate, endDate)`
   - `huddles(selectedDate)`
   - `huddle_participants(userId, huddleId)`
3. **Query Optimization:** Use database views for frequently accessed calculations
4. **Real-time Updates:** Consider WebSocket for live huddle status updates

---

## Future Enhancements

1. **Date Range Selection:** Allow custom date ranges for analytics
2. **Export Data:** Export habit logs and huddle history
3. **Notifications:** Push notifications for upcoming huddles
4. **Reminders:** Habit completion reminders
5. **Achievements:** Gamification badges for streaks
6. **Comparison:** Compare performance with team averages
7. **Goals:** Set personal habit goals
8. **Calendar View:** Monthly calendar view for huddles

---

## Support & Contact

For API issues or questions, contact the development team.

**Last Updated:** February 12, 2026
**API Version:** 1.0.0
**Base URL:** `http://localhost:3000` (development)
