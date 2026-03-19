import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { UserEnum } from '@/common/enum/user.enum';
import { successResponse } from '@/common/response/response.util';
import { HandleError } from '@/core/error/handle-error.decorator';
import { PrismaService } from '@/lib/prisma/prisma.service';
import { EVENT_TYPES } from '@/main/shared/notification/interface/event.name';
import { BranchCreation } from '@/main/shared/notification/interface/events.payload';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AssignManagersToBranchDto } from '../dto/assign-managers-to-branch.dto';
import { CreateBranchDto } from '../dto/create-branch-management.dto';
import { GetBranchesDto } from '../dto/get-branches.dto';
import { UpdateBranchManagementDto } from '../dto/update-branch-management.dto';

@Injectable()
export class BranchManagementService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  // --------------------- CREATE BRANCH ----------------------
  @HandleError('Failed to create branch', 'BranchManagement')
  async createBranch(dto: CreateBranchDto, clientAdminUserId: string) {
    // Get the client admin's tenant
    const clientAdmin = await this.prisma.client.user.findUnique({
      where: { id: clientAdminUserId },
      select: {
        tenantId: true,
        role: true,
      },
    });

    if (!clientAdmin?.tenantId) {
      throw new NotFoundException('No tenant associated with this user');
    }

    if (clientAdmin.role !== 'CLIENT_ADMIN') {
      throw new ForbiddenException('Only CLIENT_ADMIN can create branches');
    }

    const createdBranch = await this.prisma.client.branch.create({
      data: {
        branchName: dto.branchName,
        branchEmail: dto.branchEmail,
        subdomain: dto.subdomain,
        staffCount: dto.staffCount || '0',
        tenantId: clientAdmin.tenantId,
      },
      include: {
        tenant: true,
        managers: {
          include: {
            manager: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                profilePicture: true,
                status: true,
              },
            },
          },
        },
      },
    });

    // ------------------------------ Notification Logic ------------------------------
    // Get all admin users to notify
    const Recipient = await this.prisma.client.user.findMany({
      where: {
        OR: [{ role: UserEnum.SUPER_ADMIN }, { role: UserEnum.EXECUTIVE }],
      },
      select: { id: true, email: true },
    });

    // Emit event for user registration to send notifications
    this.eventEmitter.emit(EVENT_TYPES.BRANCH_CREATE, {
      action: 'CREATE',
      meta: {
        action: 'created',
        info: {
          branchId: createdBranch.id,
          branchName: createdBranch.branchName,
          createdBy: clientAdminUserId,
          createdAt: createdBranch.createdAt,
          recipients: Recipient,
        },
        meta: {
          tenantId: createdBranch.tenantId,
          branchEmail: createdBranch.branchEmail,
          staffCount: createdBranch.staffCount,
          subdomain: createdBranch.subdomain,
        },
      },
    } as BranchCreation);

    return successResponse(createdBranch, 'Branch created successfully');
  }

  // --------------------- GET ALL BRANCHES ----------------------

  @HandleError('Failed to get branches', 'BranchManagement')
  async findAll(dto: GetBranchesDto) {
    const { search, page = 1, limit = 10 } = dto;
    const skip = (page - 1) * limit;

    const whereCondition: any = {};

    if (search) {
      whereCondition.OR = [
        {
          branchName: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          subdomain: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ];
    }

    const [branches, total] = await Promise.all([
      this.prisma.client.branch.findMany({
        where: whereCondition,
        include: {
          tenant: true,
          managers: {
            include: {
              manager: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  phone: true,
                  role: true,
                  profilePicture: true,
                  status: true,
                },
              },
            },
          },
          _count: {
            select: {
              users: true,
              sessions: true,
              programs: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.client.branch.count({
        where: whereCondition,
      }),
    ]);

    return successResponse(
      {
        branches,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
      'Branches fetched successfully',
    );
  }

  // --------------------- GET ONE BRANCH ----------------------

  @HandleError('Failed to get branch', 'BranchManagement')
  async findOne(id: string) {
    const branch = await this.prisma.client.branch.findUniqueOrThrow({
      where: { id },
      include: {
        tenant: true,
        managers: {
          include: {
            manager: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                profilePicture: true,
                status: true,
              },
            },
          },
        },
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
          },
        },
        sessions: true,
        programs: true,
        _count: {
          select: {
            users: true,
            sessions: true,
            programs: true,
            huddles: true,
          },
        },
      },
    });

    return successResponse(branch, 'Branch fetched successfully');
  }

  // --------------------- UPDATE BRANCH ----------------------
  @HandleError('Failed to update branch', 'BranchManagement')
  async update(
    id: string,
    updateBranchManagementDto: UpdateBranchManagementDto,
  ) {
    const updatedBranch = await this.prisma.client.branch.update({
      where: { id },
      data: {
        ...(updateBranchManagementDto.branchName && {
          branchName: updateBranchManagementDto.branchName,
        }),
        ...(updateBranchManagementDto.branchEmail && {
          branchEmail: updateBranchManagementDto.branchEmail,
        }),
        ...(updateBranchManagementDto.subdomain && {
          subdomain: updateBranchManagementDto.subdomain,
        }),
        ...(updateBranchManagementDto.staffCount && {
          staffCount: updateBranchManagementDto.staffCount,
        }),
      },
      include: {
        tenant: true,
        managers: {
          include: {
            manager: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                profilePicture: true,
                status: true,
              },
            },
          },
        },
      },
    });

    return successResponse(updatedBranch, 'Branch updated successfully');
  }

  // ────────────────────────────────────────────────
  //           NEW METHOD - Assign managers
  // ────────────────────────────────────────────────
  @HandleError('Failed to assign managers to branch', 'BranchManagement')
  async assignManagers(branchId: string, dto: AssignManagersToBranchDto) {
    // Verify branch exists
    const branch = await this.prisma.client.branch.findUnique({
      where: { id: branchId },
    });

    if (!branch) {
      throw new Error(`Branch with ID ${branchId} not found`);
    }

    // Verify all users exist AND have role MANAGER
    const users = await this.prisma.client.user.findMany({
      where: {
        id: { in: dto.managerIds },
        role: 'MANAGER',
      },
      select: { id: true },
    });

    if (users.length !== dto.managerIds.length) {
      const found = new Set(users.map((u) => u.id));
      const missing = dto.managerIds.filter((id) => !found.has(id));
      throw new Error(
        `Some users are not found or do not have MANAGER role: ${missing.join(', ')}`,
      );
    }

    // Replace all existing managers (or use upsert/delete+create pattern)
    await this.prisma.client.$transaction(async (tx) => {
      // Option A: Replace everything (most common pattern)
      await tx.branchManager.deleteMany({
        where: { branchId },
      });

      if (dto.managerIds.length > 0) {
        await tx.branchManager.createMany({
          data: dto.managerIds.map((managerId) => ({
            branchId,
            managerId,
          })),
          skipDuplicates: true,
        });
      }
    });

    // Return updated branch with relations
    const updatedBranch = await this.prisma.client.branch.findUniqueOrThrow({
      where: { id: branchId },
      include: {
        tenant: true,
        managers: {
          include: {
            manager: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                role: true,
                profilePicture: true,
                status: true,
              },
            },
          },
        },
      },
    });

    return successResponse(updatedBranch, 'Managers assigned successfully');
  }
  // --------------- findAllUsersInBranch-------------------

  async findAllUsersInBranch(id: string) {
    const users = await this.prisma.client.user.findMany({
      where: { branchId: id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        status: true,
        profilePicture: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return successResponse(users, 'Users in branch fetched successfully');
  }

  // -------------- findAllManagersInBranch-------------------

  async findAllManagersInBranch(id: string) {
    const managers = await this.prisma.client.branchManager.findMany({
      where: { branchId: id, manager: { role: 'MANAGER' } },
      include: {
        manager: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            phone: true,
            status: true,
            profilePicture: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const formattedManagers = managers.map((bm) => bm.manager);

    return successResponse(
      formattedManagers,
      'Managers in branch fetched successfully',
    );
  }

  // ---------------- delete branch ----------------
  @HandleError('Failed to delete branch', 'BranchManagement')
  async remove(id: string) {
    await this.prisma.client.branch.delete({
      where: { id },
    });

    return successResponse(null, 'Branch deleted successfully');
  }
}
