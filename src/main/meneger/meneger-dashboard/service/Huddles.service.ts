import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { successResponse } from './../../../../common/response/response.util';

import { HandleError } from '@/core/error/handle-error.decorator';
import { PrismaService } from '@/lib/prisma/prisma.service';
import { EVENT_TYPES } from '@/main/shared/notification/interface/event.name';
import { HuddleCreation } from '@/main/shared/notification/interface/events.payload';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  MANAGERHuddlesCreateDto,
  MANAGERHuddlesUpdateDto,
} from '../dto/meneger-huddles-create';
import { MANAGERHuddlesQueryDto } from '../dto/meneger-huddles-query.dto';

@Injectable()
export class MANAGERDashboardHuddlesService {
  private readonly logger = new Logger(MANAGERDashboardHuddlesService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @HandleError('Failed to create Huddle')
  async createHuddle(creatorId: string, dto: MANAGERHuddlesCreateDto) {
    const { HuddleStatus, participantIds, ...rest } = dto;

    // Create huddle with participants
    const huddle = await this.prisma.client.huddle.create({
      data: {
        ...rest,
        ...(HuddleStatus && { HuddleStatus }),
        creatorId,
        ...(participantIds &&
          participantIds.length > 0 && {
            membersParticipating: {
              connect: participantIds.map((id) => ({ id })),
            },
          }),
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            profilePicture: true,
            email: true,
            role: true,
          },
        },
        branch: {
          select: {
            id: true,
            branchName: true,
            tenantId: true,
          },
        },
        membersParticipating: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            profilePicture: true,
          },
        },
      },
    });

    // ✅ AUTO-JOIN: Create participant status records with 'joined' status
    if (participantIds && participantIds.length > 0) {
      await this.prisma.client.huddleParticipant.createMany({
        data: participantIds.map((userId) => ({
          huddleId: huddle.id,
          userId,
          status: 'joined', // ✅ Auto-joined when huddle is created
          joinedAt: new Date(), // ✅ Set join timestamp
        })),
      });

      this.logger.log(
        `Auto-joined ${participantIds.length} participants to huddle ${huddle.id}`,
      );
    }

    // ------------------ notification logic ------------------
    const clientAdmin = await this.prisma.client.user.findFirst({
      where: {
        tenantId: huddle.branch?.tenantId,
        role: 'CLIENT_ADMIN',
      },
      select: {
        id: true,
        email: true,
      },
    });

    const recipients = [
      // Include all participants
      ...huddle.membersParticipating.map((member) => ({
        id: member.id,
        email: member.email,
      })),
      // Include client admin if exists
      ...(clientAdmin
        ? [{ id: clientAdmin.id, email: clientAdmin.email }]
        : []),
    ];

    // Remove duplicate recipients (in case client admin is also a participant)
    const uniqueRecipients = Array.from(
      new Map(recipients.map((r) => [r.id, r])).values(),
    );

    // Emit event for huddle creation to send notifications
    this.eventEmitter.emit(EVENT_TYPES.HUDDLE_CREATE, {
      action: 'CREATE',
      meta: {
        action: 'created',
        info: {
          huddleId: huddle.id,
          topic: huddle.topic,
          duration: huddle.duration,
          startTime: huddle.startTime,
          selectedDate: huddle.selectedDate,
          branchId: huddle.branchId,
          createdBy: creatorId,
          createdAt: huddle.createdAt,
          recipients: uniqueRecipients,
        },
        meta: {
          tenantId: huddle.branch?.tenantId,
          branchName: huddle.branch?.branchName,
          topic: huddle.topic,
          duration: huddle.duration,
          startTime: huddle.startTime,
          selectedDate: huddle.selectedDate,
          branchId: huddle.branchId,
          meetLink: huddle.meetLink,
          HuddleStatus: huddle.HuddleStatus,
          participantCount: huddle.membersParticipating.length,
        },
      },
    } as HuddleCreation);

    return successResponse(huddle, 'Huddle created successfully');
  }

  // ------------------ getAllHuddles ------------------

  @HandleError('Failed to get all Huddles')
  async getAllHuddles(query: MANAGERHuddlesQueryDto) {
    const {
      page = 1,
      limit = 10,
      search,
      status,

      selectedDate,
    } = query;

    const skip = (page - 1) * limit;

    // Build where clause for filters
    const where: any = {};

    // Search by topic
    if (search) {
      where.topic = {
        contains: search,
        mode: 'insensitive',
      };
    }

    // Filter by status
    if (status) {
      where.HuddleStatus = status;
    }

    // Filter by date
    if (selectedDate) {
      where.selectedDate = selectedDate;
    }

    // Get total count for pagination
    const total = await this.prisma.client.huddle.count({ where });

    // Get paginated data
    const huddles = await this.prisma.client.huddle.findMany({
      where,
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            profilePicture: true,
          },
        },
        branch: {
          select: {
            id: true,
            branchName: true,
          },
        },
        membersParticipating: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            profilePicture: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
    });

    const totalPages = Math.ceil(total / limit);

    return successResponse(
      {
        data: huddles,
        pagination: {
          total,
          page,
          limit,
          totalPages,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
      },
      'Huddles retrieved successfully',
    );
  }

  // ----------------getHuddleById----------------
  @HandleError('Failed to get Huddle by ID')
  async getHuddleById(id: string) {
    const huddle = await this.prisma.client.huddle.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            name: true,

            email: true,
            role: true,
            profilePicture: true,
          },
        },
        branch: {
          select: {
            id: true,
            branchName: true,
            tenant: {
              select: {
                id: true,
                companyEmail: true,
                companyName: true,
                subdomain: true,
              },
            },
          },
        },

        membersParticipating: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            profilePicture: true,
          },
        },
      },
    });

    return successResponse(huddle, 'Huddle retrieved successfully');
  }
  // ----------- update Huddle  -----------
  @HandleError('Failed to update Huddle')
  async updateHuddle(id: string, dto: MANAGERHuddlesUpdateDto) {
    // Map the DTO to Prisma's expected field names
    const { HuddleStatus, participantIds, branchId, ...rest } = dto;

    const updatedHuddle = await this.prisma.client.huddle.update({
      where: { id },
      data: {
        ...rest,
        ...(HuddleStatus && { HuddleStatus }),
        ...(branchId && {
          branch: {
            connect: { id: branchId },
          },
        }),
        ...(participantIds && {
          membersParticipating: {
            set: participantIds.map((id) => ({ id })),
          },
        }),
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,

            email: true,
            role: true,
          },
        },
        branch: {
          select: {
            id: true,
            branchName: true,
            tenant: {
              select: {
                id: true,
                companyEmail: true,
                companyName: true,
                subdomain: true,
              },
            },
          },
        },
        membersParticipating: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            profilePicture: true,
          },
        },
      },
    });

    return successResponse(updatedHuddle, 'Huddle updated successfully');
  }

  @HandleError('Failed to delete Huddle')
  async deleteHuddle(id: string) {
    const deletedHuddle = await this.prisma.client.huddle.delete({
      where: { id },
    });
    return deletedHuddle;
  }

  //    --------------- updateHuddleStatus ------------------
  @HandleError('Failed to update Huddle status')
  async updateHuddleStatus(id: string) {
    const updatedHuddle = await this.prisma.client.huddle.update({
      where: { id },
      data: {
        HuddleStatus: 'completed',
      },
    });

    return successResponse(updatedHuddle, 'Huddle status updated successfully');
  }

  @HandleError('Failed to complete your huddle participation')
  async completeOwnHuddle(userId: string, huddleId: string) {
    const huddle = await this.prisma.client.huddle.findUnique({
      where: { id: huddleId },
      select: {
        id: true,
        topic: true,
        HuddleStatus: true,
      },
    });

    if (!huddle) {
      throw new NotFoundException('Huddle not found');
    }

    if (huddle.HuddleStatus === 'cancelled') {
      throw new ForbiddenException('This huddle has been cancelled');
    }

    const participantStatus =
      await this.prisma.client.huddleParticipant.findUnique({
        where: {
          huddleId_userId: {
            huddleId,
            userId,
          },
        },
      });

    if (!participantStatus) {
      throw new ForbiddenException('You are not a participant of this huddle');
    }

    if (participantStatus.status === 'completed') {
      throw new ForbiddenException('You have already completed this huddle');
    }

    const updatedStatus = await this.prisma.client.huddleParticipant.update({
      where: {
        huddleId_userId: {
          huddleId,
          userId,
        },
      },
      data: {
        status: 'completed',
        completedAt: new Date(),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        huddle: {
          select: {
            topic: true,
            selectedDate: true,
            startTime: true,
          },
        },
      },
    });

    // Check if all participants completed - auto-complete huddle
    const allStatuses = await this.prisma.client.huddleParticipant.findMany({
      where: { huddleId },
      select: { status: true },
    });

    const allCompleted = allStatuses.every((s) => s.status === 'completed');

    if (allCompleted) {
      await this.prisma.client.huddle.update({
        where: { id: huddleId },
        data: { HuddleStatus: 'completed' },
      });
    }

    return successResponse(
      updatedStatus,
      'Your huddle participation marked as completed',
    );
  }

  // ✅ Get user's own huddles with their status
  @HandleError('Failed to get my huddles')
  async getMyHuddles(userId: string) {
    const huddles = await this.prisma.client.huddleParticipant.findMany({
      where: { userId },
      include: {
        huddle: {
          include: {
            creator: {
              select: {
                id: true,
                name: true,
                profilePicture: true,
                email: true,
              },
            },
            branch: {
              select: {
                id: true,
                branchName: true,
              },
            },
            participantStatuses: {
              select: {
                status: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return successResponse(
      huddles.map((hp) => ({
        ...hp.huddle,
        myStatus: hp.status,
        myCompletedAt: hp.completedAt,
        myJoinedAt: hp.joinedAt,
        myNotes: hp.notes,
        totalParticipants: hp.huddle.participantStatuses.length,
        completedParticipants: hp.huddle.participantStatuses.filter(
          (p) => p.status === 'completed',
        ).length,
      })),
      'Your huddles retrieved successfully',
    );
  }

  // Manager: Get all huddles with participant statuses
  @HandleError('Failed to get all user huddles')
  async getAllUserHuddles() {
    const huddles = await this.prisma.client.huddle.findMany({
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            profilePicture: true,
          },
        },
        branch: {
          select: {
            id: true,
            branchName: true,
            tenantId: true,
          },
        },
        membersParticipating: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            profilePicture: true,
          },
        },
        participantStatuses: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
                profilePicture: true,
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const huddlesWithStats = huddles.map((huddle) => {
      const totalParticipants = huddle.participantStatuses.length;
      const completedCount = huddle.participantStatuses.filter(
        (p) => p.status === 'completed',
      ).length;
      const joinedCount = huddle.participantStatuses.filter(
        (p) => p.status === 'joined',
      ).length;
      const absentCount = huddle.participantStatuses.filter(
        (p) => p.status === 'absent',
      ).length;

      return {
        ...huddle,
        statistics: {
          totalParticipants,
          completedCount,
          joinedCount,
          absentCount,
          pendingCount:
            totalParticipants - completedCount - joinedCount - absentCount,
          completionRate:
            totalParticipants > 0
              ? Math.round((completedCount / totalParticipants) * 100)
              : 0,
        },
        participantsByStatus: {
          completed: huddle.participantStatuses
            .filter((p) => p.status === 'completed')
            .map((p) => ({
              ...p.user,
              completedAt: p.completedAt,
            })),
          joined: huddle.participantStatuses
            .filter((p) => p.status === 'joined')
            .map((p) => ({
              ...p.user,
              joinedAt: p.joinedAt,
            })),
          absent: huddle.participantStatuses
            .filter((p) => p.status === 'absent')
            .map((p) => p.user),
          pending: huddle.participantStatuses
            .filter((p) => p.status === 'pending')
            .map((p) => p.user),
        },
      };
    });

    return successResponse(
      huddlesWithStats,
      'All user huddles with participant statuses retrieved successfully',
    );
  }
}
