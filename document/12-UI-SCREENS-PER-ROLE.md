# E2E Service System - UI Screens Per Role

## 1. Super Admin Screens

### 1.1 Platform Dashboard
```
┌─────────────────────────────────────────────────────────────┐
│  E2E Platform Admin                    [Profile] [Logout]   │
├─────────────────────────────────────────────────────────────┤
│  📊 Platform Overview                                       │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │ Active   │  │  Total   │  │ Monthly  │  │ Support  │  │
│  │ Tenants  │  │  Users   │  │ Revenue  │  │ Tickets  │  │
│  │   25     │  │  5,000   │  │ $12,500  │  │    3     │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
│                                                              │
│  📋 Recent Tenants                                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Acme Corp      │ Growth  │ 50 users  │ Active      │  │
│  │ Beta Inc       │ Enterprise│ 200 users│ Active      │  │
│  │ Gamma Ltd      │ Starter │ 25 users  │ Suspended   │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  [+ Create New Tenant]  [View All Tenants]  [Templates]    │
└─────────────────────────────────────────────────────────────┘
```

**Components**:
- KPI Cards (Active Tenants, Total Users, Revenue, Tickets)
- Tenant List Table (Name, Plan, Users, Status)
- Action Buttons (Create Tenant, View All, Templates)

---

### 1.2 Create Tenant Screen
```
┌─────────────────────────────────────────────────────────────┐
│  ← Back to Dashboard                                        │
├─────────────────────────────────────────────────────────────┤
│  Create New Tenant                                          │
│                                                              │
│  Tenant Details                                             │
│  ┌────────────────────────────────────────────────────┐    │
│  │ Company Name *                                     │    │
│  │ [                                                  ]│    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │ Subdomain *                                        │    │
│  │ [                    ].e2e.com                     │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │ Admin Email *                                      │    │
│  │ [                                                  ]│    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  Billing Plan                                               │
│  ○ Starter ($99/mo)  ● Growth ($299/mo)  ○ Enterprise      │
│                                                              │
│  [Cancel]                              [Create Tenant]      │
└─────────────────────────────────────────────────────────────┘
```

**Components**:
- Form Inputs (Company Name, Subdomain, Admin Email)
- Radio Buttons (Billing Plan)
- Action Buttons (Cancel, Create)

---

