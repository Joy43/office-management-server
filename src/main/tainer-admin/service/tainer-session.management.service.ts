import { successPaginatedResponse } from '@/common/response/response.util';
import { HandleError } from '@/core/error/handle-error.decorator';
import { PrismaService } from '@/lib/prisma/prisma.service';
import { ManagerCreateSessionDto } from '@/main/meneger/meneger-dashboard/dto/meneger.session-crearte.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TainerSessionManagementService {
  constructor(private readonly prisma: PrismaService) {}

  // ------------------ get dashboard organization overview----------------------
  @HandleError('Failed to create session', 'TRAINERDashboardSessionService')
  async createSessionTainer(speakerId: string, dto: ManagerCreateSessionDto) {
    const {
      sessionTitle,
      sessionType,
      sessionstatus,
      sessioncompliance,
      sessionparticipantIds,
      ...rest
    } = dto;

    // Get manager's branch information
    const manager = await this.prisma.client.user.findUnique({
      where: { id: speakerId },
      select: { branchId: true },
    });

    if (!manager?.branchId) {
      throw new Error('Manager is not assigned to any branch');
    }

    const participantIds = sessionparticipantIds ?? [];

    // fetch only users that REALLY exist
    const validParticipants = await this.prisma.client.user.findMany({
      where: {
        id: { in: participantIds },
        branchId: manager.branchId,
      },
      select: { id: true },
    });

    if (validParticipants.length !== participantIds.length) {
      const validIds = validParticipants.map((u) => u.id);
      const invalidIds = participantIds.filter((id) => !validIds.includes(id));

      throw new Error(`Invalid participant IDs: ${invalidIds.join(', ')}`);
    }

    const session = await this.prisma.client.session.create({
      data: {
        ...rest,
        SessionTitle: sessionTitle,
        SessionType: sessionType,

        speaker: {
          connect: { id: speakerId },
        },

        branch: {
          connect: { id: manager.branchId },
        },

        sessionMemberParticipants: {
          connect: validParticipants.map((u) => ({ id: u.id })),
        },
      },
      include: {
        speaker: true,
        branch: true,
        sessionMemberParticipants: true,
      },
    });

    return {
      status: 'success',
      message: 'Session created successfully',
      data: session,
    };
  }

  // ------------------ getUpcomingSessions----------------------

  @HandleError(
    'Failed to get upcoming sessions',
    'TRAINERDashboardSessionService',
  )
  async getUpcomingSessions(
    trainerId: string,
    page: number = 1,
    limit: number = 10,
    search?: string,
  ) {
    // Find trainer with branch
    const trainer = await this.prisma.client.user.findUnique({
      where: { id: trainerId },
      select: {
        id: true,
        branchId: true,
        role: true,
      },
    });

    if (!trainer?.branchId) {
      throw new Error('Trainer is not assigned to any branch');
    }

    const now = new Date().toISOString();

    // Build where clause
    const whereClause: any = {
      branchId: trainer.branchId,
      scheduledAt: {
        gte: now,
      },
      isActive: true,
      sessionstatus: {
        in: ['SCHEDULE', 'PENDING'],
      },
    };

    // Add search filter if provided
    if (search) {
      whereClause.SessionTitle = {
        contains: search,
        mode: 'insensitive',
      };
    }

    // Get total count for pagination
    const total = await this.prisma.client.session.count({
      where: whereClause,
    });

    const skip = (page - 1) * limit;

    // Fetch upcoming sessions
    const sessions = await this.prisma.client.session.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: {
        scheduledAt: 'asc',
      },
      include: {
        speaker: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            profilePicture: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        branch: {
          select: {
            id: true,
            branchName: true,
          },
        },
        program: {
          select: {
            id: true,
            programStatus: true,
          },
        },
        sessionMemberParticipants: {
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

    // Transform data
    const transformedData = sessions.map((session) => ({
      id: session.id,
      title: session.SessionTitle,
      agenda: session.agenda,
      scheduledAt: session.scheduledAt,
      duration: session.duration,
      meetingLink: session.meetingLink,
      materials: session.materials,
      type: session.SessionType,
      isActive: session.isActive,
      status: session.sessionstatus,
      complianceStatus: session.sessioncompliance,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,

      speaker: session.speaker
        ? {
            id: session.speaker.id,
            name: session.speaker.name,
            email: session.speaker.email,
            role: session.speaker.role,
            avatar: session.speaker.profilePicture,
          }
        : null,

      createdBy: session.user
        ? {
            id: session.user.id,
            name: session.user.name,
            email: session.user.email,
          }
        : null,

      branch: session.branch
        ? {
            id: session.branch.id,
            name: session.branch.branchName,
          }
        : null,

      participants: session.sessionMemberParticipants
        ? session.sessionMemberParticipants.map((participant) => ({
            id: participant.id,
            name: participant.name,
            email: participant.email,
            role: participant.role,
            profilePicture: participant.profilePicture,
          }))
        : [],

      program: session.program
        ? {
            id: session.program.id,
            title: session.program.programStatus,
          }
        : null,
    }));

    // Return paginated response
    return successPaginatedResponse(
      transformedData,
      { page, limit, total },
      'Upcoming sessions retrieved successfully',
    );
  }
}
