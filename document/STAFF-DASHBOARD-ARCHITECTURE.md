# Staff Dashboard - Data Flow & Architecture

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (UI)                             │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │ Stats Cards  │  │ Analytics    │  │ Progress     │         │
│  │ - Completed  │  │ Chart        │  │ Circle       │         │
│  │ - Total      │  │ (Line Graph) │  │ (90%)        │         │
│  │ - Streak     │  │              │  │              │         │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘         │
│         │                 │                  │                  │
│         └─────────────────┴──────────────────┘                  │
│                           │                                     │
│  ┌────────────────────────┴──────────────────────────┐         │
│  │          Today's Huddles Table                     │         │
│  │  Name | Duration | Date | Status | Participants   │         │
│  └────────────────────┬───────────────────────────────┘         │
│                       │                                         │
└───────────────────────┼─────────────────────────────────────────┘
                        │
                        │ HTTP Requests (JWT Auth)
                        │
┌───────────────────────┼─────────────────────────────────────────┐
│                       ▼          BACKEND API                     │
│                                                                  │
│  ┌──────────────────────────────────────────────────────┐      │
│  │         StaffDashboardController                      │      │
│  │  @Controller('staff/dashboard')                      │      │
│  │                                                       │      │
│  │  • GET /staff/dashboard                              │      │
│  │  • GET /staff/dashboard/habit-analysis               │      │
│  │  • GET /staff/dashboard/today-huddle                 │      │
│  └────────────────────┬─────────────────────────────────┘      │
│                       │                                         │
│                       │ calls                                   │
│                       │                                         │
│  ┌────────────────────▼─────────────────────────────────┐      │
│  │         StaffDashboardService                         │      │
│  │                                                       │      │
│  │  • getStaffDashboardData()                           │      │
│  │  • getHabitAnalysisGraphData()                       │      │
│  │  • getTodayHuddleData()                              │      │
│  │  • calculateBestStreak() [private]                   │      │
│  └────────────────────┬─────────────────────────────────┘      │
│                       │                                         │
│                       │ queries                                 │
│                       │                                         │
│  ┌────────────────────▼─────────────────────────────────┐      │
│  │              PrismaService                            │      │
│  │         (Database ORM Layer)                          │      │
│  └────────────────────┬─────────────────────────────────┘      │
│                       │                                         │
└───────────────────────┼─────────────────────────────────────────┘
                        │
                        │ SQL Queries
                        │
┌───────────────────────▼─────────────────────────────────────────┐
│                     DATABASE (PostgreSQL)                        │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │ HabitLog     │  │ HabitAssign  │  │ MicroHabit   │         │
│  │ - userId     │  │ - userId     │  │ - id         │         │
│  │ - habitId    │  │ - habitId    │  │ - title      │         │
│  │ - date       │  │ - startDate  │  │ - points     │         │
│  │ - completed  │  │ - endDate    │  │              │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │ Huddle       │  │ HuddlePartic │  │ User         │         │
│  │ - id         │  │ - huddleId   │  │ - id         │         │
│  │ - topic      │  │ - userId     │  │ - name       │         │
│  │ - date       │  │ - status     │  │ - email      │         │
│  │ - status     │  │              │  │              │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## Request Flow Diagrams

### 1. Dashboard Stats Request Flow

