# E2E Service System - Role Access Control (RBAC)

## 1. Role Hierarchy

```
Super Admin (E2E Team)
    │
    ├─── All Tenants Access
    │    │
    │    └─── Tenant 1, Tenant 2, Tenant 3, ...
    │
    └─── Platform Management
         │
         └─── Templates, Billing, Support

Client Admin (HR Director)
    │
    ├─── Own Tenant Only
    │    │
    │    └─── All Branches
    │         │
    │         └─── All Users
    │
    └─── Organization Management
         │
         └─── Targets, Settings, Integrations

Manager
    │
    ├─── Own Branch Only
    │    │
    │    └─── Own Team
    │
    └─── Team Management
         │
         └─── Huddles, Coaching, Assignments

Coach/Trainer
    │
    ├─── Assigned Branches
    │    │
    │    └─── Session Attendees
    │
    └─── Training Management
         │
         └─── Sessions, Scoring, Materials

Staff
    │
    ├─── Own Data Only
    │
    └─── Personal Tasks
         │
         └─── Habits, Roleplays, Recognition

Executive Viewer
    │
    ├─── Own Tenant (Read-Only)
    │    │
    │    └─── All Branches (View Only)
    │
    └─── Reports & Dashboards
         │
         └─── KPIs, Scorecards, Exports
```

---

## 2. Complete Access Matrix

