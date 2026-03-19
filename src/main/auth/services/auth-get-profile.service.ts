import { successResponse, TResponse } from '@/common/response/response.util';
import { HandleError } from '@/core/error/handle-error.decorator';
import { PrismaService } from '@/lib/prisma/prisma.service';
import { AuthUtilsService } from '@/lib/utils/services/auth-utils.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthGetProfileService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authUtils: AuthUtilsService,
  ) {}

  @HandleError("Can't get user profile")
  async getProfile(userId: string) {
    const user = await this.findUserBy('id', userId);
    return user;
  }

  private async findUserBy(
    key: 'id' | 'email',
    value: string,
  ): Promise<TResponse<any>> {
    const where: any = {};
    where[key] = value;

    const user = await this.prisma.client.user.findUniqueOrThrow({
      where,
      include: {
        notifications: true,
        tenant: true,
        branch: true,
        habitLogs: true,
        assignedHabits: true,
        sessions: true,
        huddleParticipantStatuses: true,
        microHabits: true,
      },
    });

    // Remove sensitive fields like password
    const { password, ...userWithoutPassword } = user;

    return successResponse(
      userWithoutPassword,
      'User data fetched successfully',
    );
  }
}
