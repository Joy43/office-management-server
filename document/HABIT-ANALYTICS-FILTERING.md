# Habit Analytics Filtering - Complete Documentation

## 🎯 Overview

The Habit Analytics endpoint now supports filtering by three different time periods:

- **Weekly** - Last 7 days (Mon-Sun)
- **Monthly** - Last 30 days grouped by weeks
- **Yearly** - Last 12 months

---

## 📡 API Endpoint

### Get Habit Analysis with Filter

```http
GET /staff/dashboard/habit-analysis?period={period}
```

**Authentication:** Required (Bearer Token - STAFF role)

**Query Parameters:**

| Parameter | Type   | Required | Default  | Options                       |
| --------- | ------ | -------- | -------- | ----------------------------- |
| `period`  | string | No       | `Weekly` | `Weekly`, `Monthly`, `Yearly` |

---

## 📊 Response Formats

### 1. Weekly Analytics

**Request:**

```bash
GET /staff/dashboard/habit-analysis?period=Weekly
# or simply
GET /staff/dashboard/habit-analysis
```

**Response:**

```json
{
  "success": true,
  "data": {
    "period": "Weekly",
    "dateRange": {
      "start": "2026-02-10",
      "end": "2026-02-16"
    },
    "percentageChange": 12,
    "chartData": [
      {
        "label": "Mon",
        "date": "2026-02-10",
        "completedHabits": 4
      },
      {
        "label": "Tue",
        "date": "2026-02-11",
        "completedHabits": 5
      },
      {
        "label": "Wed",
        "date": "2026-02-12",
        "completedHabits": 6
      },
      {
        "label": "Thu",
        "date": "2026-02-13",
        "completedHabits": 6
      },
      {
        "label": "Fri",
        "date": "2026-02-14",
        "completedHabits": 7
      },
      {
        "label": "Sat",
        "date": "2026-02-15",
        "completedHabits": 5
      },
      {
        "label": "Sun",
        "date": "2026-02-16",
        "completedHabits": 4
      }
    ],
    "summary": {
      "totalCompleted": 37,
      "averagePerPeriod": 5.3
    }
  }
}
```

**Chart Visualization:**

- **X-Axis:** `label` (Mon, Tue, Wed, Thu, Fri, Sat, Sun)
- **Y-Axis:** `completedHabits` (0-10+)
- **Data Points:** 7 days

---

### 2. Monthly Analytics

**Request:**

```bash
GET /staff/dashboard/habit-analysis?period=Monthly
```

**Response:**

```json
{
  "success": true,
  "data": {
    "period": "Monthly",
    "dateRange": {
      "start": "2026-01-13",
      "end": "2026-02-12"
    },
    "percentageChange": 15,
    "chartData": [
      {
        "label": "Week 1",
        "dateRange": "2026-01-13 - 2026-01-19",
        "completedHabits": 28
      },
      {
        "label": "Week 2",
        "dateRange": "2026-01-20 - 2026-01-26",
        "completedHabits": 32
      },
      {
        "label": "Week 3",
        "dateRange": "2026-01-27 - 2026-02-02",
        "completedHabits": 30
      },
      {
        "label": "Week 4",
        "dateRange": "2026-02-03 - 2026-02-09",
        "completedHabits": 35
      }
    ],
    "summary": {
      "totalCompleted": 125,
      "averagePerPeriod": 4.2
    }
  }
}
```

**Chart Visualization:**

- **X-Axis:** `label` (Week 1, Week 2, Week 3, Week 4)
- **Y-Axis:** `completedHabits` (0-50+)
- **Data Points:** 4 weeks
- **Hover Info:** Show `dateRange` on hover

---

### 3. Yearly Analytics

**Request:**

```bash
GET /staff/dashboard/habit-analysis?period=Yearly
```

**Response:**

