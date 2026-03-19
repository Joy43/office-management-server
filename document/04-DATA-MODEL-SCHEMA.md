# E2E Service System - Data Model & Schema

## 1. Entity Relationship Diagram

```
┌──────────┐
│  Tenant  │
└────┬─────┘
     │ 1:1
     ▼
┌──────────────┐       ┌──────────┐
│Organization  │◄──────┤  Branch  │
└──────┬───────┘  1:N  └────┬─────┘
       │                     │
       │ 1:N                 │ 1:N
       ▼                     ▼
┌──────────┐           ┌──────────┐
│   User   │           │ Program  │
└────┬─────┘           └────┬─────┘
     │                      │
     │ 1:N                  │ 1:N
     ▼                      ▼
┌──────────────┐      ┌──────────┐
│  HabitLog    │      │ Session  │
│  Roleplay    │      └────┬─────┘
│  CoachingLog │           │ 1:N
└──────────────┘           ▼
                     ┌──────────────┐
                     │  Attendance  │
                     └──────────────┘
```

## 2. Core Entities

### 2.1 Tenant
```sql
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  subdomain VARCHAR(100) UNIQUE NOT NULL,
  plan VARCHAR(50) NOT NULL, -- Starter, Growth, Enterprise
  status VARCHAR(50) DEFAULT 'Active', -- Active, Suspended, Cancelled
  locale VARCHAR(10) DEFAULT 'en',
  timezone VARCHAR(50) DEFAULT 'Africa/Accra',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 2.2 Organization
```sql
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  industry VARCHAR(100),
  targets JSONB, -- {complaints: -20, csat: 2, adoption: 80}
  baseline_metrics JSONB, -- {complaints: 50, csat: 3.5}
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_org_tenant ON organizations(tenant_id);
```

### 2.3 Branch
```sql
CREATE TABLE branches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  region VARCHAR(100),
  manager_id UUID,
  staff_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_branch_tenant ON branches(tenant_id, org_id);
```

### 2.4 User
```sql
CREATE TYPE user_role AS ENUM (
  'SuperAdmin',
  'ClientAdmin',
  'Manager',
  'Coach',
  'Staff',
  'ExecutiveViewer'
);

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  branch_id UUID REFERENCES branches(id),
  role user_role NOT NULL,
  email VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  phone VARCHAR(20),
  status VARCHAR(50) DEFAULT 'Active',
  last_login_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(tenant_id, email)
);

CREATE INDEX idx_user_tenant ON users(tenant_id, email);
CREATE INDEX idx_user_branch ON users(branch_id);
```

## 3. Program & Session Entities

### 3.1 Program
```sql
CREATE TABLE programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  template_id UUID, -- Reference to global template
  name VARCHAR(255) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  targets JSONB, -- {complaints: -20, csat: 2}
  status VARCHAR(50) DEFAULT 'Active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_program_tenant ON programs(tenant_id, org_id);
```

### 3.2 Session
```sql
CREATE TYPE session_type AS ENUM ('Huddle', 'Roleplay', 'Clinic', 'Workshop');

CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  program_id UUID REFERENCES programs(id) ON DELETE CASCADE,
  branch_id UUID REFERENCES branches(id),
  type session_type NOT NULL,
  title VARCHAR(255) NOT NULL,
  agenda TEXT,
  scheduled_at TIMESTAMP NOT NULL,
  duration_min INT DEFAULT 15,
  facilitator_id UUID REFERENCES users(id),
  materials JSONB, -- [{name: 'slides.pdf', url: 'https://...'}]
  status VARCHAR(50) DEFAULT 'Scheduled',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_session_tenant ON sessions(tenant_id, branch_id);
CREATE INDEX idx_session_date ON sessions(scheduled_at);
```

### 3.3 Attendance
```sql
CREATE TABLE attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id),
  attended BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_attendance_tenant ON attendance(tenant_id, session_id);
