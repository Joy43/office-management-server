// ===================================================================
// E2E SERVICE SYSTEM - COMPLETE SCHEMA FILE
// Multi-Tenant SaaS Platform for Training & ROI Tracking
// All schemas consolidated in one file
// ===================================================================

// ===================================================================
// DOCUMENT: 01-PROJECT-OVERVIEW.md, 03-MULTI-TENANT-ARCHITECTURE.md
// SECTION 1: TENANT & ORGANIZATION ENTITIES
// ===================================================================

// Tenant - Main multi-tenant entity
// Each tenant represents a client organization using the platform
model Tenant {
id String @id @default(uuid())
name String @db.VarChar(255)
subdomain String @unique @db.VarChar(100) // e.g., acme.e2e.com
plan String @db.VarChar(50) // Starter, Growth, Enterprise
status String @default("Active") @db.VarChar(50) // Active, Suspended, Cancelled
locale String @default("en") @db.VarChar(10)
timezone String @default("Africa/Accra") @db.VarChar(50)
createdAt DateTime @default(now()) @map("created_at")
updatedAt DateTime @updatedAt @map("updated_at")

// Relations
organizations Organization[]
subscriptions Subscription[]
usageLogs UsageLog[]

@@map("tenants")
}

// Organization - One per tenant
// Represents the client's organization with targets and baseline metrics
model Organization {
id String @id @default(uuid())
tenantId String @map("tenant_id")
name String @db.VarChar(255)
industry String? @db.VarChar(100)
targets Json? // {complaints: -20, csat: 2, adoption: 80}
baselineMetrics Json? @map("baseline_metrics") // {complaints: 50, csat: 3.5}
createdAt DateTime @default(now()) @map("created_at")
updatedAt DateTime @updatedAt @map("updated_at")

// Relations
tenant Tenant @relation(fields: [tenantId], references: [id], onDelete: Cascade)
branches Branch[]
users User[]
programs Program[]
microHabits MicroHabit[]
kpiAlerts KpiAlert[]

@@index([tenantId])
@@map("organizations")
}

// Branch - Regional/location-based divisions within organization
// Each branch can have its own manager and staff
model Branch {
id String @id @default(uuid())
tenantId String @map("tenant_id")
orgId String @map("org_id")
name String @db.VarChar(255)
region String? @db.VarChar(100)
managerId String? @map("manager_id")
staffCount Int @default(0) @map("staff_count")
createdAt DateTime @default(now()) @map("created_at")
updatedAt DateTime @updatedAt @map("updated_at")

// Relations
organization Organization @relation(fields: [orgId], references: [id], onDelete: Cascade)
users User[]
sessions Session[]
metrics Metric[]
habitAssignments HabitAssignment[]

@@index([tenantId, orgId])
@@map("branches")
}

// ===================================================================
// DOCUMENT: 02-USER-ROLES-PERMISSIONS.md, 04-DATA-MODEL-SCHEMA.md
// SECTION 2: USER MANAGEMENT
// ===================================================================