```json
{
  "success": true,
  "data": {
    "period": "Yearly",
    "dateRange": {
      "start": "2025-03-01",
      "end": "2026-02-12"
    },
    "percentageChange": 25,
    "chartData": [
      {
        "label": "Mar",
        "month": "2025-03",
        "completedHabits": 95
      },
      {
        "label": "Apr",
        "month": "2025-04",
        "completedHabits": 102
      },
      {
        "label": "May",
        "month": "2025-05",
        "completedHabits": 110
      },
      {
        "label": "Jun",
        "month": "2025-06",
        "completedHabits": 105
      },
      {
        "label": "Jul",
        "month": "2025-07",
        "completedHabits": 98
      },
      {
        "label": "Aug",
        "month": "2025-08",
        "completedHabits": 115
      },
      {
        "label": "Sep",
        "month": "2025-09",
        "completedHabits": 120
      },
      {
        "label": "Oct",
        "month": "2025-10",
        "completedHabits": 118
      },
      {
        "label": "Nov",
        "month": "2025-11",
        "completedHabits": 125
      },
      {
        "label": "Dec",
        "month": "2025-12",
        "completedHabits": 130
      },
      {
        "label": "Jan",
        "month": "2026-01",
        "completedHabits": 128
      },
      {
        "label": "Feb",
        "month": "2026-02",
        "completedHabits": 85
      }
    ],
    "summary": {
      "totalCompleted": 1331,
      "averagePerPeriod": 110.9
    }
  }
}
```

**Chart Visualization:**

- **X-Axis:** `label` (Mar, Apr, May, ..., Feb)
- **Y-Axis:** `completedHabits` (0-150+)
- **Data Points:** 12 months
- **Hover Info:** Show full `month` (YYYY-MM) on hover

---

## 🎨 UI Implementation Guide

### Dropdown Filter Component

```tsx
import { useState } from 'react';

function PeriodFilter({ value, onChange }) {
  const periods = [
    { value: 'Weekly', label: 'Weekly' },
    { value: 'Monthly', label: 'Monthly' },
    { value: 'Yearly', label: 'Yearly' },
  ];

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="period-dropdown"
    >
      {periods.map((period) => (
        <option key={period.value} value={period.value}>
          {period.label}
        </option>
      ))}
    </select>
  );
}
```

### Complete Dashboard Component

```tsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';

function HabitAnalytics() {
  const [period, setPeriod] = useState('Weekly');
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchAnalytics() {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(
          `/staff/dashboard/habit-analysis?period=${period}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setAnalytics(response.data.data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, [period]);

  if (loading) return <LoadingSpinner />;
  if (!analytics) return null;

  const chartData = {
    labels: analytics.chartData.map((d) => d.label),
    datasets: [
      {
        label: 'Completed Habits',
        data: analytics.chartData.map((d) => d.completedHabits),
        borderColor: '#8B5CF6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          afterLabel: (context) => {
            const item = analytics.chartData[context.dataIndex];
            if (item.date) return `Date: ${item.date}`;
            if (item.dateRange) return `Period: ${item.dateRange}`;
            if (item.month) return `Month: ${item.month}`;
            return '';
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <div className="habit-analytics">
      <div className="analytics-header">
        <h2>Habit Analytics</h2>
        <div className="controls">
          <span
            className={`change-badge ${analytics.percentageChange >= 0 ? 'positive' : 'negative'}`}
          >
            {analytics.percentageChange >= 0 ? '+' : ''}
            {analytics.percentageChange}%
          </span>
          <PeriodFilter value={period} onChange={setPeriod} />
        </div>
      </div>

      <div className="chart-container">
        <Line data={chartData} options={chartOptions} />
      </div>

      <div className="analytics-summary">
        <div className="summary-item">
          <span className="label">Total Completed:</span>
          <span className="value">{analytics.summary.totalCompleted}</span>
        </div>
        <div className="summary-item">
          <span className="label">
            Average per {period.toLowerCase().slice(0, -2)}:
          </span>
          <span className="value">{analytics.summary.averagePerPeriod}</span>
        </div>
        <div className="summary-item">
          <span className="label">Period:</span>
          <span className="value">
            {analytics.dateRange.start} to {analytics.dateRange.end}
          </span>
        </div>
      </div>
    </div>
  );
}
```

---

## 🧮 Calculation Logic

### Weekly Analytics

- **Time Range:** Current week (Mon-Sun)
- **Data Points:** 7 days
- **Comparison:** Previous week (7 days before)
- **Average:** Total / 7

### Monthly Analytics

- **Time Range:** Last 30 days
- **Data Points:** 4 weeks (7 days each)
- **Comparison:** Previous 30 days
- **Average:** Total / 30

### Yearly Analytics

- **Time Range:** Last 12 months
- **Data Points:** 12 months
- **Comparison:** Previous 12 months
- **Average:** Total / 12

---

## 📝 DTO Specification

### HabitAnalysisFilterDto

**File:** `src/main/staff/dto/habit-analysis-filter.dto.ts`

```typescript
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

export enum AnalyticsPeriod {
  WEEKLY = 'Weekly',
  MONTHLY = 'Monthly',
  YEARLY = 'Yearly',
}

export class HabitAnalysisFilterDto {
  @ApiPropertyOptional({
    description: 'Time period for habit analytics',
    enum: AnalyticsPeriod,
    default: AnalyticsPeriod.WEEKLY,
    example: AnalyticsPeriod.WEEKLY,
  })
  @IsOptional()
  @IsEnum(AnalyticsPeriod, {
    message: 'Period must be one of: Weekly, Monthly, Yearly',
  })
  period?: AnalyticsPeriod = AnalyticsPeriod.WEEKLY;
}
```

---

## 🔧 cURL Examples

### Weekly

```bash
curl -X GET 'http://localhost:3000/staff/dashboard/habit-analysis?period=Weekly' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### Monthly

```bash
curl -X GET 'http://localhost:3000/staff/dashboard/habit-analysis?period=Monthly' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### Yearly

```bash
curl -X GET 'http://localhost:3000/staff/dashboard/habit-analysis?period=Yearly' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### Default (Weekly)

```bash
curl -X GET 'http://localhost:3000/staff/dashboard/habit-analysis' \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

---

## ⚠️ Validation & Error Handling

### Invalid Period

**Request:**

```bash
GET /staff/dashboard/habit-analysis?period=Daily
```

**Response:** 400 Bad Request

```json
{
  "statusCode": 400,
  "message": ["Period must be one of: Weekly, Monthly, Yearly"],
  "error": "Bad Request"
}
```

### Missing Token

**Response:** 401 Unauthorized

```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

### Wrong Role

**Response:** 403 Forbidden

```json
{
  "statusCode": 403,
  "message": "Access denied. Staff role required."
}
```

---

## 🎯 Response Field Mapping

### Common Fields (All Periods)

| Field                           | Type    | Description                             |
| ------------------------------- | ------- | --------------------------------------- |
| `success`                       | boolean | Always true for successful responses    |
| `data.period`                   | string  | Selected period (Weekly/Monthly/Yearly) |
| `data.dateRange.start`          | string  | Start date (YYYY-MM-DD)                 |
| `data.dateRange.end`            | string  | End date (YYYY-MM-DD)                   |
| `data.percentageChange`         | number  | % change from previous period           |
| `data.chartData`                | array   | Data points for chart                   |
| `data.summary.totalCompleted`   | number  | Total habits completed                  |
| `data.summary.averagePerPeriod` | number  | Average per time unit                   |

### Weekly chartData Item

| Field             | Type   | Example            |
| ----------------- | ------ | ------------------ |
| `label`           | string | "Mon", "Tue", etc. |
| `date`            | string | "2026-02-10"       |
| `completedHabits` | number | 5                  |

### Monthly chartData Item

| Field             | Type   | Example                   |
| ----------------- | ------ | ------------------------- |
| `label`           | string | "Week 1", "Week 2", etc.  |
| `dateRange`       | string | "2026-01-13 - 2026-01-19" |
| `completedHabits` | number | 28                        |

### Yearly chartData Item

| Field             | Type   | Example            |
| ----------------- | ------ | ------------------ |
| `label`           | string | "Jan", "Feb", etc. |
| `month`           | string | "2026-01"          |
| `completedHabits` | number | 110                |

---

## 🚀 Performance Considerations

### Query Optimization

**Weekly:**

- 7 database queries (one per day)
- Expected time: 50-100ms

**Monthly:**

- 4 database queries (one per week)
- Expected time: 80-150ms

**Yearly:**

- 12 database queries (one per month)
- Expected time: 150-300ms

### Caching Recommendations

```typescript
// Example caching strategy
const cacheKey = `habit-analytics:${staffId}:${period}:${currentDate}`;
const cacheTTL = {
  Weekly: 300, // 5 minutes
  Monthly: 1800, // 30 minutes
  Yearly: 3600, // 1 hour
};
```

---

## 🧪 Testing Scenarios

### Test Case 1: Weekly with Current Week Data

```bash
GET /staff/dashboard/habit-analysis?period=Weekly

Expected: 7 data points (Mon-Sun)
```

### Test Case 2: Monthly with 30 Days

```bash
GET /staff/dashboard/habit-analysis?period=Monthly

Expected: 4 data points (4 weeks)
```

### Test Case 3: Yearly with 12 Months

```bash
GET /staff/dashboard/habit-analysis?period=Yearly

Expected: 12 data points (12 months)
```

### Test Case 4: Default Period

```bash
GET /staff/dashboard/habit-analysis

Expected: Weekly data (same as Test Case 1)
```

### Test Case 5: Invalid Period

```bash
GET /staff/dashboard/habit-analysis?period=Invalid

Expected: 400 Bad Request with validation error
```

---

## 📊 Chart Library Examples

### Chart.js

```typescript
import { Line } from 'react-chartjs-2';

<Line
  data={chartData}
  options={{
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    }
  }}
/>
```

### Recharts

```typescript
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

<LineChart data={analytics.chartData}>
  <CartesianGrid strokeDasharray="3 3" />
  <XAxis dataKey="label" />
  <YAxis />
  <Tooltip />
  <Line
    type="monotone"
    dataKey="completedHabits"
    stroke="#8B5CF6"
  />
</LineChart>
```

### ApexCharts

```typescript
import Chart from 'react-apexcharts';

<Chart
  type="line"
  series={[{
    name: 'Completed Habits',
    data: analytics.chartData.map(d => d.completedHabits)
  }]}
  options={{
    xaxis: {
      categories: analytics.chartData.map(d => d.label)
    }
  }}
/>
```

---

## 📱 Mobile Responsive Considerations

### Chart Height Adjustments

```css
.chart-container {
  height: 300px; /* Desktop */
}

@media (max-width: 768px) {
  .chart-container {
    height: 200px; /* Mobile */
  }
}
```

### Period Selector on Mobile

```css
.period-dropdown {
  width: 100%;
  padding: 10px;
}

@media (min-width: 768px) {
  .period-dropdown {
    width: auto;
    min-width: 120px;
  }
}
```

---

## 🎨 UI/UX Best Practices

1. **Show Loading State** - Display skeleton or spinner while fetching
2. **Smooth Transitions** - Animate chart changes when switching periods
3. **Clear Labels** - Show what the percentage change represents
4. **Tooltip Info** - Display detailed information on hover
5. **Empty State** - Show helpful message when no data available
6. **Error Handling** - Display user-friendly error messages

---

## 🔄 State Management Example

### Redux Toolkit

```typescript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchHabitAnalytics = createAsyncThunk(
  'analytics/fetch',
  async ({ period }: { period: string }) => {
    const token = localStorage.getItem('token');
    const response = await axios.get(
      `/staff/dashboard/habit-analysis?period=${period}`,
      { headers: { Authorization: `Bearer ${token}` } },
    );
    return response.data.data;
  },
);

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState: {
    data: null,
    period: 'Weekly',
    loading: false,
    error: null,
  },
  reducers: {
    setPeriod: (state, action) => {
      state.period = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHabitAnalytics.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchHabitAnalytics.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(fetchHabitAnalytics.rejected, (state, action) => {
        state.error = action.error.message;
        state.loading = false;
      });
  },
});
```

---

## ✅ Summary

### What's New

- ✅ Period filter DTO created
- ✅ Three analytics periods supported (Weekly, Monthly, Yearly)
- ✅ Controller updated with query parameter
- ✅ Service refactored into three private methods
- ✅ Consistent response format across all periods
- ✅ Percentage change calculation for each period
- ✅ Proper validation and error handling

### Breaking Changes

⚠️ **Response structure updated:**

- `weeklyData` → `chartData`
- `weekRange` → `dateRange`
- `day` → `label`
- `averagePerDay` → `averagePerPeriod`

### Migration Guide

If you're upgrading from the old version:

```typescript
// Old
data.weeklyData.map((d) => d.day); // "Mon", "Tue", etc.
data.weekRange.start; // "2026-02-10"

// New
data.chartData.map((d) => d.label); // "Mon", "Week 1", "Jan", etc.
data.dateRange.start; // "2026-02-10"
```

---

**Last Updated:** February 12, 2026  
**Version:** 2.0.0  
**Status:** ✅ Complete with Filtering
