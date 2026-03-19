import { successResponse } from '@/common/response/response.util';
import { AppError } from '@/core/error/handle-error.app';
import { HandleError } from '@/core/error/handle-error.decorator';

import { PrismaService } from '@/lib/prisma/prisma.service';
import { AuthUtilsService } from '@/lib/utils/services/auth-utils.service';
import { Injectable } from '@nestjs/common';

import { UpdateProfileDto } from '../dto/update-profile.dto';

@Injectable()
export class AuthUpdateProfileService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authUtils: AuthUtilsService,
  ) {}

  @HandleError('Failed to update profile', 'User')
  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const user = await this.prisma.client.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    // Handle profile picture update if provided
    let fileInstance = null;
    if (dto.image) {
      fileInstance = await this.prisma.client.fileInstance.findUnique({
        where: { id: dto.image },
      });
    }

    const updatedUser = await this.prisma.client.user.update({
      where: { id: userId },
      data: {
        name: dto.name?.trim() ? dto.name.trim() : user.name,
        ...(fileInstance && {
          profilePicture: fileInstance.url,
        }),
        ...(dto.phone !== undefined && { phone: dto.phone }),
        // Settings
        ...(dto.isLoginAlertsNotification !== undefined && {
          isLoginAlertsNotification: dto.isLoginAlertsNotification,
        }),
        ...(dto.is2FAEnabled !== undefined && {
          is2FAEnabled: dto.is2FAEnabled,
        }),
        ...(dto.isEmailNotificationsEnabled !== undefined && {
          isEmailNotificationsEnabled: dto.isEmailNotificationsEnabled,
        }),
        ...(dto.isSmsNotificationsEnabled !== undefined && {
          isSmsNotificationsEnabled: dto.isSmsNotificationsEnabled,
        }),
        ...(dto.isPushNotificationsEnabled !== undefined && {
          isPushNotificationsEnabled: dto.isPushNotificationsEnabled,
        }),
        ...(dto.isReceiveWhatsAppNotifications !== undefined && {
          isReceiveWhatsAppNotifications: dto.isReceiveWhatsAppNotifications,
        }),
        ...(dto.isDasktopNotificationsEnabled !== undefined && {
          isDasktopNotificationsEnabled: dto.isDasktopNotificationsEnabled,
        }),
        ...(dto.isReceiveSlackNotifications !== undefined && {
          isReceiveSlackNotifications: dto.isReceiveSlackNotifications,
        }),
        ...(dto.isDailySummariesEnabled !== undefined && {
          isDailySummariesEnabled: dto.isDailySummariesEnabled,
        }),
      },
    });

    return successResponse(
      await this.authUtils.sanitizeUser({
        ...updatedUser,
        profilePicture: fileInstance || null,
      } as any),
      'Profile updated successfully',
    );
  }
}