```
┌────────┐                                              ┌──────────┐
│ Client │                                              │ Database │
└───┬────┘                                              └────┬─────┘
    │                                                        │
    │ GET /staff/dashboard                                   │
    │ Authorization: Bearer token                            │
    ├──────────────────────────────────────────►            │
    │                                                        │
    │                         [Verify JWT]                   │
    │                         [Extract staffId]              │
    │                                                        │
    │                         Query HabitAssignment          │
    │                         WHERE userId = staffId         │
    │                         ◄─────────────────────────────┤
    │                         │ Return assigned habitIds     │
    │                         │                              │
    │                         Query HabitLog                 │
    │                         WHERE userId = staffId         │
    │                         AND date = today               │
    │                         AND completed = true           │
    │                         ◄─────────────────────────────┤
    │                         │ Return completed count       │
    │                         │                              │
    │                         Query HabitLog (all dates)     │
    │                         Calculate best streak          │
    │                         ◄─────────────────────────────┤
    │                         │ Return habit logs            │
    │                         │                              │
    │                         [Calculate statistics]         │
    │                         [Format response]              │
    │                                                        │
    │ ◄───────────────────────────────────────────           │
    │ {                                                      │
    │   "stats": {                                           │
    │     "habitCompleted": 15,                              │
    │     "totalHabits": 15,                                 │
    │     "bestStreak": 80                                   │
    │   },                                                   │
    │   "todaysProgress": {                                  │
    │     "percentage": 90,                                  │
    │     "habitsRemaining": 3                               │
    │   }                                                    │
    │ }                                                      │
    │                                                        │
```

### 2. Habit Analytics Request Flow

```
┌────────┐                                              ┌──────────┐
│ Client │                                              │ Database │
└───┬────┘                                              └────┬─────┘
    │                                                        │
    │ GET /staff/dashboard/habit-analysis                    │
    ├──────────────────────────────────────────►            │
    │                                                        │
    │                         [Calculate week dates]         │
    │                         [Start = Monday, End = Sunday] │
    │                                                        │
    │                         For each day (Mon-Sun):        │
    │                         ┌─────────────────┐            │
    │                         │ Query HabitLog  │            │
    │                         │ WHERE date = day│            │
    │                         │ AND completed   │            │
    │                         └────────┬────────┘            │
    │                                  │                     │
    │                         ◄────────┴────────────────────┤
    │                         │ Count completed per day      │
    │                                                        │
    │                         Query Previous Week            │
    │                         Calculate % change             │
    │                         ◄─────────────────────────────┤
    │                                                        │
    │ ◄───────────────────────────────────────────           │
    │ {                                                      │
    │   "weeklyData": [                                      │
    │     {"day": "Mon", "completedHabits": 4},              │
    │     {"day": "Tue", "completedHabits": 5},              │
    │     ...                                                │
    │   ],                                                   │
    │   "percentageChange": 12                               │
    │ }                                                      │
    │                                                        │
```

### 3. Today's Huddles Request Flow

```
┌────────┐                                              ┌──────────┐
│ Client │                                              │ Database │
└───┬────┘                                              └────┬─────┘
    │                                                        │
    │ GET /staff/dashboard/today-huddle                      │
    ├──────────────────────────────────────────►            │
    │                                                        │
    │                         [Get today's date]             │
    │                         todayStr = "2026-02-12"        │
    │                                                        │
    │                         Query Huddle                   │
    │                         WHERE selectedDate = today     │
    │                         AND staffId IN participants    │
    │                         INCLUDE:                       │
    │                           - creator                    │
    │                           - membersParticipating       │
    │                           - participantStatuses        │
    │                           - branch                     │
    │                         ◄─────────────────────────────┤
    │                         │ Return huddles with details  │
    │                                                        │
    │                         [Format each huddle]           │
    │                         [Calculate participant counts] │
    │                         [Extract my status]            │
    │                                                        │
    │ ◄───────────────────────────────────────────           │
    │ {                                                      │
    │   "totalHuddles": 4,                                   │
    │   "huddles": [                                         │
    │     {                                                  │
    │       "name": "Morning Meeting",                       │
    │       "duration": "60min",                             │
    │       "status": "completed",                           │
    │       "participants": {...}                            │
    │     }                                                  │
    │   ]                                                    │
    │ }                                                      │
    │                                                        │
```

---

## Database Query Patterns

### Query 1: Get Active Habit Assignments

```sql
SELECT *
FROM habit_assignments
WHERE user_id = :staffId
  AND start_date <= NOW()
  AND end_date >= NOW()
```

### Query 2: Count Today's Completed Habits