// User - Multi-tenant user with role-based access
model User {
id String @id @default(uuid())

// Multi-tenant fields
tenantId String? @map("tenant_id")
orgId String? @map("org_id")
branchId String? @map("branch_id")

// Identity
name String
email String @unique
password String

// Additional name fields for E2E system
firstName String? @map("first_name") @db.VarChar(100)
lastName String? @map("last_name") @db.VarChar(100)
phone String? @db.VarChar(20)

// Settings
role UserRole @default(USER)
status UserStatus @default(ACTIVE)
isVerified Boolean @default(false)
isOnline Boolean @default(false)

// Activity
lastLoginAt DateTime? @map("last_login_at")
lastActiveAt DateTime?

// Avatar
profilePictureId String?
profilePicture FileInstance? @relation(fields: [profilePictureId], references: [id], onDelete: SetNull)

// Notifications & Auth
notifications UserNotification[]
refreshTokens RefreshToken[]
otps UserOtp[]

// CHAT & CALL RELATIONS
conversationsInitiated PrivateConversation[] @relation("ConversationInitiator")
conversationsReceived PrivateConversation[] @relation("ConversationReceiver")
messagesSent PrivateMessage[]
messageStatuses PrivateMessageStatus[]
NotificationToggle NotificationToggle?

// Location & Profile
locationLon String? @default("-71.0589")
locationLat String? @default("42.3601")
about String? @default("User about information")
username String? @unique
address String?
dateOfBirth DateTime?
coverPhoto String?

// Calling relations
hostedCalls Calling[] @relation("HostedCalls")
receivedCalls Calling[] @relation("ReceivedCalls")

// E2E SERVICE SYSTEM RELATIONS
// Multi-tenant relations
organization Organization? @relation(fields: [orgId], references: [id], onDelete: Cascade)
branch Branch? @relation(fields: [branchId], references: [id])

// Training & Adoption
facilitatedSessions Session[]
attendances Attendance[]
roleplays Roleplay[]
habitLogs HabitLog[]
habitAssignments HabitAssignment[] @relation("HabitAssignmentUser")
assignedHabits HabitAssignment[] @relation("HabitAssignmentAssigner")

// Coaching & Recognition
coachingLogsAsManager CoachingLog[] @relation("CoachingManager")
coachingLogsAsStaff CoachingLog[] @relation("CoachingStaff")
coachingLogsApproved CoachingLog[] @relation("CoachingApprover")
recognitionsGiven Recognition[] @relation("RecognitionFrom")
recognitionsReceived Recognition[] @relation("RecognitionTo")

// Timestamps
createdAt DateTime @default(now())
updatedAt DateTime @default(now()) @updatedAt

@@unique([tenantId, email])
@@index([tenantId, email])
@@index([branchId])
@@map("users")
}

enum UserRole {
USER
ADMIN
SUPER_ADMIN
CLIENT_ADMIN
MANAGER 
TAINER 
EXECUTIVE 
STAFF
}

enum UserStatus {
ACTIVE
INACTIVE
DELETED
}

// ===================================================================
// DOCUMENT: 04-DATA-MODEL-SCHEMA.md, 07-FEATURES-MODULES.md
// SECTION 3: PROGRAMS & SESSIONS
// ===================================================================

// Program - Training program (e.g., 90-day pilot)
// Programs contain multiple sessions and track targets
model Program {
id String @id @default(uuid())
tenantId String @map("tenant_id")
orgId String @map("org_id")
templateId String? @map("template_id")
name String @db.VarChar(255)
startDate DateTime @map("start_date") @db.Date
endDate DateTime @map("end_date") @db.Date
targets Json? // {complaints: -20, csat: 2}
status String @default("Active") @db.VarChar(50)
createdAt DateTime @default(now()) @map("created_at")
updatedAt DateTime @updatedAt @map("updated_at")

// Relations
organization Organization @relation(fields: [orgId], references: [id], onDelete: Cascade)
sessions Session[]

@@index([tenantId, orgId])
@@map("programs")
}

// SessionType - Enum for session types
enum SessionType {
Huddle
Roleplay
Clinic
Workshop
}

// Session - Individual training/meeting sessions
// Can be part of a program or standalone
model Session {
id String @id @default(uuid())
tenantId String @map("tenant_id")
programId String? @map("program_id")
branchId String? @map("branch_id")
type SessionType
title String @db.VarChar(255)
agenda String? @db.Text
scheduledAt DateTime @map("scheduled_at")
durationMin Int @default(15) @map("duration_min")
facilitatorId String? @map("facilitator_id")
materials Json?
status String @default("Scheduled") @db.VarChar(50)
createdAt DateTime @default(now()) @map("created_at")
updatedAt DateTime @updatedAt @map("updated_at")

// Relations
program Program? @relation(fields: [programId], references: [id], onDelete: Cascade)
branch Branch? @relation(fields: [branchId], references: [id])
facilitator User? @relation(fields: [facilitatorId], references: [id])
attendances Attendance[]
roleplays Roleplay[]

@@index([tenantId, branchId])
@@index([scheduledAt])
@@map("sessions")
}