| Resource | Super Admin | Client Admin | Manager | Coach | Staff | Executive |
|----------|-------------|--------------|---------|-------|-------|-----------|
| **TENANT MANAGEMENT** |
| Create Tenant | ✅ Full | ❌ None | ❌ None | ❌ None | ❌ None | ❌ None |
| View All Tenants | ✅ Full | ❌ None | ❌ None | ❌ None | ❌ None | ❌ None |
| Edit Tenant | ✅ Full | ❌ None | ❌ None | ❌ None | ❌ None | ❌ None |
| Delete Tenant | ✅ Full | ❌ None | ❌ None | ❌ None | ❌ None | ❌ None |
| Manage Billing Plans | ✅ Full | ❌ None | ❌ None | ❌ None | ❌ None | ❌ None |
| **ORGANIZATION** |
| View Organization | ✅ All | ✅ Own | ❌ None | ❌ None | ❌ None | ✅ Own (RO) |
| Edit Organization | ✅ All | ✅ Own | ❌ None | ❌ None | ❌ None | ❌ None |
| Set Targets | ✅ All | ✅ Own | ❌ None | ❌ None | ❌ None | ❌ None |
| Configure Settings | ✅ All | ✅ Own | ❌ None | ❌ None | ❌ None | ❌ None |
| Manage Integrations | ✅ All | ✅ Own | ❌ None | ❌ None | ❌ None | ❌ None |
| **BRANCHES** |
| View All Branches | ✅ All | ✅ Own Org | ❌ None | ❌ None | ❌ None | ✅ Own Org (RO) |
| View Own Branch | ✅ All | ✅ Own Org | ✅ Own | ✅ Assigned | ❌ None | ✅ Own Org (RO) |
| Create Branch | ✅ All | ✅ Own Org | ❌ None | ❌ None | ❌ None | ❌ None |
| Edit Branch | ✅ All | ✅ Own Org | ❌ None | ❌ None | ❌ None | ❌ None |
| Delete Branch | ✅ All | ✅ Own Org | ❌ None | ❌ None | ❌ None | ❌ None |
| Import Branches CSV | ✅ All | ✅ Own Org | ❌ None | ❌ None | ❌ None | ❌ None |
| **USERS** |
| View All Users | ✅ All | ✅ Own Org | ❌ None | ❌ None | ❌ None | ✅ Own Org (RO) |
| View Branch Users | ✅ All | ✅ Own Org | ✅ Own Branch | ✅ Assigned | ❌ None | ✅ Own Org (RO) |
| Create User | ✅ All | ✅ Own Org | ❌ None | ❌ None | ❌ None | ❌ None |
| Edit User | ✅ All | ✅ Own Org | ❌ None | ❌ None | ❌ None | ❌ None |
| Delete User | ✅ All | ✅ Own Org | ❌ None | ❌ None | ❌ None | ❌ None |
| Assign Roles | ✅ All | ✅ Own Org | ❌ None | ❌ None | ❌ None | ❌ None |
| Import Users CSV | ✅ All | ✅ Own Org | ❌ None | ❌ None | ❌ None | ❌ None |
| **PROGRAMS** |
| View Programs | ✅ All | ✅ Own Org | ✅ Own Branch | ✅ Assigned | ❌ None | ✅ Own Org (RO) |
| Create Program | ✅ All | ✅ Own Org | ❌ None | ❌ None | ❌ None | ❌ None |
| Edit Program | ✅ All | ✅ Own Org | ❌ None | ❌ None | ❌ None | ❌ None |
| Delete Program | ✅ All | ✅ Own Org | ❌ None | ❌ None | ❌ None | ❌ None |
| **SESSIONS** |
| View All Sessions | ✅ All | ✅ Own Org | ❌ None | ❌ None | ❌ None | ✅ Own Org (RO) |
| View Branch Sessions | ✅ All | ✅ Own Org | ✅ Own Branch | ✅ Assigned | ✅ Assigned | ✅ Own Org (RO) |
| Create Session | ✅ All | ✅ Own Org | ✅ Own Branch | ✅ Assigned | ❌ None | ❌ None |
| Edit Session | ✅ All | ✅ Own Org | ✅ Own Branch | ✅ Own | ❌ None | ❌ None |
| Delete Session | ✅ All | ✅ Own Org | ✅ Own Branch | ✅ Own | ❌ None | ❌ None |
| Upload Materials | ✅ All | ✅ Own Org | ✅ Own Branch | ✅ Own | ❌ None | ❌ None |
| Mark Attendance | ✅ All | ✅ Own Org | ✅ Own Branch | ✅ Own | ❌ None | ❌ None |
| **ROLEPLAYS** |
| View Scenarios | ✅ All | ✅ Own Org | ✅ Own Branch | ✅ Assigned | ✅ Assigned | ✅ Own Org (RO) |
| Create Scenario | ✅ All | ✅ Own Org | ✅ Own Branch | ✅ Assigned | ❌ None | ❌ None |
| Assign Roleplay | ✅ All | ✅ Own Org | ✅ Own Branch | ✅ Assigned | ❌ None | ❌ None |
| Score Roleplay | ✅ All | ✅ Own Org | ✅ Own Branch | ✅ Assigned | ❌ None | ❌ None |
| Participate Roleplay | ❌ None | ❌ None | ❌ None | ❌ None | ✅ Assigned | ❌ None |
| View Own Scores | ❌ None | ❌ None | ❌ None | ❌ None | ✅ Own | ❌ None |
| **MICRO-HABITS** |
| View All Habits | ✅ All | ✅ Own Org | ✅ Own Branch | ❌ None | ❌ None | ✅ Own Org (RO) |
| View Assigned Habits | ✅ All | ✅ Own Org | ✅ Own Branch | ❌ None | ✅ Own | ❌ None |
| Create Habit | ✅ All | ✅ Own Org | ✅ Own Branch | ❌ None | ❌ None | ❌ None |
| Edit Habit | ✅ All | ✅ Own Org | ✅ Own Branch | ❌ None | ❌ None | ❌ None |
| Delete Habit | ✅ All | ✅ Own Org | ✅ Own Branch | ❌ None | ❌ None | ❌ None |
| Assign Habit | ✅ All | ✅ Own Org | ✅ Own Branch | ❌ None | ❌ None | ❌ None |
| Complete Habit | ❌ None | ❌ None | ❌ None | ❌ None | ✅ Own | ❌ None |
| View Streaks | ✅ All | ✅ Own Org | ✅ Own Branch | ❌ None | ✅ Own | ❌ None |
| **COACHING LOGS** |
| View All Logs | ✅ All | ✅ Own Org | ❌ None | ❌ None | ❌ None | ✅ Own Org (RO) |
| View Branch Logs | ✅ All | ✅ Own Org | ✅ Own Branch | ✅ Own | ❌ None | ✅ Own Org (RO) |
| Create Log | ✅ All | ✅ Own Org | ✅ Own Branch | ✅ Assigned | ❌ None | ❌ None |
| Edit Log | ✅ All | ✅ Own Org | ✅ Own Branch | ✅ Own (Pending) | ❌ None | ❌ None |
| Delete Log | ❌ None | ❌ None | ❌ None | ❌ None | ❌ None | ❌ None |
| Approve Log | ✅ All | ✅ Own Org | ✅ Own Branch | ❌ None | ❌ None | ❌ None |
| Export Logs CSV | ✅ All | ✅ Own Org | ✅ Own Branch | ✅ Own | ❌ None | ✅ Own Org (RO) |
| **RECOGNITION** |
| View Recognition | ✅ All | ✅ Own Org | ✅ Own Branch | ✅ Assigned | ✅ Own | ✅ Own Org (RO) |
| Give Recognition | ✅ All | ✅ Own Org | ✅ Own Branch | ✅ Assigned | ✅ Peers | ❌ None |
| View Leaderboard | ✅ All | ✅ Own Org | ✅ Own Branch | ✅ Assigned | ✅ Own Branch | ✅ Own Org (RO) |
| **METRICS** |
| View All Metrics | ✅ All | ✅ Own Org | ❌ None | ❌ None | ❌ None | ✅ Own Org (RO) |
| View Branch Metrics | ✅ All | ✅ Own Org | ✅ Own Branch | ✅ Assigned | ❌ None | ✅ Own Org (RO) |
| Import Metrics CSV | ✅ All | ✅ Own Org | ❌ None | ❌ None | ❌ None | ❌ None |
| Edit Metrics | ✅ All | ✅ Own Org | ❌ None | ❌ None | ❌ None | ❌ None |
| Delete Metrics | ✅ All | ✅ Own Org | ❌ None | ❌ None | ❌ None | ❌ None |
| **DASHBOARDS** |
| Platform Dashboard | ✅ Full | ❌ None | ❌ None | ❌ None | ❌ None | ❌ None |
| Org Dashboard | ✅ All | ✅ Own | ❌ None | ❌ None | ❌ None | ✅ Own (RO) |
| Branch Dashboard | ✅ All | ✅ Own Org | ✅ Own Branch | ✅ Assigned | ❌ None | ✅ Own Org (RO) |
| Personal Dashboard | ❌ None | ❌ None | ❌ None | ❌ None | ✅ Own | ❌ None |
| Branch Variance | ✅ All | ✅ Own Org | ✅ Own Branch | ❌ None | ❌ None | ✅ Own Org (RO) |
| **REPORTS** |
| Executive Scorecard | ✅ All | ✅ Own Org | ❌ None | ❌ None | ❌ None | ✅ Own Org (RO) |
| Branch Report | ✅ All | ✅ Own Org | ✅ Own Branch | ✅ Assigned | ❌ None | ✅ Own Org (RO) |
| Audit Log | ✅ All | ✅ Own Org | ✅ Own Branch | ✅ Own | ❌ None | ✅ Own Org (RO) |
| Export PDF | ✅ All | ✅ Own Org | ✅ Own Branch | ✅ Own | ❌ None | ✅ Own Org (RO) |
| Export CSV | ✅ All | ✅ Own Org | ✅ Own Branch | ✅ Own | ❌ None | ✅ Own Org (RO) |
| Schedule Reports | ✅ All | ✅ Own Org | ❌ None | ❌ None | ❌ None | ❌ None |
| **TEMPLATES** |
| View Global Templates | ✅ Full | ✅ View | ✅ View | ✅ View | ❌ None | ✅ View |
| Create Global Template | ✅ Full | ❌ None | ❌ None | ❌ None | ❌ None | ❌ None |
| Edit Global Template | ✅ Full | ❌ None | ❌ None | ❌ None | ❌ None | ❌ None |
| Create Org Template | ✅ All | ✅ Own Org | ❌ None | ❌ None | ❌ None | ❌ None |
| **BILLING** |
| View All Subscriptions | ✅ Full | ❌ None | ❌ None | ❌ None | ❌ None | ❌ None |
| View Own Subscription | ✅ All | ✅ Own | ❌ None | ❌ None | ❌ None | ❌ None |
| Manage Subscription | ✅ All | ✅ Own | ❌ None | ❌ None | ❌ None | ❌ None |
| View Invoices | ✅ All | ✅ Own | ❌ None | ❌ None | ❌ None | ❌ None |
| View Usage | ✅ All | ✅ Own | ❌ None | ❌ None | ❌ None | ❌ None |
| **NOTIFICATIONS** |
| Configure Notifications | ✅ All | ✅ Own Org | ❌ None | ❌ None | ❌ None | ❌ None |
| View Notifications | ✅ All | ✅ Own | ✅ Own | ✅ Own | ✅ Own | ✅ Own |
| Send Manual Notification | ✅ All | ✅ Own Org | ✅ Own Branch | ❌ None | ❌ None | ❌ None |
| **ALERTS** |
| View All Alerts | ✅ All | ✅ Own Org | ❌ None | ❌ None | ❌ None | ✅ Own Org (RO) |
| View Branch Alerts | ✅ All | ✅ Own Org | ✅ Own Branch | ❌ None | ❌ None | ✅ Own Org (RO) |
| Configure Alerts | ✅ All | ✅ Own Org | ❌ None | ❌ None | ❌ None | ❌ None |
| Resolve Alerts | ✅ All | ✅ Own Org | ✅ Own Branch | ❌ None | ❌ None | ❌ None |

