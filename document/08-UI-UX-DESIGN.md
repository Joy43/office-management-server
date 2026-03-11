# E2E Service System - UI/UX Design

## 1. Design Principles

- **Multi-Tenant Aware**: Clear tenant branding (logo, colors)
- **Role-Based**: Different dashboards for each role
- **Mobile-First**: Responsive PWA for staff
- **Fast**: p95 page load < 2s
- **Accessible**: WCAG AA compliant

## 2. Color Palette

```
Primary Blue:    #3B82F6
Success Green:   #10B981
Warning Yellow:  #F59E0B
Danger Red:      #EF4444
Gray 900:        #111827
Gray 100:        #F3F4F6
White:           #FFFFFF
```

## 3. Typography

```
Font Family: Inter, sans-serif
Headings: 700 weight
Body: 400 weight
```

## 4. Screen Layouts

### Super Admin Dashboard
```
┌─────────────────────────────────────────┐
│  E2E Platform                           │
├─────────────────────────────────────────┤
│  Active Tenants: 25                     │
│  Total Users: 5,000                     │
│  Monthly Revenue: $12,500               │
│                                         │
│  Recent Tenants:                        │
│  - Acme Corp (50 users)                │
│  - Beta Inc (200 users)                │
│                                         │
│  [Create New Tenant]                    │
└─────────────────────────────────────────┘
```

### Client Admin Dashboard
```
┌─────────────────────────────────────────┐
│  Acme Corp Overview                     │
├─────────────────────────────────────────┤
│  KPIs:                                  │
│  - Complaints: ↓ 22% ✅                 │
│  - CSAT: ↑ 1.8 points ⚠️                │
│  - Adoption: 85% ✅                      │
│                                         │
│  Branch Variance:                       │
│  🟢 Accra Main: 90                      │
│  🟡 Tema Branch: 70                     │
│  🔴 Kumasi Branch: 55                   │
│                                         │
│  [View Branches] [Export Report]        │
└─────────────────────────────────────────┘
```

### Manager Dashboard
```
┌─────────────────────────────────────────┐
│  Today's Tasks                          │
├─────────────────────────────────────────┤
│  ☐ Run daily huddle (10 min)           │
│  ☐ Log coaching for 3 staff            │
│  ☐ Review team adherence               │
│                                         │
│  Team Adherence: 85%                    │
│  [Progress Bar]                         │
│                                         │
│  Recent Coaching Logs:                  │
│  - John Doe - 2 hours ago              │
│  - Jane Smith - 5 hours ago            │
│                                         │
│  [Log Coaching] [Schedule Session]      │
└─────────────────────────────────────────┘
```

### Staff Mobile App
```
┌─────────────────────────┐
│  Hi, John! 👋           │
├─────────────────────────┤
│  Today's Habit          │
│  ┌───────────────────┐ │
│  │ Greet 3 customers │ │
│  │ with a smile      │ │
│  │ [Mark Complete]   │ │
│  └───────────────────┘ │
│                         │
│  Your Streak: 🔥 7 days │
│                         │
│  Recent Kudos:          │
│  "Great job!" - Manager │
│                         │
│  [View Badges]          │
└─────────────────────────┘
```

## 5. Key Components

### KPI Card
- Title (e.g., "Complaints")
- Value (e.g., "40")
- Change (e.g., "↓ 20%")
- Color-coded (green/yellow/red)

### Branch Heatmap
- Grid of branches
- Color-coded by score
- Click to view details

### Session Card
- Title, date, duration
- Attendees count
- Status badge
- Actions (Edit, Delete)

### Coaching Log Form
- Staff dropdown
- Topic input
- Notes textarea
- File upload
- Submit button

## 6. Responsive Breakpoints

```
Mobile:  < 640px
Tablet:  641px - 1024px
Desktop: > 1025px
```

## 7. Accessibility

- Color contrast: 4.5:1 minimum
- Keyboard navigation
- Screen reader labels
- Focus indicators

## 8. PWA Features

- Offline support
- Add to home screen
- Push notifications
- Background sync
