# 📊 Habit Analytics - Visual Chart Guide

## Chart Visualization Examples

### 1️⃣ Weekly Chart (Default)

```
Habit Analytics  +12%  [Weekly ▼]

    8 ┤
    7 ┤         ●
    6 ┤     ●───●───●
    5 ┤   ●         ●
    4 ┤ ●               ●
    3 ┤
    2 ┤
    1 ┤
    0 ┴─────────────────────────
      Mon Tue Wed Thu Fri Sat Sun

Total: 37 habits | Average: 5.3/day
Period: Feb 10 - Feb 16, 2026
```

**Data Points:** 7 days  
**X-Axis:** Day names (Mon-Sun)  
**Y-Axis:** Completed habits count

---

### 2️⃣ Monthly Chart

```
Habit Analytics  +15%  [Monthly ▼]

   40 ┤
   35 ┤               ■
   32 ┤       ■
   30 ┤           ■
   28 ┤   ■
   25 ┤
   20 ┤
   15 ┤
   10 ┤
    5 ┤
    0 ┴─────────────────────
      W1   W2   W3   W4

Total: 125 habits | Average: 4.2/day
Period: Jan 13 - Feb 12, 2026

Hover Details:
W1: Jan 13-19 (28 habits)
W2: Jan 20-26 (32 habits)
W3: Jan 27-Feb 2 (30 habits)
W4: Feb 3-9 (35 habits)
```

**Data Points:** 4 weeks  
**X-Axis:** Week numbers  
**Y-Axis:** Completed habits per week

---

### 3️⃣ Yearly Chart

```
Habit Analytics  +25%  [Yearly ▼]

  140 ┤
  130 ┤                         ●
  120 ┤                     ●─●─┘
  110 ┤     ●───●       ●─●
  100 ┤ ●─●─┘   └───●─●─┘
   90 ┤─┘
   80 ┤
   60 ┤
   40 ┤
   20 ┤
    0 ┴────────────────────────────────────────────
      Mar Apr May Jun Jul Aug Sep Oct Nov Dec Jan Feb

Total: 1,331 habits | Average: 110.9/month
Period: Mar 2025 - Feb 2026
```

**Data Points:** 12 months  
**X-Axis:** Month names  
**Y-Axis:** Completed habits per month

---

## UI Component Layout

```
┌─────────────────────────────────────────────────────────┐
│  Habit Analytics                    +12% ↑  [Weekly ▼] │
├─────────────────────────────────────────────────────────┤
│                                                          │
│                    📈 CHART AREA                        │
│              (Line graph with data points)              │
│                                                          │
├─────────────────────────────────────────────────────────┤
│  📊 Total: 37 habits                                    │
│  📈 Average: 5.3 per day                                │
│  📅 Period: Feb 10 - Feb 16, 2026                       │
└─────────────────────────────────────────────────────────┘
```

---

## Color Scheme Recommendations

### Chart Line/Area

```css
/* Primary Line */
.chart-line {
  stroke: #8b5cf6; /* Purple */
  stroke-width: 3px;
  fill: none;
}

/* Area Fill (optional) */
.chart-area {
  fill: rgba(139, 92, 246, 0.1); /* Light purple */
}

/* Data Points */
.chart-points {
  fill: #8b5cf6;
  stroke: white;
  stroke-width: 2px;
  r: 5px;
}
```

### Percentage Change Badge

```css
/* Positive Change */
.badge-positive {
  background: #10b981; /* Green */
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
}

/* Negative Change */
.badge-negative {
  background: #ef4444; /* Red */
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
}
```

---

## Interactive Features

### Tooltip on Hover

**Weekly:**

```
┌─────────────────────┐
│ Tuesday             │
│ Feb 11, 2026        │
│ 5 habits completed  │
└─────────────────────┘
```

**Monthly:**

```
┌─────────────────────┐
│ Week 2              │
│ Jan 20 - Jan 26     │
│ 32 habits completed │
└─────────────────────┘
```

**Yearly:**

```
┌─────────────────────┐
│ April 2025          │
│ 102 habits completed│
│ +7% from March      │
└─────────────────────┘
```

---

## Dropdown States

### Closed State

```
┌────────────┐
│ Weekly  ▼  │
└────────────┘
```

### Open State

```
┌────────────┐
│ Weekly  ▲  │ ← Selected
├────────────┤
│ Monthly    │
│ Yearly     │
└────────────┘
```

---

## Responsive Design

### Desktop (> 768px)

```
┌────────────────────────────────────────────┐
│  Habit Analytics          +12% [Weekly ▼]  │
│                                             │
│        ╭───────────────────────╮           │
│        │                       │           │
│        │   LARGE CHART AREA    │           │
│        │   (Height: 300px)     │           │
│        │                       │           │
│        ╰───────────────────────╯           │
│                                             │
│  Total: 37  |  Avg: 5.3  |  Period: ...   │
└────────────────────────────────────────────┘
```

### Mobile (< 768px)