### 1.3 Templates Library
```
┌─────────────────────────────────────────────────────────────┐
│  Global Templates                                           │
├─────────────────────────────────────────────────────────────┤
│  [+ Create Template]                          [Search...]   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ 90-Day Pilot Template                                │  │
│  │ Type: Program  │  Used by: 15 tenants  │  [Edit]    │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Manager Toolkit                                      │  │
│  │ Type: Document │  Used by: 20 tenants  │  [Edit]    │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Coaching Log Template                                │  │
│  │ Type: Form     │  Used by: 25 tenants  │  [Edit]    │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Client Admin Screens

### 2.1 Organization Dashboard
```
┌─────────────────────────────────────────────────────────────┐
│  Acme Corp                    [Settings] [Profile] [Logout] │
├─────────────────────────────────────────────────────────────┤
│  📊 Organization Overview                                   │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │Complaints│  │   CSAT   │  │ Adoption │  │  Repeat  │  │
│  │ ↓ 22%    │  │ ↑ 1.8 pts│  │   85%    │  │ ↑ 15%    │  │
│  │    ✅    │  │    ⚠️    │  │    ✅    │  │    ✅    │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
│                                                              │
│  📈 Trends (Last 90 Days)                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ [Line Chart: CSAT & Complaints]                      │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  🗺️ Branch Variance                                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ 🟢 Accra Main: 90    🟡 Tema Branch: 70             │  │
│  │ 🟢 Kumasi: 85        🔴 Takoradi: 55                │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  [View Branches] [Export Report] [Import Metrics]          │
└─────────────────────────────────────────────────────────────┘
```

**Components**:
- KPI Cards with Status Badges
- Line Chart (Trends)
- Branch Heatmap (Color-coded)
- Action Buttons

---

### 2.2 Branches Management
```
┌─────────────────────────────────────────────────────────────┐
│  Branches                                                   │
├─────────────────────────────────────────────────────────────┤
│  [+ Add Branch]  [Import CSV]                 [Search...]   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Branch      │ Region  │ Manager    │ Staff │ Status │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │ Accra Main  │ Gr.Accra│ John Doe   │  25   │ 🟢 90  │  │
│  │ Kumasi      │ Ashanti │ Jane Smith │  20   │ 🟢 85  │  │
│  │ Tema        │ Gr.Accra│ Mike Jones │  15   │ 🟡 70  │  │
│  │ Takoradi    │ Western │ Sarah Lee  │  18   │ 🔴 55  │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  [Export CSV]                                               │
└─────────────────────────────────────────────────────────────┘
```

---

### 2.3 Users Management
```
┌─────────────────────────────────────────────────────────────┐
│  Users                                                      │
├─────────────────────────────────────────────────────────────┤
│  [+ Add User]  [Import CSV]    Filter: [All Roles ▼]       │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Name        │ Email         │ Role    │ Branch      │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │ John Doe    │ john@acme.com │ Manager │ Accra Main  │  │
│  │ Jane Smith  │ jane@acme.com │ Coach   │ Kumasi      │  │
│  │ Mike Jones  │ mike@acme.com │ Staff   │ Tema        │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  Showing 1-10 of 150 users        [< Previous] [Next >]    │
└─────────────────────────────────────────────────────────────┘
```

---

### 2.4 Settings Screen
```
┌─────────────────────────────────────────────────────────────┐
│  Settings                                                   │
├─────────────────────────────────────────────────────────────┤
│  Organization Details                                       │
│  ┌────────────────────────────────────────────────────┐    │
│  │ Name: Acme Corp                                    │    │
│  │ Industry: Banking                                  │    │
│  │ Timezone: Africa/Accra                             │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  Targets                                                    │
│  ┌────────────────────────────────────────────────────┐    │
│  │ Complaints Reduction: -20%                         │    │
│  │ CSAT Improvement: +2 points                        │    │
│  │ Adoption Rate: 80%                                 │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  Notifications                                              │
│  ☑ Email  ☑ SMS  ☐ WhatsApp  ☐ Slack                      │
│                                                              │
│  Integrations                                               │
│  [Connect Zendesk]  [Connect Azure AD]  [Connect Google]   │
│                                                              │
│  [Save Changes]                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Manager Screens

### 3.1 Branch Dashboard
```
┌─────────────────────────────────────────────────────────────┐
│  Accra Main Branch - Manager: John Doe                     │
├─────────────────────────────────────────────────────────────┤
│  📋 Today's Tasks                                           │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ ☐ Run daily huddle (10 min)                         │  │
│  │ ☐ Log coaching for 3 staff                          │  │
│  │ ☐ Review team adherence                             │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  📊 Team Performance                                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                 │
│  │ Team     │  │ Habits   │  │ Roleplays│                 │
│  │Adherence │  │Completed │  │  Scored  │                 │
│  │   85%    │  │   120    │  │    15    │                 │
│  └──────────┘  └──────────┘  └──────────┘                 │
│                                                              │
│  📝 Recent Coaching Logs                                    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ John Doe - Tone of voice - 2 hours ago              │  │
│  │ Jane Smith - Eye contact - 5 hours ago              │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  [Log Coaching]  [Schedule Session]  [View Team]           │
└─────────────────────────────────────────────────────────────┘
```

---

### 3.2 Daily Huddle Screen
```
┌─────────────────────────────────────────────────────────────┐
│  Daily Huddle - 15 Minutes                                  │
├─────────────────────────────────────────────────────────────┤
│  Step 1: Review Yesterday (5 min)                           │
│  ┌────────────────────────────────────────────────────┐    │
│  │ What went well? (Hits)                             │    │
│  │ [                                                  ]│    │
│  │                                                     │    │
│  │ What didn't? (Misses)                              │    │
│  │ [                                                  ]│    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  Step 2: Assign Roleplay (3 min)                            │
│  ┌────────────────────────────────────────────────────┐    │
│  │ Scenario: [Select from library ▼]                  │    │
│  │ Assign to: ☑ John  ☑ Jane  ☐ Mike                 │    │
│  │ Deadline: [Today ▼]                                │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  Step 3: Log Coaching (5 min)                               │
│  ┌────────────────────────────────────────────────────┐    │
│  │ Staff: [Select ▼]                                  │    │
│  │ Topic: [                                          ]│    │
│  │ Notes: [                                          ]│    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  Step 4: Blockers (2 min)                                   │
│  ☐ Any blockers preventing progress?                        │
│                                                              │
│  [Cancel]                          [Complete Huddle]        │
└─────────────────────────────────────────────────────────────┘
```

