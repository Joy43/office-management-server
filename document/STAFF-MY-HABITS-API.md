# Staff My Habits API - Complete Documentation

## 🎯 Overview

This API allows staff members to view all habits assigned to them by their coaches/managers, grouped by coach. The response matches the UI design showing:

- List of coaches who assigned habits
- Completion status per coach (e.g., "3 of 3 habits completed")
- Individual habit details with completion status
- Overall progress tracking

---

## 📡 API Endpoints

### 1. Get My Assigned Habits

**Endpoint:** `GET /staff/my-habits`

**Description:** Get all habits assigned to the logged-in staff member, grouped by coaches

**Authentication:** Required (Bearer Token - STAFF role)

**Query Parameters:**

| Parameter | Type   | Required | Default | Options                       | Description                 |
| --------- | ------ | -------- | ------- | ----------------------------- | --------------------------- |
| `status`  | string | No       | `all`   | `all`, `completed`, `pending` | Filter by completion status |
| `coachId` | string | No       | -       | -                             | Filter by specific coach ID |
| `search`  | string | No       | -       | -                             | Search habits by title      |

**Response:**

```json
{
  "success": true,
  "data": {
    "summary": {
      "totalCoaches": 3,
      "totalHabits": 15,
      "completedToday": 12,
      "pendingToday": 3,
      "overallCompletionPercentage": 80
    },
    "assignedByCoaches": [
      {
        "coach": {
          "id": "coach-uuid-1",
          "name": "John Doe",
          "email": "john.doe@example.com",
          "profilePicture": "https://example.com/profile.jpg",
          "role": "MANAGER"
        },
        "habits": [
          {
            "id": "habit-uuid-1",
            "title": "Morning Meditation",
            "description": "Start your day with 1 minutes of guided meditations",
            "points": "10",
            "frequency": "Daily",
            "isCompletedToday": true,
            "proofUrl": "https://example.com/proof.jpg",
            "assignmentDetails": {
              "assignmentId": "assignment-uuid-1",
              "startDate": "2026-01-01T00:00:00.000Z",
              "endDate": "2026-12-31T23:59:59.999Z",
              "assignedAt": "2026-01-01T10:30:00.000Z"
            }
          },
          {
            "id": "habit-uuid-2",
            "title": "Morning Meditation",
            "description": "Start your day with meditation",
            "points": "10",
            "frequency": "Daily",
            "isCompletedToday": false,
            "proofUrl": null,
            "assignmentDetails": {
              "assignmentId": "assignment-uuid-2",
              "startDate": "2026-01-01T00:00:00.000Z",
              "endDate": "2026-12-31T23:59:59.999Z",
              "assignedAt": "2026-01-01T10:35:00.000Z"
            }
          }
        ],
        "totalHabits": 3,
        "completedHabits": 3,
        "completionPercentage": 100,
        "completionStatus": "3 of 3 habits completed"
      },
      {
        "coach": {
          "id": "coach-uuid-2",
          "name": "Jane Smith",
          "email": "jane.smith@example.com",
          "profilePicture": "https://example.com/profile2.jpg",
          "role": "COACH"
        },
        "habits": [
          {
            "id": "habit-uuid-3",
            "title": "Daily Reading",
            "description": "Read for 30 minutes",
            "points": "15",
            "frequency": "Daily",
            "isCompletedToday": false,
            "proofUrl": null,
            "assignmentDetails": {
              "assignmentId": "assignment-uuid-3",
              "startDate": "2026-02-01T00:00:00.000Z",
              "endDate": "2026-02-28T23:59:59.999Z",
              "assignedAt": "2026-02-01T09:00:00.000Z"
            }
          }
        ],
        "totalHabits": 2,
        "completedHabits": 1,
        "completionPercentage": 50,
        "completionStatus": "1 of 2 habits completed"
      }
    ]
  }
}
```

---

### 2. Get Habits by Specific Coach

**Endpoint:** `GET /staff/my-habits/coach/:coachId`

**Description:** Get all habits assigned by a specific coach

**Authentication:** Required (Bearer Token - STAFF role)

**Path Parameters:**

| Parameter | Type   | Required | Description     |
| --------- | ------ | -------- | --------------- |
| `coachId` | string | Yes      | ID of the coach |

**Response:** Same format as "Get My Assigned Habits" but filtered to one coach

