# E2E Service System - User Roles & Permissions

## 1. Role Hierarchy

```
Super Admin (E2E Team)
    │
    ├── Tenant 1 (Client A)
    │   ├── Client Admin (HR Director)
    │   │   ├── Manager
    │   │   │   └── Frontline Staff
    │   │   ├── Coach/Trainer
    │   │   │   └── Frontline Staff
    │   │   └── Executive Viewer (read-only)
    │
    ├── Tenant 2 (Client B)
    │   └── [Same structure]
    │
    └── Tenant 3 (Client C)
        └── [Same structure]
```

## 2. Role Definitions

### 2.1 Super Admin (E2E Team)

**Responsibilities**:

- Create and manage client sub-accounts (tenants)
- Manage global templates
- Monitor platform health
- Provide support to clients

**Permissions**:

- ✅ Access all tenants
- ✅ Create/delete tenants
- ✅ Manage global templates
- ✅ View platform-wide analytics
- ✅ Manage billing

### 2.2 Client Admin (HR Director)

**Responsibilities**:

- Set organizational targets
- Add/manage branches and users
- View org-wide results
- Configure tenant settings

**Permissions**:

- ✅ Full access to own tenant
- ✅ Create/edit/delete branches
- ✅ Create/edit/delete users
- ✅ Set targets and KPIs
- ✅ View all dashboards
- ❌ Cannot access other tenants

### 2.3 Manager

**Responsibilities**:

- Run daily/weekly huddles
- Assign roleplays
- Approve coaching logs
- Monitor team performance

**Permissions**:

- ✅ Access own branch only
- ✅ Create/edit huddles
- ✅ Assign roleplays and habits
- ✅ Log coaching sessions
- ✅ View branch dashboard
- ❌ Cannot view other branches

### 2.4 Coach/Trainer

**Responsibilities**:

- Schedule training sessions
- Upload materials
- Score roleplays
- Provide feedback

**Permissions**:

- ✅ Create/edit sessions
- ✅ Upload materials
- ✅ Score roleplays
- ✅ Log coaching (requires Manager approval)
- ❌ Cannot approve coaching logs

### 2.5 Frontline Staff

**Responsibilities**:

- Complete daily micro-habits
- Participate in roleplays
- Attend huddles
- Submit surveys

**Permissions**:

- ✅ View own tasks
- ✅ Complete habits
- ✅ Participate in roleplays
- ✅ View personal dashboard
- ❌ Cannot view team data

### 2.6 Executive Viewer

**Responsibilities**:

- View read-only dashboards
- Monitor org-wide KPIs
- Export reports

**Permissions**:

- ✅ View all dashboards (read-only)
- ✅ Export reports
- ❌ Cannot edit anything

## 3. Permission Matrix

| Feature            | Super Admin | Client Admin | Manager | Coach | Staff | Executive |
| ------------------ | ----------- | ------------ | ------- | ----- | ----- | --------- |
| Create tenant      | ✅          | ❌           | ❌      | ❌    | ❌    | ❌        |
| Set targets        | ❌          | ✅           | ❌      | ❌    | ❌    | ❌        |
| Create branch      | ❌          | ✅           | ❌      | ❌    | ❌    | ❌        |
| Create user        | ❌          | ✅           | ❌      | ❌    | ❌    | ❌        |
| Create session     | ❌          | ✅           | ✅      | ✅    | ❌    | ❌        |
| Score roleplay     | ❌          | ✅           | ✅      | ✅    | ❌    | ❌        |
| Complete habit     | ❌          | ❌           | ❌      | ❌    | ✅    | ❌        |
| View org dashboard | ✅          | ✅           | ❌      | ❌    | ❌    | ✅        |
| Export reports     | ✅          | ✅           | ✅      | ✅    | ❌    | ✅        |

## 4. User Journeys

### Super Admin Journey

1. Create tenant (client sub-account)
2. Assign billing plan
3. Send welcome email to Client Admin
4. Monitor platform health weekly

### Client Admin Journey

1. Set 90-day pilot targets
2. Import branches and users
3. Assign roles
4. Monitor org-wide dashboard
5. Export executive scorecard monthly

### Manager Journey

1. Run 15-minute daily huddle
2. Assign roleplay to team
3. Log coaching session
4. View team adherence
5. Approve coaching logs

### Coach Journey

1. Schedule roleplay session
2. Upload materials
3. Score roleplays during session
4. Provide feedback
5. Log coaching (requires Manager approval)

### Staff Journey

1. Complete daily micro-habit
2. Participate in roleplay
3. View personal streaks and badges
4. Give peer recognition

### Executive Journey

1. View org-wide KPIs weekly
2. Check branch variance
3. Download executive scorecard monthly
4. Share with board/investors