---

### 3.3 Team View
```
┌─────────────────────────────────────────────────────────────┐
│  Team Members (25)                                          │
├─────────────────────────────────────────────────────────────┤
│  Filter: [All ▼]  Sort: [Adherence ▼]        [Search...]   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Name      │ Habits │ Streak │ Roleplays │ Status    │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │ John Doe  │ 90%    │ 🔥 14  │ 4.5/5     │ 🟢 Great  │  │
│  │ Jane Smith│ 85%    │ 🔥 7   │ 4.0/5     │ 🟢 Good   │  │
│  │ Mike Jones│ 60%    │ 🔥 3   │ 3.5/5     │ 🟡 Needs  │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  [Assign Habit]  [Schedule Roleplay]  [Export]             │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. Coach/Trainer Screens

### 4.1 Training Dashboard
```
┌─────────────────────────────────────────────────────────────┐
│  Training Dashboard - Coach: Sarah Lee                      │
├─────────────────────────────────────────────────────────────┤
│  📅 Upcoming Sessions                                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Roleplay: Angry Customer - Tomorrow 10am - 8 staff  │  │
│  │ Clinic: Empathy Basics - Friday 2pm - 12 staff      │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  📊 Session Stats                                           │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                 │
│  │ Sessions │  │ Roleplays│  │  Avg     │                 │
│  │This Month│  │  Scored  │  │  Score   │                 │
│  │    12    │  │    45    │  │  4.2/5   │                 │
│  └──────────┘  └──────────┘  └──────────┘                 │
│                                                              │
│  📚 Roleplay Library                                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Handling Angry Customer - Banking - Medium          │  │
│  │ De-escalation Techniques - Telecom - Hard           │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  [+ Schedule Session]  [View All Sessions]  [Library]      │
└─────────────────────────────────────────────────────────────┘
```

---

### 4.2 Score Roleplay Screen
```
┌─────────────────────────────────────────────────────────────┐
│  Score Roleplay - Handling Angry Customer                  │
├─────────────────────────────────────────────────────────────┤
│  Staff: John Doe                                            │
│                                                              │
│  Scoring Rubric (1-5 scale)                                 │
│  ┌────────────────────────────────────────────────────┐    │
│  │ Empathy:           ○ 1  ○ 2  ○ 3  ● 4  ○ 5        │    │
│  │ Communication:     ○ 1  ○ 2  ○ 3  ○ 4  ● 5        │    │
│  │ Problem Solving:   ○ 1  ○ 2  ● 3  ○ 4  ○ 5        │    │
│  │ Tone of Voice:     ○ 1  ○ 2  ○ 3  ● 4  ○ 5        │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  Average Score: 4.0 / 5.0                                   │
│                                                              │
│  Feedback Notes                                             │
│  ┌────────────────────────────────────────────────────┐    │
│  │ Good empathy shown. Work on tone when customer     │    │
│  │ raises voice. Practice staying calm.               │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  Improvement Tips                                           │
│  ┌────────────────────────────────────────────────────┐    │
│  │ - Practice deep breathing before responding        │    │
│  │ - Use phrases like "I understand your frustration" │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  [Cancel]                              [Save & Submit]      │
└─────────────────────────────────────────────────────────────┘
```

---

## 5. Staff Screens (Mobile)

### 5.1 Home Screen
```
┌─────────────────────────┐
│  Hi, John! 👋           │
│  Accra Main Branch      │
├─────────────────────────┤
│  📝 Today's Habit       │
│  ┌───────────────────┐ │
│  │ Greet 3 customers │ │
│  │ with a smile and  │ │
│  │ eye contact       │ │
│  │                   │ │
│  │ [Mark Complete]   │ │
│  └───────────────────┘ │
│                         │
│  🔥 Your Streak         │
│  7 days in a row!       │
│                         │
│  🎉 Recent Kudos        │
│  "Great job with that   │
│   angry customer!"      │
│  - Manager, 2h ago      │
│                         │
│  [View Badges]          │
│  [Give Kudos]           │
└─────────────────────────┘
```

---

### 5.2 Complete Habit Screen
```
┌─────────────────────────┐
│  ← Back                 │
├─────────────────────────┤
│  Today's Habit          │
│                         │
│  Greet 3 customers with │
│  a smile and eye contact│
│                         │
│  Instructions:          │
│  • Make eye contact     │
│  • Smile genuinely      │
│  • Say "Good morning"   │
│                         │
│  Upload Proof (Optional)│
│  [📷 Take Photo]        │
│  [📹 Record Video]      │
│                         │
│  Notes (Optional)       │
│  ┌───────────────────┐ │
│  │                   │ │
│  └───────────────────┘ │
│                         │
│  [Mark Complete]        │
└─────────────────────────┘
```

---

### 5.3 Personal Dashboard
```
┌─────────────────────────┐
│  My Progress            │
├─────────────────────────┤
│  🔥 Current Streak      │
│  7 days                 │
│                         │
│  🏆 Badges Earned       │
│  ┌─────┐ ┌─────┐       │
│  │ 7D  │ │ 14D │       │
│  │ 🔥  │ │ ⭐  │       │
│  └─────┘ └─────┘       │
│                         │
│  📊 This Month          │
│  Habits: 28/30 (93%)    │
│  Roleplays: 4 (Avg 4.2) │
│  Kudos: 5 received      │
│                         │
│  🎯 Next Milestone      │
│  30-day streak (23 more)│
│                         │
│  [View History]         │
└─────────────────────────┘
```

---

## 6. Executive Viewer Screens

### 6.1 Executive Dashboard
```
┌─────────────────────────────────────────────────────────────┐
│  Executive View - Acme Corp                    [Logout]     │
├─────────────────────────────────────────────────────────────┤
│  📊 KPI Summary                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │Complaints│  │   CSAT   │  │  Repeat  │  │ Adoption │  │
│  │ ↓ 22%    │  │ ↑ 1.8 pts│  │ ↑ 15%    │  │   85%    │  │
│  │    ✅    │  │    ⚠️    │  │    ✅    │  │    ✅    │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
│                                                              │
│  📈 90-Day Trend                                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ [Line Chart: Baseline vs Current]                    │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  🗺️ Branch Performance                                      │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ 🟢 Accra Main: 90    🟡 Tema: 70                     │  │
│  │ 🟢 Kumasi: 85        🔴 Takoradi: 55                 │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  [Download Scorecard PDF]  [Export Data]  [View Details]   │
└─────────────────────────────────────────────────────────────┘
```

---

### 6.2 Executive Scorecard (PDF Preview)
```
┌─────────────────────────────────────────────────────────────┐
│  EXECUTIVE SCORECARD                                        │
│  From Empathy to KPIs — Month 3                            │
├─────────────────────────────────────────────────────────────┤
│  📊 Results                                                 │
│  • Complaints: ↓ 22% (Target: 20-25%) ✅ ON TRACK         │
│  • CSAT: ↑ 1.8 points (Target: +2) ⚠️ NEEDS IMPROVEMENT   │
│  • Adoption: 85% (Target: 80%) ✅ ON TRACK                 │
│  • Time to Resolve: ↓ 30% (48h → 34h)                     │
│                                                              │
│  🏆 Top Performers                                          │
│  • Accra Main: 90% adherence, ↓ 30% complaints             │
│  • Kumasi: +2.5 CSAT improvement                           │
│                                                              │
│  ⚠️ Lagging Branches                                        │
│  • Takoradi: 55% adherence, ↓ 10% complaints               │
│  • Action: Increase manager coaching                        │
│                                                              │
│  📈 Next Steps                                              │
│  1. Focus on CSAT improvement (0.2 pts to go)              │
│  2. Scale to 5 more branches in Q2                         │
│                                                              │
│  [Download PDF]                                             │
└─────────────────────────────────────────────────────────────┘
```
