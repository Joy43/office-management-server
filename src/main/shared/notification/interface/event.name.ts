// ============ META INTERFACES ============
export interface UserRegistrationMeta {
  action: 'created';
  info: {
    id: string;
    email: string;
    name: string;
    phone?: string;
    createdAt: Date;
    recipients: Array<{
      id: string;
      email: string;
    }>;
  };
  meta?: Record<string, any>;
}

export interface CreateBranchMeta {
  action: 'created';
  info: {
    branchId: string;
    branchName: string;
    createdBy: string;
    createdAt: Date;
    recipients: Array<{
      id: string;
      email: string;
    }>;
  };
  meta?: Record<string, any>;
}

export interface CreateHuddleMeta {
  action: 'created';
  info: {
    huddleId: string;
    topic: string;
    duration: string;
    startTime: string;
    selectedDate: string;
    branchId: string;
    createdBy: string;
    createdAt: Date;
    recipients: Array<{
      id: string;
      email: string;
    }>;
  };
  meta?: Record<string, any>;
}

export interface UseTemplateMeta {
  action: 'created';
  info: {
    templateId: string;
    templateName: string;
    createdBy: string;
    createdAt: Date;
    recipients: Array<{
      id: string;
      email: string;
    }>;
  };
  meta?: Record<string, any>;
}

export interface CreateSessionsMeta {
  action: 'created';
  info: {
    sessionId: string;
    sessionName: string;
    createdBy: string;
    createdAt: Date;
    recipients: Array<{
      id: string;
      email: string;
    }>;
  };
  meta?: Record<string, any>;
}

// ============ EVENT TYPES ============
export const EVENT_TYPES = {
  USERREGISTRATION_CREATE: 'user.create',
  USERREGISTRATION_UPDATE: 'user.update',
  USERREGISTRATION_DELETE: 'user.delete',
  HUDDLE_CREATE: 'huddle.create',
  BRANCH_CREATE: 'branch.create',
  TEMPLATE_USE: 'template.use',
  SESSION_CREATE: 'session.create',
} as const;

export type EventType = keyof typeof EVENT_TYPES;

export type EventPayloadMap = {
  [EVENT_TYPES.USERREGISTRATION_CREATE]: UserRegistrationMeta;
  [EVENT_TYPES.USERREGISTRATION_UPDATE]: UserRegistrationMeta;
  [EVENT_TYPES.USERREGISTRATION_DELETE]: UserRegistrationMeta;
  [EVENT_TYPES.HUDDLE_CREATE]: CreateHuddleMeta;
  [EVENT_TYPES.BRANCH_CREATE]: CreateBranchMeta;
  [EVENT_TYPES.TEMPLATE_USE]: UseTemplateMeta;
  [EVENT_TYPES.SESSION_CREATE]: CreateSessionsMeta;
};
