# E2E Service System - Prisma Schema Documentation

## Overview

This document maps each Prisma schema file to its corresponding documentation source, providing a clear understanding of how the database models align with the system requirements.

---

## Schema Organization by Document

### 📄 **tenant-organization.prisma**

**Source Documents:**

- `01-PROJECT-OVERVIEW.md` - Multi-Tenant SaaS Platform
- `03-MULTI-TENANT-ARCHITECTURE.md` - Tenant Structure

**Models:**

1. **Tenant** - Main multi-tenant entity representing each client organization
   - Fields: id, name, subdomain, plan, status, locale, timezone
   - Plans: Starter, Growth, Enterprise
   - Status: Active, Suspended, Cancelled

2. **Organization** - One per tenant, represents client's organization
   - Fields: id, tenantId, name, industry, targets, baselineMetrics
   - Targets: {complaints: -20, csat: 2, adoption: 80}
   - Relations: branches, users, programs, microHabits, kpiAlerts

3. **Branch** - Regional/location-based divisions
   - Fields: id, tenantId, orgId, name, region, managerId, staffCount
   - Relations: users, sessions, metrics, habitAssignments

---

### 👥 **user.prisma** (Updated)

**Source Documents:**

- `02-USER-ROLES-PERMISSIONS.md` - Role Hierarchy & Permissions
- `04-DATA-MODEL-SCHEMA.md` - User Entity Definition

**Models:**

1. **User** - Multi-tenant user with role-based access
   - Multi-tenant fields: tenantId, orgId, branchId
   - Identity: name, email, password, firstName, lastName, phone
   - Settings: role, status, isVerified, isOnline
   - Relations to E2E system: organization, branch, sessions, roleplays, habits, coaching

**Enums:**

- **UserRole**: SUPER_ADMIN, CLIENT_ADMIN, MANAGER, TAINER, EXECUTIVE, STAFF
  - SUPER_ADMIN: E2E Team, manages all tenants
  - CLIENT_ADMIN: HR Director, manages organization
  - MANAGER: Manager, runs huddles and assigns tasks
  - TAINER: Coach/Trainer, scores roleplays
  - EXECUTIVE: Executive Viewer, read-only access
  - STAFF: Frontline staff, completes tasks

- **UserStatus**: ACTIVE, INACTIVE, DELETED

---

### 🎓 **program-session.prisma**

**Source Documents:**

- `04-DATA-MODEL-SCHEMA.md` - Program & Session Entities
- `07-FEATURES-MODULES.md` - Session Planner Features

**Models:**

1. **Program** - Training programs (e.g., 90-day pilot)
   - Fields: id, tenantId, orgId, name, startDate, endDate, targets, status
   - Contains multiple sessions
   - Tracks specific targets: {complaints: -20, csat: 2}

2. **Session** - Individual training/meeting sessions
   - Fields: id, tenantId, programId, branchId, type, title, scheduledAt
   - Type: Huddle, Roleplay, Clinic, Workshop
   - Duration: 15 minutes default for huddles
   - Relations: program, branch, facilitator, attendances, roleplays

3. **Attendance** - Tracks session participation
   - Fields: id, tenantId, sessionId, userId, attended, notes
   - Immutable attendance records

**Enums:**

- **SessionType**: Huddle, Roleplay, Clinic, Workshop

---

### 🎭 **roleplay-habit.prisma**

**Source Documents:**

- `04-DATA-MODEL-SCHEMA.md` - Roleplay & Habits Entities
- `07-FEATURES-MODULES.md` - Classroom-to-Behavior Adoption

**Models:**

1. **RoleplayScenario** - Library of roleplay scenarios
   - Fields: title, scenario, sector, difficulty, durationMin, videoUrl
   - Can be global (tenantId = NULL) or tenant-specific
   - Sector-specific: Banking, Retail, Healthcare

2. **Roleplay** - Individual roleplay performance
   - Fields: id, tenantId, sessionId, userId, scenarioId, score, coachNotes
   - Score: 1-5 scale
   - Includes video recording capability

3. **MicroHabit** - Daily habits (10-15 min actions)
   - Fields: title, description, frequency, points
   - Created at org level
   - Frequency: Daily, Weekly, Custom
   - Points system for gamification

4. **HabitAssignment** - Assigns habits to users/branches
   - Can assign to individual users or entire branches
   - Tracks: assignedBy, startDate, endDate

