import {
  CreateBranchMeta,
  CreateHuddleMeta,
  CreateSessionsMeta,
  UserRegistrationMeta,
  UseTemplateMeta,
} from './event.name';

// ============ BASE INTERFACES ============
export interface BaseEvent<TMeta> {
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'USE';
  meta: TMeta;
}

export interface Notification {
  type: string;
  title: string;
  message: string;
  createdAt: Date;
  meta: Record<string, any>;
}

// ============ EVENT INTERFACES ============

export type UserRegistration = BaseEvent<UserRegistrationMeta>;
export type BranchCreation = BaseEvent<CreateBranchMeta>;
export type HuddleCreation = BaseEvent<CreateHuddleMeta>;
export type UseTemplate = BaseEvent<UseTemplateMeta>;
export type CreateSessions = BaseEvent<CreateSessionsMeta>;
