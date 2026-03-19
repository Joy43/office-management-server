# E2E Service System - Workflow Diagrams

## 1. Full Project Workflow (90-Day Pilot)

```mermaid
graph TD
    A[Super Admin Creates Tenant] --> B[Client Admin Receives Welcome Email]
    B --> C[Client Admin Sets Targets]
    C --> D[Import Branches & Users CSV]
    D --> E[Assign Roles to Users]
    E --> F[Schedule Leadership Kickoff]
    F --> G[Log Leadership Commitments]
    G --> H[Launch 90-Day Pilot]
    
    H --> I[Week 1-2: Setup Phase]
    I --> J[Managers Download Toolkits]
    I --> K[Coaches Create Roleplay Scenarios]
    I --> L[Staff Receive Welcome Notifications]
    
    J --> M[Week 3-4: Launch Adoption]
    K --> M
    L --> M
    
    M --> N[Daily Manager Huddles]
    M --> O[Staff Complete Micro-Habits]
    M --> P[Coaches Run Roleplay Sessions]
    
    N --> Q[Week 5-8: Scale & Monitor]
    O --> Q
    P --> Q
    
    Q --> R[Client Admin Reviews Metrics Weekly]
    Q --> S[Alerts Fire for Lagging Branches]
    Q --> T[Managers Approve Coaching Logs]
    
    R --> U[Week 9-12: Measure ROI]
    S --> U
    T --> U
    
    U --> V[Compare Baseline vs Current]
    V --> W[Generate Executive Scorecard]
    W --> X{Targets Met?}
    
    X -->|Yes| Y[Scale to More Branches]
    X -->|No| Z[Adjust Strategy & Continue]
    
    Y --> AA[Success! 🎉]
    Z --> Q
```

---

## 2. Super Admin Workflow

```mermaid
graph LR
    A[Super Admin Login] --> B[Platform Dashboard]
    
    B --> C[Create New Tenant]
    C --> C1[Enter Tenant Details]
    C1 --> C2[Set Subdomain]
    C2 --> C3[Assign Billing Plan]
    C3 --> C4[Send Welcome Email]
    
    B --> D[Manage Templates]
    D --> D1[Create Global Template]
    D1 --> D2[Upload Template Files]
    D2 --> D3[Publish to All Tenants]
    
    B --> E[Monitor Platform]
    E --> E1[View Active Tenants]
    E --> E2[Check Platform Health]
    E --> E3[Review Support Tickets]
    
    B --> F[Billing Management]
    F --> F1[View Revenue Dashboard]
    F --> F2[Manage Subscriptions]
    F --> F3[Handle Payment Issues]
```

---

## 3. Client Admin Workflow

```mermaid
graph TD
    A[Client Admin Login] --> B[Organization Dashboard]
    
    B --> C[Initial Setup]
    C --> C1[Set 90-Day Targets]
    C1 --> C2[Import Branches CSV]
    C2 --> C3[Import Users CSV]
    C3 --> C4[Assign Roles]
    
    B --> D[Daily Monitoring]
    D --> D1[View KPI Cards]
    D1 --> D2[Check Branch Variance]
    D2 --> D3[Review Alerts]
    
    B --> E[Weekly Tasks]
    E --> E1[Export Weekly Report]
    E --> E2[Review Lagging Branches]
    E --> E3[Adjust Targets if Needed]
    
    B --> F[Monthly Tasks]
    F --> F1[Generate Executive Scorecard]
    F --> F2[Schedule Leadership Review]
    F --> F3[Plan Next Month Actions]
    
    B --> G[Settings]
    G --> G1[Configure Notifications]
    G --> G2[Manage Integrations]
    G --> G3[Update Billing Info]
```

---

## 4. Manager Workflow

```mermaid
graph TD
    A[Manager Login] --> B[Branch Dashboard]
    
    B --> C[Daily Huddle 15min]
    C --> C1[Review Yesterday Hits/Misses]
    C1 --> C2[Assign 1 Roleplay]
    C2 --> C3[Log Coaching 1-Tap]
    C3 --> C4[Mark Blockers]
    C4 --> C5[Complete Huddle]
    
    B --> D[Team Management]
    D --> D1[View Team Adherence %]
    D1 --> D2[Identify Staff Needing Help]
    D2 --> D3[Assign Micro-Habits]
    
    B --> E[Coaching Logs]
    E --> E1[Review Pending Logs]
    E1 --> E2[Approve/Reject Logs]
    E2 --> E3[Export Audit CSV]
    
    B --> F[Weekly Review]
    F --> F1[View Branch Performance]
    F --> F2[Compare to Other Branches]
    F --> F3[Plan Next Week Focus]
```

---

## 5. Coach/Trainer Workflow