```

## 4. Roleplay & Habits

### 4.1 Roleplay
```sql
CREATE TABLE roleplays (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  session_id UUID REFERENCES sessions(id),
  user_id UUID NOT NULL REFERENCES users(id),
  scenario_id UUID, -- Reference to scenario library
  score INT CHECK (score >= 1 AND score <= 5),
  coach_notes TEXT,
  video_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_roleplay_tenant ON roleplays(tenant_id, user_id);
```

### 4.2 MicroHabit
```sql
CREATE TABLE micro_habits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  org_id UUID NOT NULL REFERENCES organizations(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  frequency VARCHAR(50) DEFAULT 'Daily',
  points INT DEFAULT 10,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_habit_tenant ON micro_habits(tenant_id, org_id);
```

### 4.3 HabitLog
```sql
CREATE TABLE habit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  habit_id UUID NOT NULL REFERENCES micro_habits(id),
  user_id UUID NOT NULL REFERENCES users(id),
  date DATE NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  proof_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_habitlog_tenant ON habit_logs(tenant_id, user_id, date);
```

## 5. Coaching & Recognition

### 5.1 CoachingLog
```sql
CREATE TABLE coaching_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  manager_id UUID NOT NULL REFERENCES users(id),
  staff_id UUID NOT NULL REFERENCES users(id),
  date DATE NOT NULL,
  topic VARCHAR(255),
  notes TEXT,
  evidence_url TEXT,
  approved BOOLEAN DEFAULT FALSE,
  approved_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_coaching_tenant ON coaching_logs(tenant_id, manager_id);
```

### 5.2 Recognition
```sql
CREATE TABLE recognitions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  from_user_id UUID NOT NULL REFERENCES users(id),
  to_user_id UUID NOT NULL REFERENCES users(id),
  tag VARCHAR(100), -- 'Empathy', 'Teamwork', etc.
  note TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_recognition_tenant ON recognitions(tenant_id, to_user_id);
```

## 6. Metrics & Alerts

### 6.1 Metric
```sql
CREATE TYPE metric_type AS ENUM ('CSAT', 'Complaints', 'RepeatCustomer', 'TimeToResolve');

CREATE TABLE metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  branch_id UUID REFERENCES branches(id),
  type metric_type NOT NULL,
  value DECIMAL(10,2) NOT NULL,
  date DATE NOT NULL,
  source VARCHAR(100), -- 'Manual', 'Zendesk', 'Freshdesk'
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_metric_tenant ON metrics(tenant_id, branch_id, type, date);
```

### 6.2 KPIAlert
```sql
CREATE TABLE kpi_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  org_id UUID REFERENCES organizations(id),
  metric_type metric_type NOT NULL,
  threshold DECIMAL(10,2),
  status VARCHAR(50) DEFAULT 'Active',
  triggered_at TIMESTAMP,
  resolved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_alert_tenant ON kpi_alerts(tenant_id, status);
```

## 7. Templates & Billing

### 7.1 Template (Global)
```sql
CREATE TABLE templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50), -- 'Pilot', 'Huddle', 'Coaching'
  content JSONB,
  is_global BOOLEAN DEFAULT TRUE,
  created_by UUID, -- Super Admin
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 7.2 Subscription
```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  plan VARCHAR(50) NOT NULL,
  status VARCHAR(50) DEFAULT 'Active',
  billing_cycle VARCHAR(50) DEFAULT 'Monthly',
  amount DECIMAL(10,2),
  stripe_subscription_id VARCHAR(255),
  current_period_start DATE,
  current_period_end DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_subscription_tenant ON subscriptions(tenant_id);
```

### 7.3 Usage
```sql
CREATE TABLE usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  metric VARCHAR(100), -- 'active_users', 'sms_credits', 'storage_gb'
  value INT,
  date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_usage_tenant ON usage_logs(tenant_id, date);
```

## 8. Prisma Schema

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Tenant {
  id        String   @id @default(uuid())
  name      String
  subdomain String   @unique
  plan      String
  status    String   @default("Active")
  locale    String   @default("en")
  timezone  String   @default("Africa/Accra")
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  organizations Organization[]
  users         User[]
  branches      Branch[]

  @@map("tenants")
}

model Organization {
  id              String   @id @default(uuid())
  tenantId        String   @map("tenant_id")
  name            String
  industry        String?
  targets         Json?
  baselineMetrics Json?    @map("baseline_metrics")
  createdAt       DateTime @default(now()) @map("created_at")
  updatedAt       DateTime @updatedAt @map("updated_at")

  tenant   Tenant     @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  branches Branch[]
  users    User[]
  programs Program[]

  @@index([tenantId])
  @@map("organizations")
}

model Branch {
  id         String   @id @default(uuid())
  tenantId   String   @map("tenant_id")
  orgId      String   @map("org_id")
  name       String
  region     String?
  managerId  String?  @map("manager_id")
  staffCount Int      @default(0) @map("staff_count")
  createdAt  DateTime @default(now()) @map("created_at")
  updatedAt  DateTime @updatedAt @map("updated_at")

  tenant       Tenant       @relation(fields: [tenantId], references: [id])
  organization Organization @relation(fields: [orgId], references: [id], onDelete: Cascade)
  users        User[]
  sessions     Session[]
  metrics      Metric[]

  @@index([tenantId, orgId])
  @@map("branches")
}

enum UserRole {
  SuperAdmin
  ClientAdmin
  Manager
  Coach
  Staff
  ExecutiveViewer
}

model User {
  id           String    @id @default(uuid())
  tenantId     String    @map("tenant_id")
  orgId        String    @map("org_id")
  branchId     String?   @map("branch_id")
  role         UserRole
  email        String
  passwordHash String    @map("password_hash")
  firstName    String?   @map("first_name")
  lastName     String?   @map("last_name")
  phone        String?
  status       String    @default("Active")
  lastLoginAt  DateTime? @map("last_login_at")
  createdAt    DateTime  @default(now()) @map("created_at")
  updatedAt    DateTime  @updatedAt @map("updated_at")

  tenant       Tenant         @relation(fields: [tenantId], references: [id])
  organization Organization   @relation(fields: [orgId], references: [id], onDelete: Cascade)
  branch       Branch?        @relation(fields: [branchId], references: [id])
  habitLogs    HabitLog[]
  roleplays    Roleplay[]
  coachingLogs CoachingLog[]  @relation("Coach")

  @@unique([tenantId, email])
  @@index([tenantId, email])
  @@index([branchId])
  @@map("users")
}

model Program {
  id         String   @id @default(uuid())
  tenantId   String   @map("tenant_id")
  orgId      String   @map("org_id")
  templateId String?  @map("template_id")
  name       String
  startDate  DateTime @map("start_date")
  endDate    DateTime @map("end_date")
  targets    Json?
  status     String   @default("Active")
  createdAt  DateTime @default(now()) @map("created_at")
  updatedAt  DateTime @updatedAt @map("updated_at")

  organization Organization @relation(fields: [orgId], references: [id], onDelete: Cascade)
  sessions     Session[]

  @@index([tenantId, orgId])
  @@map("programs")
}

// Continue with other models...
```

## 9. Row-Level Security Policies

```sql
-- Enable RLS on all tenant-scoped tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policy for tenant isolation
CREATE POLICY tenant_isolation_policy ON organizations
  USING (tenant_id = current_setting('app.current_tenant')::UUID);

CREATE POLICY tenant_isolation_policy ON branches
  USING (tenant_id = current_setting('app.current_tenant')::UUID);

CREATE POLICY tenant_isolation_policy ON users
  USING (tenant_id = current_setting('app.current_tenant')::UUID);
```

## 10. Sample Data

```sql
-- Insert sample tenant
INSERT INTO tenants (id, name, subdomain, plan) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'Acme Corp', 'acme', 'Growth');

-- Insert organization
INSERT INTO organizations (id, tenant_id, name, industry, targets) VALUES
('660e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440000', 
 'Acme Corp', 'Banking', '{"complaints": -20, "csat": 2}');

-- Insert branches
INSERT INTO branches (tenant_id, org_id, name, region) VALUES
('550e8400-e29b-41d4-a716-446655440000', '660e8400-e29b-41d4-a716-446655440000', 
 'Accra Main', 'Greater Accra'),
('550e8400-e29b-41d4-a716-446655440000', '660e8400-e29b-41d4-a716-446655440000', 
 'Kumasi Branch', 'Ashanti');
```