---

### 3. Mark Habit as Completed

**Endpoint:** `POST /staff/my-habits/:habitId/complete`

**Description:** Mark a habit as completed for today

**Authentication:** Required (Bearer Token - STAFF role)

**Path Parameters:**

| Parameter | Type   | Required | Description                          |
| --------- | ------ | -------- | ------------------------------------ |
| `habitId` | string | Yes      | ID of the habit to mark as completed |

**Request Body:**

```json
{
  "proofUrl": "https://example.com/proof.jpg" // Optional
}
```

**Response:**

```json
{
  "success": true,
  "message": "Habit marked as completed",
  "data": {
    "habitLog": {
      "id": "log-uuid-1",
      "habitTitle": "Morning Meditation",
      "points": "10",
      "completedAt": "2026-02-14T08:30:00.000Z",
      "proofUrl": "https://example.com/proof.jpg"
    }
  }
}
```

**Error Response:**

```json
{
  "success": false,
  "message": "Habit not assigned to you or assignment has expired"
}
```

---

### 4. Unmark Habit (Mark as Incomplete)

**Endpoint:** `PATCH /staff/my-habits/:habitId/uncomplete`

**Description:** Mark a previously completed habit as incomplete

**Authentication:** Required (Bearer Token - STAFF role)

**Path Parameters:**

| Parameter | Type   | Required | Description                           |
| --------- | ------ | -------- | ------------------------------------- |
| `habitId` | string | Yes      | ID of the habit to mark as incomplete |

**Response:**

```json
{
  "success": true,
  "message": "Habit marked as incomplete"
}
```

**Error Response:**

```json
{
  "success": false,
  "message": "Habit log not found for today"
}
```

---

## 🎨 UI Implementation Guide

### Coach Card Component

Based on the image, each coach card should display:

```tsx
interface CoachHabitCardProps {
  coach: {
    id: string;
    name: string;
    profilePicture: string;
  };
  completionStatus: string;
  completionPercentage: number;
  habits: HabitItem[];
}

function CoachHabitCard({
  coach,
  completionStatus,
  completionPercentage,
  habits,
}: CoachHabitCardProps) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="coach-card">
      {/* Header */}
      <div className="coach-header">
        <div className="coach-info">
          <img src={coach.profilePicture} alt={coach.name} className="avatar" />
          <div>
            <h3>{coach.name}</h3>
            <p className="completion-status">{completionStatus}</p>
          </div>
        </div>
        <div className="completion-indicator">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <span className="percentage">{completionPercentage}%</span>
          <button
            onClick={() => setExpanded(!expanded)}
            aria-label={expanded ? 'Collapse' : 'Expand'}
          >
            {expanded ? '▲' : '▼'}
          </button>
        </div>
      </div>

      {/* Habits List */}
      {expanded && (
        <div className="habits-list">
          {habits.map((habit) => (
            <HabitItem key={habit.id} habit={habit} />
          ))}
        </div>
      )}
    </div>
  );
}
```

### Habit Item Component

```tsx
interface HabitItemProps {
  habit: {
    id: string;
    title: string;
    description: string;
    frequency: string;
    isCompletedToday: boolean;
  };
  onToggleComplete: (habitId: string, completed: boolean) => void;
}

function HabitItem({ habit, onToggleComplete }: HabitItemProps) {
  return (
    <div className={`habit-item ${habit.isCompletedToday ? 'completed' : ''}`}>
      <div className="habit-checkbox">
        <input
          type="checkbox"
          checked={habit.isCompletedToday}
          onChange={(e) => onToggleComplete(habit.id, e.target.checked)}
          id={`habit-${habit.id}`}
        />
        <label htmlFor={`habit-${habit.id}`}>
          <span className="checkmark">✓</span>
        </label>
      </div>

      <div className="habit-details">
        <h4 className="habit-title">{habit.title}</h4>
        <p className="habit-description">{habit.description}</p>
        <div className="habit-meta">
          <span className="frequency">
            <ClockIcon /> {habit.frequency}
          </span>
        </div>
      </div>

      <button className="habit-action" aria-label="Habit options">
        <MoreIcon />
      </button>
    </div>
  );
}
```

### Complete React Implementation

