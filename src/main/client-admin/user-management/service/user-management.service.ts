import { UserEnum } from '@/common/enum/user.enum';
import { HandleError } from '@/core/error/handle-error.decorator';
import { AuthMailService } from '@/lib/mail/services/auth-mail.service';
import { PrismaService } from '@/lib/prisma/prisma.service';
import { AuthUtilsService } from '@/lib/utils/services/auth-utils.service';
import { EVENT_TYPES } from '@/main/shared/notification/interface/event.name';
import { UserRegistration } from '@/main/shared/notification/interface/events.payload';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreateUserClientAdminDto } from '../dto/create-user-management.dto';

@Injectable()
export class UserManagementService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly utils: AuthUtilsService,
    private readonly authMailService: AuthMailService,
    private readonly eventEmitter: EventEmitter2,
  ) {}
  // ------------------ create user client admin ------------------
  @HandleError('Failed to create user client admin')
  async createUserClientAdmin(
    createUserClientAdminDto: CreateUserClientAdminDto,
  ) {
    //-------------------  Check if user already exists -------------------
    const existingUser = await this.prisma.client.user.findUnique({
      where: { email: createUserClientAdminDto.email },
    });

    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Use default password "123456" if not provided
    const password = '12345678';
    const hashedPassword = await this.utils.hash(password);

    // Create user with isVerified: true
    const user = await this.prisma.client.user.create({
      data: {
        name: createUserClientAdminDto.name,
        email: createUserClientAdminDto.email,
        password: hashedPassword,
        role: createUserClientAdminDto.role,
        isVerified: false,
        ...(createUserClientAdminDto.branchId && {
          branchId: createUserClientAdminDto.branchId,
        }),
        ...(createUserClientAdminDto.phone && {
          phone: createUserClientAdminDto.phone,
        }),
      },
      include: {
        tenant: true,
        branch: {
          include: {
            users: {
              where: {
                role: 'MANAGER',
              },
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                profilePicture: true,
              },
            },
          },
        },
      },
    });

    // Update branch managers if role is MANAGER and branchId is provided
    if (
      createUserClientAdminDto.role === 'MANAGER' &&
      createUserClientAdminDto.branchId
    ) {
      // Check if this manager is already assigned to the branch
      const alreadyManagerInBranch =
        await this.prisma.client.branchManager.findUnique({
          where: {
            branchId_managerId: {
              branchId: createUserClientAdminDto.branchId,
              managerId: user.id,
            },
          },
        });

      if (alreadyManagerInBranch) {
        throw new Error('This manager is already assigned to this branch');
      }

      // Add manager to branch
      await this.prisma.client.branchManager.create({
        data: {
          branchId: createUserClientAdminDto.branchId,
          managerId: user.id,
        },
      });
    }

    // Send welcome email with credentials
    await this.authMailService.sendWelcomeEmail(
      user.email,
      user.name,
      password,
    );

    // Get all admin users to notify
    const admins = await this.prisma.client.user.findMany({
      where: {
        OR: [{ role: UserEnum.SUPER_ADMIN }, { role: UserEnum.EXECUTIVE }],
      },
      select: { id: true, email: true },
    });

    // Emit event for user registration to send notifications
    this.eventEmitter.emit(EVENT_TYPES.USERREGISTRATION_CREATE, {
      action: 'CREATE',
      meta: {
        action: 'created',
        info: {
          id: user.id,
          email: user.email,
          name: user.name,
          phone: user.phone || undefined,
          createdAt: user.createdAt,
          recipients: admins,
        },
        meta: {
          role: user.role,
          branchId: user.branchId || undefined,
          isVerified: user.isVerified,
        },
      },
    } as UserRegistration);

    // Return sanitized user
    const sanitizedUser = await this.utils.sanitizeUser(user as any);
    return {
      success: true,
      message: 'User created successfully',
      data: sanitizedUser,
    };
  }

  // -----------------fetch single user -----------------
  @HandleError('Failed to fetch user')
  async findOne(id: string) {
    const user = await this.prisma.client.user.findUniqueOrThrow({
      where: { id },
      include: {
        tenant: true,
        branch: {
          include: {
            users: {
              where: {
                role: 'MANAGER',
              },
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                profilePicture: true,
              },
            },
          },
        },
        sessions: true,
      },
    });

    const { password, ...userWithoutPassword } = user;

    // Get all admin users
    const SuperAdmin = await this.prisma.client.user.findMany({
      where: {
        role: UserEnum.SUPER_ADMIN,
      },
      select: { id: true, email: true },
    });

    // -------------- Emit event for user registration----------------------
    this.eventEmitter.emit(EVENT_TYPES.USERREGISTRATION_CREATE, {
      action: 'CREATE',
      meta: {
        action: 'created',
        info: {
          id: user.id,
          email: user.email,
          name: user.name,
          phone: user.phone || undefined,
          createdAt: user.createdAt,
          recipients: SuperAdmin,
        },
        meta: {
          role: user.role,
          isVerified: user.isVerified,
        },
      },
    } as UserRegistration);

    return {
      success: true,
      message: 'User fetched successfully',
      data: userWithoutPassword,
    };
  }

  @HandleError('Failed to update user')
  async update(id: string, updateUserClientAdminDto: CreateUserClientAdminDto) {
    const updateData: any = {};

    if (updateUserClientAdminDto.name) {
      updateData.name = updateUserClientAdminDto.name;
    }
    if (updateUserClientAdminDto.email) {
      updateData.email = updateUserClientAdminDto.email;
    }
    if (updateUserClientAdminDto.role) {
      updateData.role = updateUserClientAdminDto.role;
    }
    if (updateUserClientAdminDto.phone !== undefined) {
      updateData.phone = updateUserClientAdminDto.phone;
    }

    if (updateUserClientAdminDto.branchId !== undefined) {
      updateData.branchId = updateUserClientAdminDto.branchId;
    }

    const user = await this.prisma.client.user.update({
      where: { id },
      data: updateData,
      include: {
        tenant: true,
        branch: {
          include: {
            users: {
              where: {
                role: 'MANAGER',
              },
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                profilePicture: true,
              },
            },
          },
        },
      },
    });

    // Update branch managers if role is MANAGER and branchId is provided
    if (
      (updateUserClientAdminDto.role === 'MANAGER' ||
        user.role === 'MANAGER') &&
      user.branchId
    ) {
      // Check if this manager is already assigned to the branch
      const alreadyManagerInBranch =
        await this.prisma.client.branchManager.findUnique({
          where: {
            branchId_managerId: {
              branchId: user.branchId,
              managerId: user.id,
            },
          },
        });

      if (!alreadyManagerInBranch) {
        await this.prisma.client.branchManager.create({
          data: {
            branchId: user.branchId,
            managerId: user.id,
          },
        });
      }
    }

    const sanitizedUser = await this.utils.sanitizeUser(user as any);

    return {
      success: true,
      message: 'User updated successfully',
      data: sanitizedUser,
    };
  }

  @HandleError('Failed to delete user')
  async remove(id: string) {
    await this.prisma.client.user.delete({
      where: { id },
    });

    return {
      success: true,
      message: 'User deleted successfully',
      data: null,
    };
  }
}