// Attendance - Tracks who attended sessions
// Records attendance and notes for each session-user pair
model Attendance {
id String @id @default(uuid())
tenantId String @map("tenant_id")
sessionId String @map("session_id")
userId String @map("user_id")
attended Boolean @default(false)
notes String? @db.Text
createdAt DateTime @default(now()) @map("created_at")

// Relations
session Session @relation(fields: [sessionId], references: [id], onDelete: Cascade)
user User @relation(fields: [userId], references: [id])

@@index([tenantId, sessionId])
@@map("attendance")
}

// ===================================================================
// DOCUMENT: 04-DATA-MODEL-SCHEMA.md, 07-FEATURES-MODULES.md
// SECTION 4: ROLEPLAYS & MICRO-HABITS
// ===================================================================

// DifficultyLevel - Enum for roleplay difficulty
enum DifficultyLevel {
Easy
Medium
Hard
Expert
}

// RoleplayScenario - Library of roleplay scenarios
// Can be global or tenant-specific
model RoleplayScenario {
id String @id @default(uuid())
tenantId String? @map("tenant_id")
title String @db.VarChar(255)
scenario String @db.Text// Banking, Retail, Healthcare, etc.
difficulty DifficultyLevel
durationMin Int @default(15) @map("duration_min")
videoUrl String? @map("video_url") @db.Text
createdAt DateTime @default(now()) @map("created_at")
updatedAt DateTime @updatedAt @map("updated_at")

// Relations
roleplays Roleplay[]

@@index([tenantId])
@@map("roleplay_scenarios")
}

// Roleplay - Individual roleplay performance
// Records staff performance in roleplay exercises with scoring
model Roleplay {
id String @id @default(uuid())
tenantId String @map("tenant_id")
sessionId String? @map("session_id")
userId String @map("user_id")
scenarioId String? @map("scenario_id")
score Int? // 1-5 scale
coachNotes String? @map("coach_notes") @db.Text
videoUrl String? @map("video_url") @db.Text
createdAt DateTime @default(now()) @map("created_at")

// Relations
session Session? @relation(fields: [sessionId], references: [id])
user User @relation(fields: [userId], references: [id])
scenario RoleplayScenario? @relation(fields: [scenarioId], references: [id])

@@index([tenantId, userId])
@@map("roleplays")
}

// MicroHabit - Daily habits (10-15 min actions)
// Created at org level and assigned to branches or individuals
model MicroHabit {
id String @id @default(uuid())
tenantId String @map("tenant_id")
orgId String @map("org_id")
title String @db.VarChar(255)
description String? @db.Text
frequency String @default("Daily") @db.VarChar(50) // Daily, Weekly, Custom
points Int @default(10)
createdAt DateTime @default(now()) @map("created_at")
updatedAt DateTime @updatedAt @map("updated_at")

// Relations
organization Organization @relation(fields: [orgId], references: [id], onDelete: Cascade)
habitAssignments HabitAssignment[]
habitLogs HabitLog[]

@@index([tenantId, orgId])
@@map("micro_habits")
}

// HabitAssignment - Assigns habits to users or branches
// Tracks who should complete which habits
model HabitAssignment {
id String @id @default(uuid())
habitId String @map("habit_id")
userId String? @map("user_id") // NULL if assigned to entire branch
branchId String? @map("branch_id")
assignedBy String @map("assigned_by")
startDate DateTime @map("start_date") @db.Date
endDate DateTime @map("end_date") @db.Date
createdAt DateTime @default(now()) @map("created_at")

// Relations
habit MicroHabit @relation(fields: [habitId], references: [id], onDelete: Cascade)
user User? @relation("HabitAssignmentUser", fields: [userId], references: [id])
branch Branch? @relation(fields: [branchId], references: [id])
assignedByUser User @relation("HabitAssignmentAssigner", fields: [assignedBy], references: [id])

@@index([habitId, userId])
@@map("habit_assignments")
}