```tsx
import { useState, useEffect } from 'react';
import axios from 'axios';

function MyHabitsPage() {
  const [habitsData, setHabitsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchMyHabits();
  }, [filter]);

  const fetchMyHabits = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/staff/my-habits?status=${filter}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHabitsData(response.data.data);
    } catch (error) {
      console.error('Error fetching habits:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleHabit = async (habitId: string, completed: boolean) => {
    const token = localStorage.getItem('token');

    try {
      if (completed) {
        await axios.post(
          `/staff/my-habits/${habitId}/complete`,
          {},
          { headers: { Authorization: `Bearer ${token}` } },
        );
      } else {
        await axios.patch(
          `/staff/my-habits/${habitId}/uncomplete`,
          {},
          { headers: { Authorization: `Bearer ${token}` } },
        );
      }

      // Refresh data
      fetchMyHabits();
    } catch (error) {
      console.error('Error toggling habit:', error);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="my-habits-page">
      {/* Header */}
      <div className="page-header">
        <h1>Assigned by Coaches</h1>
        <span className="coaches-count">
          {habitsData?.summary.totalCoaches} coaches
        </span>
      </div>

      {/* Summary Stats */}
      <div className="summary-stats">
        <div className="stat-card">
          <span className="stat-value">
            {habitsData?.summary.completedToday}
          </span>
          <span className="stat-label">Completed Today</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{habitsData?.summary.pendingToday}</span>
          <span className="stat-label">Pending</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">
            {habitsData?.summary.overallCompletionPercentage}%
          </span>
          <span className="stat-label">Overall Progress</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs">
        <button
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          className={filter === 'completed' ? 'active' : ''}
          onClick={() => setFilter('completed')}
        >
          Completed
        </button>
        <button
          className={filter === 'pending' ? 'active' : ''}
          onClick={() => setFilter('pending')}
        >
          Pending
        </button>
      </div>

      {/* Coaches List */}
      <div className="coaches-list">
        {habitsData?.assignedByCoaches.map((coachData) => (
          <CoachHabitCard
            key={coachData.coach.id}
            coach={coachData.coach}
            completionStatus={coachData.completionStatus}
            completionPercentage={coachData.completionPercentage}
            habits={coachData.habits}
            onToggleHabit={handleToggleHabit}
          />
        ))}
      </div>

      {/* Empty State */}
      {habitsData?.assignedByCoaches.length === 0 && (
        <div className="empty-state">
          <p>No habits assigned yet</p>
        </div>
      )}
    </div>
  );
}

export default MyHabitsPage;
```

---

## 🎨 CSS Styling

```css
/* Coach Card */
.coach-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.coach-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.coach-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.coach-info .avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.coach-info h3 {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  color: #1f2937;
}

.completion-status {
  font-size: 14px;
  color: #6b7280;
  margin: 4px 0 0 0;
}

.completion-indicator {
  display: flex;
  align-items: center;
  gap: 12px;
}

.progress-bar {
  width: 120px;
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #ec4899 0%, #8b5cf6 100%);
  transition: width 0.3s ease;
}

.percentage {
  font-weight: 600;
  color: #8b5cf6;
  min-width: 40px;
}

/* Habit Item */
.habit-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
  margin-bottom: 8px;
  transition: background 0.2s;
}

.habit-item:hover {
  background: #f3f4f6;
}

.habit-item.completed {
  background: #ede9fe;
}

.habit-checkbox {
  position: relative;
}

.habit-checkbox input[type='checkbox'] {
  appearance: none;
  width: 24px;
  height: 24px;
  border: 2px solid #d1d5db;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  background: white;
}

.habit-checkbox input[type='checkbox']:checked {
  background: #8b5cf6;
  border-color: #8b5cf6;
}

.habit-checkbox .checkmark {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 16px;
  pointer-events: none;
  opacity: 0;
}

.habit-checkbox input[type='checkbox']:checked + label .checkmark {
  opacity: 1;
}

.habit-details {
  flex: 1;
}

.habit-title {
  font-size: 15px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 4px 0;
}

.habit-description {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 8px 0;
}

.habit-meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.frequency {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #9ca3af;
}

/* Summary Stats */
.summary-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.stat-value {
  display: block;
  font-size: 32px;
  font-weight: 700;
  color: #8b5cf6;
  margin-bottom: 8px;
}

.stat-label {
  display: block;
  font-size: 14px;
  color: #6b7280;
}

/* Filter Tabs */
.filter-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
}

.filter-tabs button {
  padding: 8px 16px;
  border: 1px solid #e5e7eb;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.filter-tabs button.active {
  background: #8b5cf6;
  color: white;
  border-color: #8b5cf6;
}
```

