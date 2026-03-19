# Staff Dashboard - Quick Reference Card

## 🚀 Quick Start

### Base URL

```
http://localhost:3000/staff/dashboard
```

### Authentication

All endpoints require JWT Bearer token with STAFF role.

```bash
Authorization: Bearer YOUR_ACCESS_TOKEN
```

---

## 📍 Endpoints

### 1️⃣ Dashboard Stats

```http
GET /staff/dashboard
```

**Returns:** Habit completed, total habits, best streak, today's progress

**Response Structure:**

```json
{
  "stats": {
    "habitCompleted": number,
    "totalHabits": number,
    "bestStreak": number
  },
  "todaysProgress": {
    "percentage": number,
    "habitsRemaining": number
  }
}
```

---

### 2️⃣ Habit Analytics

```http
GET /staff/dashboard/habit-analysis
```

**Returns:** Weekly habit trend (Mon-Sun) with percentage change

**Response Structure:**

```json
{
  "period": "Weekly",
  "weekRange": { "start": "date", "end": "date" },
  "percentageChange": number,
  "weeklyData": [
    { "day": "Mon", "completedHabits": number }
  ]
}
```

---

### 3️⃣ Today's Huddles

```http
GET /staff/dashboard/today-huddle
```

**Returns:** List of huddles scheduled for today

**Response Structure:**

```json
{
  "date": "YYYY-MM-DD",
  "totalHuddles": number,
  "huddles": [
    {
      "name": string,
      "duration": string,
      "dateTime": {...},
      "status": "scheduled|completed|cancelled",
      "participants": {...}
    }
  ]
}
```

---

## 🎨 UI Mapping

| UI Component               | API Endpoint       | Field Path                       |
| -------------------------- | ------------------ | -------------------------------- |
| **Habit Completed Card**   | `/staff/dashboard` | `stats.habitCompleted`           |
| **Total Habits Card**      | `/staff/dashboard` | `stats.totalHabits`              |
| **Best Streak Card**       | `/staff/dashboard` | `stats.bestStreak`               |
| **Progress Circle**        | `/staff/dashboard` | `todaysProgress.percentage`      |
| **Habits Remaining Badge** | `/staff/dashboard` | `todaysProgress.habitsRemaining` |
| **Analytics Chart**        | `/habit-analysis`  | `weeklyData[]`                   |
| **Percentage Change**      | `/habit-analysis`  | `percentageChange`               |
| **Huddles Table**          | `/today-huddle`    | `huddles[]`                      |

---

## 💻 Code Snippets

### Fetch All Dashboard Data

```typescript
async function fetchDashboard() {
  const token = getAuthToken();
  const headers = { Authorization: `Bearer ${token}` };

  const [stats, analysis, huddles] = await Promise.all([
    fetch('/staff/dashboard', { headers }).then((r) => r.json()),
    fetch('/staff/dashboard/habit-analysis', { headers }).then((r) => r.json()),
    fetch('/staff/dashboard/today-huddle', { headers }).then((r) => r.json()),
  ]);

  return { stats: stats.data, analysis: analysis.data, huddles: huddles.data };
}
```

### React Hook

```typescript
function useDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading };
}
```

---

## 🗄️ Database Tables

| Table                 | Purpose                        |
| --------------------- | ------------------------------ |
| `habit_assignments`   | Links habits to staff          |
| `habit_logs`          | Daily habit completion records |
| `micro_habits`        | Habit definitions              |
| `huddles`             | Meeting/huddle information     |
| `huddle_participants` | Participant status tracking    |

---

## 🔑 Key Calculations

### Best Streak

Longest consecutive days with at least one completed habit.

### Today's Progress

```
percentage = (completed / total) × 100
```

### Weekly Trend

Count completed habits for each day (Mon-Sun).

### Percentage Change

```
change = ((current_week - previous_week) / previous_week) × 100
```

---

## 🎯 Status Values

### Huddle Status

- `scheduled` - Not yet started
- `completed` - Finished
- `cancelled` - Cancelled

### Participant Status

- `pending` - Not yet joined
- `joined` - Currently in meeting
- `completed` - Finished attending
- `absent` - Did not attend

---

## 🔐 Security

✅ JWT authentication required  
✅ STAFF role validation  
✅ User can only see their own data  
✅ No cross-user data access

---

## 📊 Expected Response Times

| Endpoint        | Response Time |
| --------------- | ------------- |
| Dashboard Stats | 50-150ms      |
| Habit Analytics | 100-200ms     |
| Today's Huddles | 80-180ms      |

---

## ⚠️ Common Errors

| Code | Meaning      | Solution          |
| ---- | ------------ | ----------------- |
| 401  | Unauthorized | Check JWT token   |
| 403  | Forbidden    | Verify STAFF role |
| 500  | Server Error | Check logs        |

---

## 🧪 Test Cases

```bash
# Valid request
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:3000/staff/dashboard

# Expected: 200 OK with data

# No token
curl http://localhost:3000/staff/dashboard
# Expected: 401 Unauthorized

# Invalid role
curl -H "Authorization: Bearer MANAGER_TOKEN" \
  http://localhost:3000/staff/dashboard
# Expected: 403 Forbidden
```

---

## 📚 Documentation Links

- **API Docs:** `document/STAFF-DASHBOARD-API.md`
- **Summary:** `document/STAFF-DASHBOARD-SUMMARY.md`
- **Architecture:** `document/STAFF-DASHBOARD-ARCHITECTURE.md`
- **Service:** `src/main/staff/service/staff.dashboard.service.ts`
- **Controller:** `src/main/staff/controller/staff.dashboard.controller.ts`

---

## 🎁 Bonus Features

### Caching (Future)

Cache responses for 5-15 minutes to reduce load.

### Real-time Updates (Future)

WebSocket for live huddle status updates.

### Export (Future)

Download habit logs as CSV/PDF.

---

## 🆘 Troubleshooting

**Problem:** No habits showing  
**Solution:** Check if habits are assigned to staff

**Problem:** Best streak is 0  
**Solution:** Check if habit logs exist with completed=true

**Problem:** No huddles today  
**Solution:** Check if huddles are scheduled for today's date

**Problem:** Wrong timezone  
**Solution:** Verify server timezone settings

---

## 📞 Need Help?

1. Check the full API documentation
2. Review Prisma schema files
3. Check service implementation
4. Review test cases
5. Contact development team

---

**Last Updated:** February 12, 2026  
**Version:** 1.0.0  
**Status:** ✅ Production Ready