```mermaid
graph TD
    A[Coach Login] --> B[Training Dashboard]
    
    B --> C[Schedule Session]
    C --> C1[Select Session Type]
    C1 --> C2[Pick Roleplay Scenario]
    C2 --> C3[Set Date & Time]
    C3 --> C4[Select Attendees]
    C4 --> C5[Upload Materials]
    C5 --> C6[Send Reminders]
    
    B --> D[Run Session]
    D --> D1[Mark Attendance]
    D1 --> D2[Staff Perform Roleplay]
    D2 --> D3[Score Using Rubric 1-5]
    D3 --> D4[Provide Feedback]
    D4 --> D5[Log Coaching Notes]
    
    B --> E[Post-Session]
    E --> E1[Submit for Manager Approval]
    E1 --> E2[View Session Report]
    E2 --> E3[Identify Follow-up Needed]
```

---

## 6. Staff Workflow

```mermaid
graph TD
    A[Staff Login Mobile] --> B[Home Screen]
    
    B --> C[Today's Habit]
    C --> C1[Read Habit Description]
    C1 --> C2[Complete During Shift]
    C2 --> C3[Upload Proof Optional]
    C3 --> C4[Mark Complete]
    C4 --> C5[Check Streak 🔥]
    
    B --> D[Roleplay Session]
    D --> D1[Receive Reminder]
    D1 --> D2[Attend Session]
    D2 --> D3[Perform Roleplay]
    D3 --> D4[Receive Score & Feedback]
    
    B --> E[Recognition]
    E --> E1[View Kudos Received]
    E --> E2[Give Kudos to Colleague]
    E --> E3[Check Leaderboard]
    
    B --> F[Personal Dashboard]
    F --> F1[View Badges Earned]
    F --> F2[Check Streak History]
    F --> F3[See Progress]
```

---

## 7. Executive Viewer Workflow

```mermaid
graph LR
    A[Executive Login] --> B[Executive Dashboard]
    
    B --> C[Weekly Check]
    C --> C1[View KPI Summary]
    C1 --> C2[Check Branch Variance]
    C2 --> C3[Review Alerts]
    
    B --> D[Monthly Review]
    D --> D1[Download Executive Scorecard PDF]
    D1 --> D2[Review 3 Wins & 3 Risks]
    D2 --> D3[Share with Board]
    
    B --> E[Export Reports]
    E --> E1[Select Date Range]
    E --> E2[Choose Report Type]
    E --> E3[Download PDF/CSV]
```

---

## 8. Daily Huddle Workflow (Manager)

```mermaid
graph TD
    A[Start Huddle] --> B[Open Huddle Form]
    B --> C[Review Yesterday]
    C --> C1{Any Hits?}
    C1 -->|Yes| C2[Log Wins]
    C1 -->|No| C3[Log Misses]
    
    C2 --> D[Assign Roleplay]
    C3 --> D
    
    D --> D1[Select Scenario]
    D1 --> D2[Pick 2-3 Staff]
    D2 --> D3[Set Deadline]
    
    D3 --> E[Log Coaching]
    E --> E1[Select Staff]
    E1 --> E2[Enter Topic]
    E2 --> E3[Add Notes]
    E3 --> E4[Attach Evidence Optional]
    
    E4 --> F[Mark Blockers]
    F --> F1{Any Blockers?}
    F1 -->|Yes| F2[Log Blocker]
    F1 -->|No| F3[Skip]
    
    F2 --> G[Complete Huddle]
    F3 --> G
    G --> H[Save & Notify Team]
```

---

## 9. Micro-Habit Completion Workflow (Staff)

```mermaid
graph TD
    A[Morning 8am] --> B[Receive Push Notification]
    B --> C[Open Mobile App]
    C --> D[See Today's Habit]
    
    D --> E[During Shift]
    E --> E1[Complete Habit Action]
    E1 --> E2{Upload Proof?}
    E2 -->|Yes| E3[Take Photo/Video]
    E2 -->|No| E4[Skip Proof]
    
    E3 --> F[Mark Complete]
    E4 --> F
    
    F --> G[System Calculates Streak]
    G --> H{Milestone Reached?}
    H -->|7 Days| I[Award 7-Day Badge]
    H -->|14 Days| J[Award 14-Day Badge]
    H -->|30 Days| K[Award 30-Day Badge]
    H -->|No| L[Update Streak Counter]
    
    I --> M[Send Congratulations]
    J --> M
    K --> M
    L --> M
    
    M --> N[Notify Manager]
```

---

## 10. Roleplay Scoring Workflow (Coach)