```
┌──────────────────────┐
│  Habit Analytics     │
│  +12%  [Weekly ▼]    │
├──────────────────────┤
│                      │
│   COMPACT CHART      │
│   (Height: 200px)    │
│                      │
├──────────────────────┤
│  Total: 37           │
│  Average: 5.3        │
│  Period: Feb 10-16   │
└──────────────────────┘
```

---

## Animation Suggestions

### On Period Change

```typescript
// Smooth transition when switching periods
chart.update({
  duration: 800,
  easing: 'easeInOutQuart',
});
```

### On Data Point Hover

```css
.chart-point:hover {
  r: 7px; /* Enlarge from 5px */
  transition: r 0.2s ease;
}
```

### Loading State

```
┌─────────────────────────────────┐
│  Habit Analytics    [Weekly ▼]  │
├─────────────────────────────────┤
│                                  │
│     ░░░░░░░░░░░░░░░░░░░░░      │
│     ░░░░░░░░░░░░░░░░░░░░░      │ ← Skeleton
│     ░░░░░░░░░░░░░░░░░░░░░      │
│                                  │
└─────────────────────────────────┘
```

---

## Chart Library Configuration

### Chart.js

```javascript
const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      padding: 12,
      cornerRadius: 8,
      callbacks: {
        title: (items) => items[0].label,
        label: (item) => `${item.parsed.y} habits completed`,
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 1,
        color: '#6B7280',
      },
      grid: {
        color: '#E5E7EB',
        drawBorder: false,
      },
    },
    x: {
      ticks: { color: '#6B7280' },
      grid: { display: false },
    },
  },
  interaction: {
    mode: 'index',
    intersect: false,
  },
};
```

### Recharts

```jsx
<ResponsiveContainer width="100%" height={300}>
  <LineChart data={chartData}>
    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
    <XAxis dataKey="label" stroke="#6B7280" style={{ fontSize: 12 }} />
    <YAxis stroke="#6B7280" style={{ fontSize: 12 }} />
    <Tooltip
      contentStyle={{
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        border: 'none',
        borderRadius: 8,
        color: 'white',
      }}
    />
    <Line
      type="monotone"
      dataKey="completedHabits"
      stroke="#8B5CF6"
      strokeWidth={3}
      dot={{ fill: '#8B5CF6', r: 5 }}
      activeDot={{ r: 7 }}
    />
  </LineChart>
</ResponsiveContainer>
```

---

## Empty State Design

```
┌─────────────────────────────────┐
│  Habit Analytics    [Weekly ▼]  │
├─────────────────────────────────┤
│                                  │
│         📊                       │
│    No data available             │
│                                  │
│  Start completing habits to      │
│  see your analytics here!        │
│                                  │
│     [View All Habits]            │
│                                  │
└─────────────────────────────────┘
```

---

## Error State Design

```
┌─────────────────────────────────┐
│  Habit Analytics    [Weekly ▼]  │
├─────────────────────────────────┤
│                                  │
│         ⚠️                       │
│   Failed to load data            │
│                                  │
│  Please check your connection    │
│  and try again.                  │
│                                  │
│     [Retry]                      │
│                                  │
└─────────────────────────────────┘
```

---

## Accessibility Features

### Keyboard Navigation

- Tab to focus dropdown
- Arrow keys to select period
- Enter to confirm selection
- Escape to close dropdown

### Screen Reader Support

```html
<div role="region" aria-label="Habit Analytics Chart">
  <select aria-label="Select time period" aria-describedby="period-description">
    <option value="Weekly">Weekly</option>
    <option value="Monthly">Monthly</option>
    <option value="Yearly">Yearly</option>
  </select>

  <canvas
    role="img"
    aria-label="Line chart showing habit completion trend"
  ></canvas>

  <div role="status" aria-live="polite">
    Showing weekly data: 37 habits completed, average 5.3 per day, 12% increase
    from last week
  </div>
</div>
```

---

## Performance Tips

### Optimize Rendering

```typescript
// Memoize chart data
const chartData = useMemo(
  () => ({
    labels: analytics?.chartData.map((d) => d.label),
    datasets: [
      {
        data: analytics?.chartData.map((d) => d.completedHabits),
        borderColor: '#8B5CF6',
        tension: 0.4,
      },
    ],
  }),
  [analytics],
);

// Debounce period changes
const debouncedPeriodChange = useCallback(
  debounce((newPeriod) => {
    setPeriod(newPeriod);
  }, 300),
  [],
);
```

### Lazy Loading

```typescript
// Load chart library only when needed
const Chart = lazy(() => import('./Chart'));

<Suspense fallback={<ChartSkeleton />}>
  <Chart data={chartData} />
</Suspense>
```

---

## Print Styles

```css
@media print {
  .period-dropdown {
    display: none; /* Hide dropdown when printing */
  }

  .chart-container {
    page-break-inside: avoid;
    height: 400px;
  }

  .analytics-summary {
    font-size: 14px;
    margin-top: 20px;
  }
}
```

---

**Last Updated:** February 12, 2026  
**Version:** 2.0.0  
**Status:** ✅ Visual Guide Complete
