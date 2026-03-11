import { UserRole, UserStatus } from '@prisma';
import { Expose } from 'class-transformer';

export class UserResponseDto {
  @Expose()
  id: string;

  // ===== Identity =====
  @Expose()
  name: string;

  @Expose()
  email: string;

  // ===== Settings =====
  @Expose()
  role: UserRole;

  @Expose()
  status: UserStatus;

  @Expose()
  isVerified: boolean;

  @Expose()
  isLoginAlertsNotification?: boolean;

  @Expose()
  is2FAEnabled?: boolean;

  @Expose()
  isEmailNotificationsEnabled?: boolean;

  @Expose()
  isSmsNotificationsEnabled?: boolean;

  @Expose()
  isPushNotificationsEnabled?: boolean;

  @Expose()
  isReceiveWhatsAppNotifications?: boolean;

  @Expose()
  isDasktopNotificationsEnabled?: boolean;

  @Expose()
  isReceiveSlackNotifications?: boolean;

  @Expose()
  isDailySummariesEnabled?: boolean;

  // ===== Logout / activity tracking =====
  @Expose()
  lastLoginAt?: Date;

  @Expose()
  lastActiveAt?: Date;

  // ===== Avatar =====

  @Expose()
  profilePictureUrl?: string;

  @Expose()
  avatarUrl?: string;

  // ===== Meta =====
  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  deletedAt?: Date;
}