5. **HabitLog** - Daily habit completion tracking
   - Fields: habitId, userId, date, completed, proofUrl
   - One log per habit per user per day (unique constraint)
   - Optional proof upload (photo/video)

**Enums:**

- **DifficultyLevel**: Easy, Medium, Hard, Expert

---

### 📝 **coaching-recognition.prisma**

**Source Documents:**

- `04-DATA-MODEL-SCHEMA.md` - Coaching & Recognition Entities
- `07-FEATURES-MODULES.md` - Leadership Accountability

**Models:**

1. **CoachingLog** - Manager coaching session logs
   - Fields: managerId, staffId, date, topic, notes, evidenceUrl
   - Approval flow: approved, approvedBy
   - **Immutable** - timestamped and cannot be deleted
   - Audit-ready for compliance

2. **Recognition** - Peer-to-peer kudos/recognition
   - Fields: fromUserId, toUserId, tag, note
   - Tags: Empathy, Teamwork, Initiative, etc.
   - Feeds into leaderboard system

---

### 📊 **metrics-alerts.prisma**

**Source Documents:**

- `04-DATA-MODEL-SCHEMA.md` - Metrics & Alerts Entities
- `07-FEATURES-MODULES.md` - Measurement & ROI Dashboard

**Models:**

1. **Metric** - Performance metrics
   - Types: CSAT, Complaints, RepeatCustomer, TimeToResolve, NPS, FCR
   - Source: Manual CSV upload or API sync (Zendesk, Freshdesk)
   - Branch-level tracking for variance analysis

2. **KpiAlert** - Automated alerts for KPI thresholds
   - Monitors metrics and triggers when thresholds breached
   - Status: Active, Triggered, Resolved
   - Example: Alert if CSAT drops ≥ 2 points

3. **VarianceSnapshot** - Branch performance comparison
   - Calculated periodically (weekly/monthly)
   - Ranks branches (1 = best performer)
   - Shows % variance from organization average
   - Used for branch variance heatmap

**Enums:**

- **MetricType**: CSAT, Complaints, RepeatCustomer, TimeToResolve, NPS, FCR

---

### 📋 **templates-billing.prisma**

**Source Documents:**

- `04-DATA-MODEL-SCHEMA.md` - Templates & Billing Entities
- `07-FEATURES-MODULES.md` - Templates Library & Billing

**Models:**

1. **Template** - Content templates
   - Types: Pilot, Huddle, Coaching, Leadership Brief
   - Can be global (Super Admin) or tenant-specific
   - Content stored as JSON with placeholders
   - Example placeholders: {org_name}, {branch_name}

2. **Subscription** - Tenant billing subscriptions
   - Plans: Starter ($99), Growth ($299), Enterprise (Custom)
   - Billing cycle: Monthly, Annual
   - Stripe integration via stripeSubscriptionId

3. **UsageLog** - Tracks tenant usage for billing
   - Metrics: active_users, sms_credits, storage_gb, api_calls
   - Daily tracking for usage-based billing

4. **Invoice** - Billing invoices
   - Auto-generated monthly
   - Status: Paid, Pending, Failed, Refunded
   - Stripe integration via stripeInvoiceId

---

## Data Flow Examples

### Example 1: New Tenant Onboarding

```
1. Super Admin creates Tenant (tenant-organization.prisma)
2. System creates Organization for tenant
3. Client Admin imports Branches
4. Client Admin imports Users with roles (user.prisma)
5. System creates welcome Template (templates-billing.prisma)
6. Subscription created with plan (templates-billing.prisma)
```

### Example 2: Daily Huddle Flow

```
1. Manager creates Session (program-session.prisma)
   - Type: Huddle, Duration: 15min
2. Staff members attend session
3. System records Attendance (program-session.prisma)
4. Manager assigns Roleplay (roleplay-habit.prisma)
5. Coach scores Roleplay performance
6. Manager logs CoachingLog (coaching-recognition.prisma)
7. UsageLog updated for session (templates-billing.prisma)
```

### Example 3: ROI Tracking

```
1. System imports Metrics from CSV (metrics-alerts.prisma)
   - CSAT, Complaints data by branch
2. System calculates VarianceSnapshot (metrics-alerts.prisma)
   - Ranks branches by performance
3. KpiAlert triggered if threshold breached
4. Client Admin views dashboard
5. Executive exports scorecard (Template PDF)
```