```sql
SELECT COUNT(*)
FROM habit_logs
WHERE user_id = :staffId
  AND habit_id IN (:habitIds)
  AND date >= :startOfDay
  AND date <= :endOfDay
  AND completed = true
```

### Query 3: Get Habit Logs for Streak Calculation

```sql
SELECT date
FROM habit_logs
WHERE user_id = :staffId
  AND habit_id IN (:habitIds)
  AND completed = true
ORDER BY date ASC
```

### Query 4: Count Weekly Completions

```sql
SELECT COUNT(*)
FROM habit_logs
WHERE user_id = :staffId
  AND habit_id IN (:habitIds)
  AND date >= :startOfWeek
  AND date <= :endOfWeek
  AND completed = true
```

### Query 5: Get Today's Huddles

```sql
SELECT h.*,
       creator.name as creator_name,
       branch.branch_name
FROM huddles h
INNER JOIN users creator ON h.creator_id = creator.id
LEFT JOIN branches branch ON h.branch_id = branch.id
WHERE h.selected_date = :today
  AND EXISTS (
    SELECT 1
    FROM huddles_participants hp
    WHERE hp.huddle_id = h.id
      AND hp.user_id = :staffId
  )
ORDER BY h.start_time ASC
```

---

## Data Transformation Examples

### Example 1: Raw Database Data → API Response

**Database Result:**

```javascript
{
  habitAssignments: [
    { habitId: "habit-1" },
    { habitId: "habit-2" },
    { habitId: "habit-3" }
  ],
  completedLogs: [
    { habitId: "habit-1", date: "2026-02-12", completed: true },
    { habitId: "habit-2", date: "2026-02-12", completed: true }
  ]
}
```

**Transformed Response:**

```javascript
{
  stats: {
    habitCompleted: 2,      // Count of completedLogs
    totalHabits: 3,         // Count of habitAssignments
    bestStreak: 15          // Calculated from logs
  },
  todaysProgress: {
    percentage: 67,         // (2/3) * 100
    habitsRemaining: 1,     // 3 - 2
    completedCount: 2,
    totalCount: 3
  }
}
```

### Example 2: Streak Calculation Logic

**Input: Habit Logs by Date**

```javascript
[
  { date: '2026-02-01' },
  { date: '2026-02-02' }, // Day 1 → 2 (streak = 2)
  { date: '2026-02-03' }, // Day 2 → 3 (streak = 3)
  { date: '2026-02-05' }, // Gap! Reset to 1
  { date: '2026-02-06' }, // Day 5 → 6 (streak = 2)
  { date: '2026-02-07' }, // Day 6 → 7 (streak = 3)
];
```

**Algorithm Steps:**

```javascript
maxStreak = 1
currentStreak = 1

Compare dates:
- Feb 2 - Feb 1 = 1 day → currentStreak = 2, maxStreak = 2
- Feb 3 - Feb 2 = 1 day → currentStreak = 3, maxStreak = 3
- Feb 5 - Feb 3 = 2 days → currentStreak = 1 (gap!)
- Feb 6 - Feb 5 = 1 day → currentStreak = 2
- Feb 7 - Feb 6 = 1 day → currentStreak = 3

Result: bestStreak = 3
```

### Example 3: Huddle Participant Aggregation

**Database Result:**

```javascript
{
  huddle: {
    id: "huddle-1",
    topic: "Morning Meeting",
    participantStatuses: [
      { userId: "user-1", status: "completed" },
      { userId: "user-2", status: "completed" },
      { userId: "user-3", status: "joined" },
      { userId: "user-4", status: "pending" },
      { userId: "user-5", status: "absent" }
    ]
  }
}
```

**Transformed Response:**

```javascript
{
  participants: {
    total: 5,
    completed: 2,  // Filter status === 'completed'
    joined: 1,     // Filter status === 'joined'
    list: [...]
  }
}
```

---

## Error Handling Flow