---

## 3. Access Level Definitions

### ✅ Full
- Complete CRUD access
- No restrictions
- Can access all tenants/organizations

### ✅ Own Org
- Access to own organization only
- Full CRUD within organization
- Cannot access other organizations

### ✅ Own Branch
- Access to own branch only
- Full CRUD within branch
- Cannot access other branches

### ✅ Assigned
- Access to assigned resources only
- Limited to specific sessions/branches
- Cannot access unassigned resources

### ✅ Own
- Access to own data only
- Can view and edit personal information
- Cannot access other users' data

### ✅ (RO) Read-Only
- View access only
- Cannot create, edit, or delete
- Can export reports

### ❌ None
- No access
- API returns 403 Forbidden

---

## 4. Data Scope by Role

### Super Admin
```
Scope: ALL TENANTS
├── Tenant 1
│   ├── Organization 1
│   │   ├── Branch 1, 2, 3, ...
│   │   └── Users (all roles)
├── Tenant 2
│   └── ...
└── Tenant N
    └── ...
```

### Client Admin
```
Scope: OWN TENANT ONLY
└── Tenant 1 (Own)
    └── Organization 1
        ├── Branch 1, 2, 3, ... (All)
        └── Users (All roles)
```

### Manager
```
Scope: OWN BRANCH ONLY
└── Tenant 1
    └── Organization 1
        └── Branch 1 (Own)
            └── Users (Own team only)
```