---

## 🔧 cURL Examples

### Get All My Habits

```bash
curl -X GET 'http://localhost:3000/staff/my-habits' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### Filter by Completed Status

```bash
curl -X GET 'http://localhost:3000/staff/my-habits?status=completed' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### Filter by Coach

```bash
curl -X GET 'http://localhost:3000/staff/my-habits?coachId=coach-uuid-123' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### Search Habits

```bash
curl -X GET 'http://localhost:3000/staff/my-habits?search=meditation' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### Mark Habit as Completed

```bash
curl -X POST 'http://localhost:3000/staff/my-habits/habit-uuid-123/complete' \
  -H 'Authorization: Bearer YOUR_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{"proofUrl": "https://example.com/proof.jpg"}'
```

### Unmark Habit

```bash
curl -X PATCH 'http://localhost:3000/staff/my-habits/habit-uuid-123/uncomplete' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

---

## 🗄️ Database Schema Relationships

```
User (Staff)
  │
  ├─── HabitAssignment (assigned habits)
  │       ├─── assignedBy → User (Coach)
  │       ├─── habitId → MicroHabit
  │       ├─── startDate, endDate (active period)
  │       └─── userId → User (Staff)
  │
  ├─── HabitLog (completion records)
  │       ├─── habitId → MicroHabit
  │       ├─── date (completion date)
  │       ├─── completed (true/false)
  │       └─── proofUrl (optional proof)
  │
  └─── MicroHabit (habit details)
          ├─── title
          ├─── description
          └─── points
```

---

## 📊 Data Flow

1. **Fetch Assignments**: Get all active HabitAssignments for the staff
2. **Get Today's Logs**: Query HabitLogs for today's completion status
3. **Group by Coach**: Group habits by the `assignedBy` user (coach)
4. **Calculate Stats**: Compute completion percentages per coach
5. **Return Response**: Send formatted data to frontend

---

## ✅ Features Implemented

- ✅ View all assigned habits grouped by coaches
- ✅ See completion status per coach
- ✅ Filter by completion status (all/completed/pending)
- ✅ Filter by specific coach
- ✅ Search habits by title
- ✅ Mark habits as completed
- ✅ Unmark habits (mark as incomplete)
- ✅ View overall progress statistics
- ✅ Track completion percentage per coach
- ✅ Display habit frequency (Daily)

---

## 🧪 Testing Scenarios

### Test Case 1: Staff with Multiple Coaches

```bash
# Expected: Multiple coach cards with their respective habits
GET /staff/my-habits
```

### Test Case 2: Staff with No Habits

```bash
# Expected: Empty assignedByCoaches array
GET /staff/my-habits
```

### Test Case 3: Filter Completed Habits

```bash
# Expected: Only habits with isCompletedToday = true
GET /staff/my-habits?status=completed
```

### Test Case 4: Mark Habit as Completed

```bash
# Expected: Success message and habit log created
POST /staff/my-habits/{habitId}/complete
```

### Test Case 5: Unmark Non-existent Habit

```bash
# Expected: Error message "Habit log not found for today"
PATCH /staff/my-habits/{habitId}/uncomplete
```

---

## 🔐 Security

- ✅ JWT authentication required
- ✅ Staff role validation
- ✅ User can only see their own assigned habits
- ✅ Assignment period validation (startDate/endDate)
- ✅ No cross-user data access

---

## 📈 Performance

- Efficient grouping with JavaScript Map
- Single query for all assignments
- Single query for today's logs
- O(n) complexity for grouping
- Optimized with database indexes

---

## 🚀 Future Enhancements

- [ ] Habit streak tracking
- [ ] Points leaderboard
- [ ] Push notifications for incomplete habits
- [ ] Habit reminders
- [ ] Photo proof upload
- [ ] Habit notes/comments
- [ ] Weekly/Monthly reports
- [ ] Achievement badges

---

**Last Updated:** February 14, 2026  
**Version:** 1.0.0  
**Status:** ✅ Production Ready