```
┌────────┐
│Request │
└───┬────┘
    │
    ▼
┌────────────────┐
│ Validate JWT   │
└───┬────────┬───┘
    │        │
   Yes       No ──► Return 401 Unauthorized
    │
    ▼
┌────────────────┐
│ Verify Staff   │
│ Role           │
└───┬────────┬───┘
    │        │
   Yes       No ──► Return 403 Forbidden
    │
    ▼
┌────────────────┐
│ Execute Query  │
└───┬────────┬───┘
    │        │
Success   Error ──► Return 500 Internal Error
    │
    ▼
┌────────────────┐
│ Return Data    │
└────────────────┘
```

---

## Caching Strategy (Optional Future Enhancement)

```
┌────────┐                    ┌─────────┐                ┌──────────┐
│ Client │                    │  Cache  │                │ Database │
└───┬────┘                    │ (Redis) │                └────┬─────┘
    │                         └────┬────┘                     │
    │ Request Dashboard            │                          │
    ├──────────────────────────────►                          │
    │                              │                          │
    │                         Check Cache                     │
    │                         Key: "staff:123:dashboard"      │
    │                              │                          │
    │                         Cache Hit?                      │
    │                         ┌────┴────┐                     │
    │                        Yes       No                     │
    │                         │         │                     │
    │                         │         └──────────────────────►
    │                         │                              │
    │                         │         Query Database        │
    │                         │         ◄─────────────────────┤
    │                         │         │                     │
    │                         │         Store in Cache        │
    │                         │         TTL = 10 minutes      │
    │                         │         ├──────►              │
    │ ◄───────────────────────┴─────────┘                     │
    │ Return Data                                             │
    │                                                         │
```

**Cache Keys:**

- `staff:{staffId}:dashboard` - TTL: 10 minutes
- `staff:{staffId}:habit-analysis:{week}` - TTL: 1 hour
- `staff:{staffId}:huddles:{date}` - TTL: 5 minutes

---

## Security Layers

```
┌──────────────────────────────────────────────────────────┐
│                     Security Layers                       │
│                                                           │
│  Layer 1: HTTPS/TLS                                      │
│  ├─ Encrypted communication                              │
│  └─ Certificate validation                               │
│                                                           │
│  Layer 2: Authentication                                 │
│  ├─ JWT token validation                                 │
│  ├─ Token expiration check                               │
│  └─ Signature verification                               │
│                                                           │
│  Layer 3: Authorization                                  │
│  ├─ @ValidateStaff() decorator                          │
│  ├─ Role verification (must be STAFF)                    │
│  └─ Extract userId from token                            │
│                                                           │
│  Layer 4: Data Access Control                            │
│  ├─ Filter by userId (own data only)                     │
│  ├─ No cross-user data access                            │
│  └─ Tenant isolation (if multi-tenant)                   │
│                                                           │
│  Layer 5: Input Validation                               │
│  ├─ Type checking                                        │
│  ├─ Sanitization                                         │
│  └─ SQL injection prevention (Prisma ORM)                │
│                                                           │
└──────────────────────────────────────────────────────────┘
```

---

## Performance Metrics (Expected)

| Endpoint                          | Average Response Time | Database Queries |
| --------------------------------- | --------------------- | ---------------- |
| `/staff/dashboard`                | 50-150ms              | 3-5 queries      |
| `/staff/dashboard/habit-analysis` | 100-200ms             | 8-10 queries     |
| `/staff/dashboard/today-huddle`   | 80-180ms              | 1-2 queries      |

**Optimization Opportunities:**

- Batch queries where possible
- Use database views for complex calculations
- Implement caching for frequently accessed data
- Add database indexes (already present)
- Consider materialized views for analytics

---

## Data Freshness

| Data Type       | Update Frequency | Acceptable Staleness |
| --------------- | ---------------- | -------------------- |
| Habit Stats     | Real-time        | 0-5 minutes          |
| Habit Analytics | Daily            | 1 hour               |
| Today's Huddles | Real-time        | 1-5 minutes          |
| Best Streak     | Daily            | 1 hour               |

---

This completes the comprehensive architecture documentation for the Staff Dashboard API! 🎉