### Coach
```
Scope: ASSIGNED BRANCHES
└── Tenant 1
    └── Organization 1
        ├── Branch 1 (Assigned)
        └── Branch 2 (Assigned)
            └── Users (Session attendees only)
```

### Staff
```
Scope: OWN DATA ONLY
└── Tenant 1
    └── Organization 1
        └── Branch 1
            └── User (Self)
                ├── Own habits
                ├── Own roleplays
                └── Own recognition
```

### Executive Viewer
```
Scope: OWN TENANT (READ-ONLY)
└── Tenant 1 (Own)
    └── Organization 1
        ├── Branch 1, 2, 3, ... (All - View Only)
        └── Users (View Only)
```

---

## 5. API Authorization Examples

### Middleware Check
```typescript
// Check if user can access resource
async canAccess(user: User, resource: string, action: string): Promise<boolean> {
  // Super Admin: Full access
  if (user.role === 'SuperAdmin') return true;
  
  // Client Admin: Own org only
  if (user.role === 'ClientAdmin') {
    return resource.tenantId === user.tenantId;
  }
  
  // Manager: Own branch only
  if (user.role === 'Manager') {
    return resource.branchId === user.branchId;
  }
  
  // Coach: Assigned branches only
  if (user.role === 'Coach') {
    return await this.isAssignedToBranch(user.id, resource.branchId);
  }
  
  // Staff: Own data only
  if (user.role === 'Staff') {
    return resource.userId === user.id;
  }
  
  // Executive: Read-only, own org
  if (user.role === 'ExecutiveViewer') {
    return action === 'read' && resource.tenantId === user.tenantId;
  }
  
  return false;
}
```

### Route Guards
```typescript
// Super Admin only
@Roles('SuperAdmin')
@Post('admin/tenants')
async createTenant() { ... }

// Client Admin or Super Admin
@Roles('SuperAdmin', 'ClientAdmin')
@Post('branches')
async createBranch() { ... }

// Manager or Coach
@Roles('Manager', 'Coach')
@Post('sessions')
async createSession() { ... }

// Staff only
@Roles('Staff')
@Post('habits/:id/complete')
async completeHabit() { ... }

// All except Staff
@Roles('SuperAdmin', 'ClientAdmin', 'Manager', 'Coach', 'ExecutiveViewer')
@Get('reports/branch-performance')
async getBranchReport() { ... }
```

---

## 6. Permission Inheritance

```
Super Admin
    ↓ (inherits all permissions)
Client Admin
    ↓ (inherits branch/user management)
Manager
    ↓ (inherits team management)
Coach
    ↓ (inherits session management)
Staff
    ↓ (basic user permissions)
```

**Note**: Executive Viewer does NOT inherit permissions. It's a separate read-only role.

---

## 7. Special Cases

### Multi-Branch Manager
- Manager assigned to multiple branches
- Can access all assigned branches
- Permissions apply to each branch independently

### Multi-Branch Coach
- Coach can work across multiple branches
- Access limited to assigned sessions
- Cannot view branch-level data

### Impersonation (Super Admin)
- Super Admin can impersonate any user
- Used for support and troubleshooting
- All actions logged in audit trail

### Delegation (Client Admin)
- Can delegate specific permissions to Manager
- Temporary access grants
- Expires after set period