---

## Multi-Tenant Data Isolation

All tenant-scoped tables include `tenantId` field with indexes:

- `@@index([tenantId, ...])`
- Ensures row-level security
- Prevents cross-tenant data access

### Tenant-Scoped Tables:

- Organization, Branch, User
- Program, Session, Attendance
- Roleplay, MicroHabit, HabitLog
- CoachingLog, Recognition
- Metric, KpiAlert
- UsageLog

### Global Tables (No tenantId):

- Tenant (root level)
- Template (when isGlobal = true)
- RoleplayScenario (when tenantId = NULL)

---

## Key Features by Document

### From 01-PROJECT-OVERVIEW.md

- ✅ Multi-tenant architecture
- ✅ ROI-focused metrics tracking
- ✅ Leadership accountability
- ✅ Behavior adoption tracking

### From 02-USER-ROLES-PERMISSIONS.md

- ✅ Role hierarchy (6 roles)
- ✅ Permission matrix
- ✅ Branch-level access control

### From 03-MULTI-TENANT-ARCHITECTURE.md

- ✅ Tenant isolation (tenantId in all tables)
- ✅ Row-level security ready
- ✅ Subdomain-based identification

### From 04-DATA-MODEL-SCHEMA.md

- ✅ All 20+ entities implemented
- ✅ Relations properly defined
- ✅ Indexes for performance

### From 07-FEATURES-MODULES.md

- ✅ Session planner
- ✅ Roleplay scoring
- ✅ Micro-habits tracking
- ✅ Coaching logs (immutable)
- ✅ Metrics & alerts
- ✅ Templates & billing

---

## Success Metrics Tracking

The schema enables tracking of all key success metrics:

1. **Complaints Reduction** (Metric model)
   - Target: ↓ 20-25% in 60-90 days
   - Tracked via MetricType.Complaints

2. **CSAT Improvement** (Metric model)
   - Target: ↑ +2 points in 60-90 days
   - Tracked via MetricType.CSAT

3. **Adoption Rate** (HabitLog, Attendance models)
   - Target: 80%+ habit completion, 90%+ attendance
   - Calculated from completion rates

4. **Leadership Engagement** (CoachingLog model)
   - Target: 100% commitment logging, weekly check-ins
   - Tracked via immutable coaching logs

---

## Next Steps

1. **Generate Prisma Client**

   ```bash
   npx prisma generate
   ```

2. **Create Migration**

   ```bash
   npx prisma migrate dev --name add_e2e_service_system
   ```

3. **Review Generated Schema**
   - Check `prisma/generated/` for TypeScript types
   - Verify all relations are correct

4. **Implement Services**
   - Create NestJS services for each domain
   - Implement tenant context middleware
   - Add row-level security

---

## Schema Statistics

- **Total Models**: 20+
- **Document Sources**: 4 main documents
- **Tenant-Scoped Models**: 17
- **Global Models**: 3
- **Enums**: 5
- **Relations**: 40+ foreign keys
- **Indexes**: 25+ for performance

---

## Document Reference Map

| Schema File                 | Primary Document                | Secondary Documents     |
| --------------------------- | ------------------------------- | ----------------------- |
| tenant-organization.prisma  | 03-MULTI-TENANT-ARCHITECTURE.md | 01-PROJECT-OVERVIEW.md  |
| user.prisma                 | 02-USER-ROLES-PERMISSIONS.md    | 04-DATA-MODEL-SCHEMA.md |
| program-session.prisma      | 04-DATA-MODEL-SCHEMA.md         | 07-FEATURES-MODULES.md  |
| roleplay-habit.prisma       | 04-DATA-MODEL-SCHEMA.md         | 07-FEATURES-MODULES.md  |
| coaching-recognition.prisma | 04-DATA-MODEL-SCHEMA.md         | 07-FEATURES-MODULES.md  |
| metrics-alerts.prisma       | 04-DATA-MODEL-SCHEMA.md         | 07-FEATURES-MODULES.md  |
| templates-billing.prisma    | 04-DATA-MODEL-SCHEMA.md         | 07-FEATURES-MODULES.md  |

---

_Generated for E2E Service System - Multi-Tenant SaaS Platform_