// HabitLog - Daily habit completion tracking
// Records when staff complete their daily habits
model HabitLog {
id String @id @default(uuid())
tenantId String @map("tenant_id")
habitId String @map("habit_id")
userId String @map("user_id")
date DateTime @db.Date
completed Boolean @default(false)
proofUrl String? @map("proof_url") @db.Text // Photo/video proof (optional)
createdAt DateTime @default(now()) @map("created_at")

// Relations
habit MicroHabit @relation(fields: [habitId], references: [id])
user User @relation(fields: [userId], references: [id])

@@unique([habitId, userId, date]) // One log per habit per user per day
@@index([tenantId, userId, date])
@@map("habit_logs")
}

// ===================================================================
// DOCUMENT: 04-DATA-MODEL-SCHEMA.md, 07-FEATURES-MODULES.md
// SECTION 5: COACHING & RECOGNITION
// ===================================================================

// CoachingLog - Manager coaching session logs
// Immutable, timestamped records of coaching sessions with approval flow
model CoachingLog {
id String @id @default(uuid())
tenantId String @map("tenant_id")
managerId String @map("manager_id")
staffId String @map("staff_id")
date DateTime @db.Date
topic String? @db.VarChar(255)
notes String? @db.Text
evidenceUrl String? @map("evidence_url") @db.Text // Photo/video proof
approved Boolean @default(false)
approvedBy String? @map("approved_by")
createdAt DateTime @default(now()) @map("created_at")

// Relations
manager User @relation("CoachingManager", fields: [managerId], references: [id])
staff User @relation("CoachingStaff", fields: [staffId], references: [id])
approvedByUser User? @relation("CoachingApprover", fields: [approvedBy], references: [id])

@@index([tenantId, managerId])
@@index([tenantId, staffId])
@@map("coaching_logs")
}

// Recognition - Peer-to-peer kudos/recognition
// Allows staff to recognize each other for specific behaviors
model Recognition {
id String @id @default(uuid())
tenantId String @map("tenant_id")
fromUserId String @map("from_user_id")
toUserId String @map("to_user_id")
tag String? @db.VarChar(100) // Empathy, Teamwork, Initiative, etc.
note String? @db.Text
createdAt DateTime @default(now()) @map("created_at")

// Relations
fromUser User @relation("RecognitionFrom", fields: [fromUserId], references: [id])
toUser User @relation("RecognitionTo", fields: [toUserId], references: [id])

@@index([tenantId, toUserId])
@@index([tenantId, fromUserId])
@@map("recognitions")
}

// ===================================================================
// DOCUMENT: 04-DATA-MODEL-SCHEMA.md, 07-FEATURES-MODULES.md
// SECTION 6: METRICS & ALERTS
// ===================================================================

// MetricType - Types of metrics tracked
enum MetricType {
CSAT // Customer Satisfaction Score
Complaints // Number of complaints
RepeatCustomer // Repeat customer ratio
TimeToResolve // Average resolution time
NPS // Net Promoter Score
FCR // First Call Resolution
}

// Metric - Performance metrics (CSAT, complaints, etc.)
// Can be manually uploaded or synced from external systems
model Metric {
id String @id @default(uuid())
tenantId String @map("tenant_id")
branchId String? @map("branch_id")
type MetricType
value Decimal @db.Decimal(10, 2)
date DateTime @db.Date
source String? @db.VarChar(100) // Manual, Zendesk, Freshdesk, HubSpot
createdAt DateTime @default(now()) @map("created_at")

// Relations
branch Branch? @relation(fields: [branchId], references: [id])

@@index([tenantId, branchId, type, date])
@@map("metrics")
}

// KpiAlert - Automated alerts for KPI thresholds
// Monitors metrics and triggers when thresholds are breached
model KpiAlert {
id String @id @default(uuid())
tenantId String @map("tenant_id")
orgId String? @map("org_id")
metricType MetricType @map("metric_type")
threshold Decimal @db.Decimal(10, 2)
status String @default("Active") @db.VarChar(50) // Active, Triggered, Resolved
triggeredAt DateTime? @map("triggered_at")
resolvedAt DateTime? @map("resolved_at")
createdAt DateTime @default(now()) @map("created_at")

// Relations
organization Organization? @relation(fields: [orgId], references: [id])

@@index([tenantId, status])
@@map("kpi_alerts")
}