```mermaid
graph TD
    A[Session Starts] --> B[Mark Attendance]
    B --> C[Staff Perform Roleplay]
    
    C --> D[Coach Observes]
    D --> E[Open Scoring Form]
    E --> E1[Select Staff]
    E1 --> E2[Use Rubric 1-5]
    
    E2 --> F{Score Categories}
    F --> F1[Empathy: 1-5]
    F --> F2[Communication: 1-5]
    F --> F3[Problem Solving: 1-5]
    
    F1 --> G[Calculate Average]
    F2 --> G
    F3 --> G
    
    G --> H[Add Feedback Notes]
    H --> I[Provide Improvement Tips]
    I --> J[Save Score]
    
    J --> K[Staff Sees Score Immediately]
    K --> L[Submit for Manager Approval]
    L --> M{Manager Approves?}
    M -->|Yes| N[Log Becomes Immutable]
    M -->|No| O[Coach Can Edit & Resubmit]
```

---

## 11. Alert & Notification Workflow

```mermaid
graph TD
    A[System Monitors Metrics] --> B{Threshold Breached?}
    
    B -->|Habit Completion < 70%| C[Create Alert]
    B -->|CSAT Drops ≥ 2 pts| C
    B -->|Manager Misses 2 Huddles| C
    B -->|No Issue| D[Continue Monitoring]
    
    C --> E[Determine Recipients]
    E --> E1[Client Admin]
    E --> E2[Manager]
    E --> E3[Coach if Relevant]
    
    E1 --> F[Send Notifications]
    E2 --> F
    E3 --> F
    
    F --> F1[Email]
    F --> F2[SMS if Enabled]
    F --> F3[In-App Notification]
    F --> F4[Push Notification]
    
    F1 --> G[Alert Shows in Dashboard]
    F2 --> G
    F3 --> G
    F4 --> G
    
    G --> H[User Takes Action]
    H --> I{Issue Resolved?}
    I -->|Yes| J[Mark Alert as Resolved]
    I -->|No| K[Escalate to Client Admin]
```

---

## 12. Branch Variance Calculation Workflow

```mermaid
graph TD
    A[Nightly Cron Job] --> B[Query All Branches]
    
    B --> C[For Each Branch]
    C --> D[Calculate Metrics]
    
    D --> D1[CSAT Average]
    D --> D2[Complaints Count]
    D --> D3[Adherence %]
    
    D1 --> E[Calculate Composite Score]
    D2 --> E
    D3 --> E
    
    E --> F[Formula: CSAT 40% + Complaints 30% + Adherence 30%]
    F --> G[Rank All Branches]
    
    G --> H{Assign Colors}
    H -->|Top 3| I[Green]
    H -->|Middle| J[Yellow]
    H -->|Bottom 3| K[Red]
    
    I --> L[Save to variance_snapshots]
    J --> L
    K --> L
    
    L --> M[Update Dashboard]
    M --> N[Send Alerts for Red Branches]
```

---

## 13. Data Flow: Metrics Import to Dashboard

```mermaid
graph LR
    A[Client Admin] --> B[Upload CSV]
    B --> C[API: Parse CSV]
    C --> D{Validation}
    D -->|Pass| E[Insert to Database]
    D -->|Fail| F[Return Errors]
    
    E --> G[Trigger Calculation Job]
    G --> H[Calculate Trends]
    H --> I[Update Redis Cache]
    I --> J[Dashboard Auto-Refreshes]
    
    F --> K[Show Error List]
    K --> L[User Fixes CSV]
    L --> B
```

---

## 14. Integration Sync Workflow (CSAT from Zendesk)

```mermaid
graph TD
    A[Daily Cron Job 2am] --> B[Check Integration Enabled]
    B --> C{Zendesk Connected?}
    C -->|Yes| D[Fetch CSAT Surveys]
    C -->|No| E[Skip]
    
    D --> F[API Call to Zendesk]
    F --> G[Get Surveys Since Last Sync]
    G --> H[Transform Data]
    
    H --> I[Insert to metrics Table]
    I --> J[Update last_sync_at]
    J --> K[Trigger Trend Calculation]
    
    K --> L[Update Dashboard]
    L --> M[Send Summary Email to Client Admin]
```

---

## 15. Tenant Lifecycle Workflow

```mermaid
graph TD
    A[Super Admin Creates Tenant] --> B[Status: Active]
    
    B --> C[Tenant Uses Platform]
    C --> D{Payment Successful?}
    D -->|Yes| C
    D -->|No| E[Status: Suspended]
    
    E --> F[Send Payment Reminder]
    F --> G{Payment Received?}
    G -->|Yes| B
    G -->|No After 7 Days| H[Status: Cancelled]
    
    H --> I[Data Retained 30 Days]
    I --> J{Reactivate?}
    J -->|Yes| B
    J -->|No After 30 Days| K[Status: Deleted]
    
    K --> L[Permanently Delete All Data]
    L --> M[Archive Tenant Record]
```