// VarianceSnapshot - Branch performance variance analysis
// Calculated periodically to compare branch performance
model VarianceSnapshot {
id String @id @default(uuid())
tenantId String @map("tenant_id")
branchId String @map("branch_id")
periodStart DateTime @map("period_start") @db.Date
periodEnd DateTime @map("period_end") @db.Date
metrics Json // {csat: 4.2, complaints: 15, repeatCustomer: 0.65}
rank Int? // Ranking among all branches (1 = best)
variance Decimal? @db.Decimal(10, 2) // % difference from org average
createdAt DateTime @default(now()) @map("created_at")

@@index([tenantId, branchId, periodStart])
@@map("variance_snapshots")
}

// ===================================================================
// DOCUMENT: 04-DATA-MODEL-SCHEMA.md, 07-FEATURES-MODULES.md
// SECTION 7: TEMPLATES & BILLING
// ===================================================================

// Template - Content templates (leadership briefs, toolkits, etc.)
// Can be global (created by Super Admin) or tenant-specific
model Template {
id String @id @default(uuid())
name String @db.VarChar(255)
type String? @db.VarChar(50) // Pilot, Huddle, Coaching, Leadership Brief
content Json // Template content with placeholders
isGlobal Boolean @default(true) @map("is_global")
createdBy String? @map("created_by") // Super Admin user ID
tenantId String? @map("tenant_id") // NULL for global templates
createdAt DateTime @default(now()) @map("created_at")
updatedAt DateTime @updatedAt @map("updated_at")

@@index([tenantId])
@@index([isGlobal])
@@map("templates")
}

// Subscription - Tenant billing subscriptions
// Tracks subscription plans and billing cycles
model Subscription {
id String @id @default(uuid())
tenantId String @map("tenant_id")
plan String @db.VarChar(50) // Starter, Growth, Enterprise
status String @default("Active") @db.VarChar(50) // Active, Cancelled, Suspended
billingCycle String @default("Monthly") @map("billing_cycle") @db.VarChar(50)
amount Decimal @db.Decimal(10, 2)
stripeSubscriptionId String? @unique @map("stripe_subscription_id") @db.VarChar(255)
currentPeriodStart DateTime @map("current_period_start") @db.Date
currentPeriodEnd DateTime @map("current_period_end") @db.Date
createdAt DateTime @default(now()) @map("created_at")
updatedAt DateTime @updatedAt @map("updated_at")

// Relations
tenant Tenant @relation(fields: [tenantId], references: [id])

@@index([tenantId])
@@map("subscriptions")
}

// UsageLog - Tracks tenant usage for billing
// Records metrics like active users, SMS credits, storage used
model UsageLog {
id String @id @default(uuid())
tenantId String @map("tenant_id")
metric String @db.VarChar(100) // active_users, sms_credits, storage_gb, api_calls
value Int
date DateTime @db.Date
createdAt DateTime @default(now()) @map("created_at")

// Relations
tenant Tenant @relation(fields: [tenantId], references: [id])

@@index([tenantId, date])
@@index([metric, date])
@@map("usage_logs")
}

// Invoice - Billing invoices for tenants
// Generated automatically for subscriptions
model Invoice {
id String @id @default(uuid())
tenantId String @map("tenant_id")
subscriptionId String? @map("subscription_id")
amount Decimal @db.Decimal(10, 2)
currency String @default("USD") @db.VarChar(3)
status String @db.VarChar(50)
dueDate DateTime @map("due_date") @db.Date
paidAt DateTime? @map("paid_at")
stripeInvoiceId String? @unique @map("stripe_invoice_id") @db.VarChar(255)
createdAt DateTime @default(now()) @map("created_at")

@@index([tenantId, status])
@@map("invoices")
}
