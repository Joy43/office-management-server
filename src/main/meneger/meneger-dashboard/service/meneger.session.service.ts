import { Injectable, Logger } from '@nestjs/common';

import {
  successPaginatedResponse,
  successResponse,
} from '@/common/response/response.util';
import { HandleError } from '@/core/error/handle-error.decorator';
import { PrismaService } from '@/lib/prisma/prisma.service';
import {
  EmployeeStatusFilter,
  ManagerEmployeeFilterDto,
} from '../dto/manager-employee-filter.dto';
import {
  EmployeeDataDto,
  ManagerEmployeeResponseDto,
} from '../dto/manager-employee-response.dto';
import { ManagerCreateSessionDto } from '../dto/meneger.session-crearte.dto';
import { ManagerUpdateSessionStatusDto } from '../dto/meneger.update-session-status.dto';

@Injectable()
export class MANAGERDashboarSessionService {
  private readonly logger = new Logger(MANAGERDashboarSessionService.name);

  constructor(private readonly prisma: PrismaService) {}

  // -------------------getManagerEmployee------------------------
  @HandleError(
    'Failed to get manager employees',
    'MANAGERDashboarSessionService',
  )
  async getManagerEmployee(
    tenantId: string,
    filterDto: ManagerEmployeeFilterDto,
  ) {
    const {
      searchName,
      status,

      page = 1,
      limit = 10,
    } = filterDto;

    // Build where clause for filtering
    const whereClause: any = {
      tenantId,
      role: 'STAFF', // Based on UserRole enum
    };

    // Add search filter
    if (searchName) {
      whereClause.OR = [
        { name: { contains: searchName, mode: 'insensitive' } },
        { email: { contains: searchName, mode: 'insensitive' } },
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get total count for pagination
    const totalEmployees = await this.prisma.client.user.count({
      where: whereClause,
    });

    // Fetch employees with all required data
    const employees = await this.prisma.client.user.findMany({
      where: whereClause,
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        profilePicture: true,
        habitAssignments: {
          include: {
            habit: {
              include: {
                habitLogs: {
                  where: {
                    userId: undefined, // Will be set dynamically
                  },
                },
              },
            },
          },
        },
        assignedHabits: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                profilePicture: true,
                role: true,
              },
            },
            habit: true,
          },
        },
      },
    });

    // Process each employee's data
    const processedEmployees: EmployeeDataDto[] = await Promise.all(
      employees.map(async (employee) => {
        // Get habit logs for this user
        const habitLogs = await this.prisma.client.habitLog.findMany({
          where: {
            userId: employee.id,
            tenantId,
          },
          include: {
            habit: true,
          },
          orderBy: {
            date: 'desc',
          },
        });

        // Calculate habits data
        const habitAssignments = employee.habitAssignments;
        const totalHabits = habitAssignments.length;

        // Calculate habits with completion percentage and streak
        const habitsData = habitAssignments.map((assignment) => {
          const habit = assignment.habit;
          const habitSpecificLogs = habitLogs.filter(
            (log) => log.habitId === habit.id,
          );

          // Calculate completion percentage (last 30 days)
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

          const recentLogs = habitSpecificLogs.filter(
            (log) => log.date >= thirtyDaysAgo,
          );
          const completedLogs = recentLogs.filter((log) => log.completed);
          const completionPercentage =
            recentLogs.length > 0
              ? Math.round((completedLogs.length / recentLogs.length) * 100)
              : 0;

          // Calculate current streak
          let streak = 0;
          const sortedLogs = habitSpecificLogs
            .filter((log) => log.completed)
            .sort((a, b) => b.date.getTime() - a.date.getTime());

          if (sortedLogs.length > 0) {
            let currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0);

            for (const log of sortedLogs) {
              const logDate = new Date(log.date);
              logDate.setHours(0, 0, 0, 0);

              const diffDays = Math.floor(
                (currentDate.getTime() - logDate.getTime()) /
                  (1000 * 60 * 60 * 24),
              );

              if (diffDays === streak) {
                streak++;
              } else if (diffDays > streak) {
                break;
              }
            }
          }

          return {
            habitId: habit.id,
            habitName: habit.title,
            habitDescription: habit.description || '',
            completionPercentage,
            streak,
          };
        });

        // Calculate overall score (average completion percentage / 20 to get out of 5)
        const avgCompletion =
          habitsData.length > 0
            ? habitsData.reduce((sum, h) => sum + h.completionPercentage, 0) /
              habitsData.length
            : 0;
        const score = parseFloat(((avgCompletion / 100) * 5).toFixed(2));

        // Determine status based on score
        let employeeStatus: 'Great' | 'Needs' | 'Bad';
        if (score >= 4.0) {
          employeeStatus = 'Great';
        } else if (score >= 2.5) {
          employeeStatus = 'Needs';
        } else {
          employeeStatus = 'Bad';
        }

        // Find assigned trainer (the user who assigned habits to this employee)
        const trainerAssignment = employee.assignedHabits.find(
          (assignment) => assignment.user?.role === 'TAINER',
        );

        const assignedTrainer =
          trainerAssignment && trainerAssignment.user
            ? {
                id: trainerAssignment.user.id,
                name: trainerAssignment.user.name,
                profilePicture: trainerAssignment.user.profilePicture,
              }
            : null;

        return {
          id: employee.id,
          name: employee.name,
          email: employee.email,
          profilePicture: employee.profilePicture,
          phone: employee.phone,
          totalHabits,
          score,
          status: employeeStatus,
          assignedTrainer,
          habits: habitsData,
        };
      }),
    );

    // Apply post-query filters
    let filteredEmployees = processedEmployees;

    // Filter by status
    if (status && status !== EmployeeStatusFilter.ALL) {
      filteredEmployees = filteredEmployees.filter(
        (emp) => emp.status === status,
      );
    }

    // Recalculate pagination after filtering
    const filteredTotal = filteredEmployees.length;
    const totalPages = Math.ceil(filteredTotal / limit);

    const response: ManagerEmployeeResponseDto = {
      totalEmployees: filteredTotal,
      currentPage: page,
      totalPages,
      limit,
      employees: filteredEmployees,
    };

    return successResponse(
      response,
      'Manager employees retrieved successfully',
    );
  }

  // ------------------ get dashboard organization overview----------------------
  @HandleError('Failed to create session', 'MANAGERDashboarSessionService')
  async createSession(speakerId: string, dto: ManagerCreateSessionDto) {
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

  // --------------- getAllSessions ------------------
  // Updated Service Method
  @HandleError('Failed to get all sessions', 'MANAGERDashboardSessionService')
  async getAllSessions(
    speakerId: string,
    page: number = 1,
    limit: number = 10,
    search?: string,
    status?: string,
    sessionType?: string,
  ) {
    // Find speaker/manager with branch
    const user = await this.prisma.client.user.findUnique({
      where: { id: speakerId },
      select: {
        id: true,
        branchId: true,
        role: true,
      },
    });

    if (!user?.branchId) {
      throw new Error('User is not assigned to any branch');
    }

    // Build where clause
    const whereClause: any = {
      branchId: user.branchId,
    };

    // Add search filter if provided
    if (search) {
      whereClause.SessionTitle = {
        contains: search,
        mode: 'insensitive', // Case-insensitive search
      };
    }

    // Add status filter if provided
    if (status) {
      whereClause.sessionstatus = status;
    }

    // Add session type filter if provided
    if (sessionType) {
      whereClause.SessionType = {
        contains: sessionType,
        mode: 'insensitive',
      };
    }

    // Get total count with filters
    const total = await this.prisma.client.session.count({
      where: whereClause,
    });

    const skip = (page - 1) * limit;

    // Fetch sessions with full relations
    const sessions = await this.prisma.client.session.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        // Speaker info
        speaker: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            profilePicture: true,
          },
        },

        // Session creator (user)
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },

        // Branch info
        branch: {
          select: {
            id: true,
            branchName: true,
          },
        },

        // Program info
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
      'Sessions retrieved successfully',
    );
  }

  // ------------------ get session by id --------------------
  @HandleError('Failed to get session by id', 'MANAGERDashboarSessionService')
  async getSessionById(id: string) {
    const session = await this.prisma.client.session.findUnique({
      where: { id },
      include: {
        // ------------- Speaker info -----------------
        speaker: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            profilePicture: true,
          },
        },

        //--------------  Session creator (user) -----------------
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },

        //----------------- Branch info -----------------
        branch: {
          select: {
            id: true,
            branchName: true,
          },
        },

        // ------------- Program info -----------------
        program: {
          select: {
            id: true,
            programStatus: true,
          },
        },
      },
    });

    if (!session) {
      throw new Error('Session not found');
    }

    // -------------------Transform data -------------------
    const transformedData = {
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

      program: session.program
        ? {
            id: session.program.id,
            title: session.program.programStatus,
          }
        : null,
    };

    return {
      status: 'success',
      message: 'Session retrieved successfully',
      data: transformedData,
    };
  }

  // --------------- getOwnSessions ------------------
  @HandleError('Failed to get own sessions', 'MANAGERDashboarSessionService')
  async getOwnSessions(userId: string, page: number = 1, limit: number = 10) {
    //  Get total count for pagination
    const total = await this.prisma.client.session.count({
      where: {
        speakerId: userId,
      },
    });

    //  Calculate skip for pagination
    const skip = (page - 1) * limit;

    //  Fetch sessions created by the user
    const sessions = await this.prisma.client.session.findMany({
      where: {
        speakerId: userId,
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        // Speaker info
        speaker: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            profilePicture: true,
          },
        },

        // Session creator (user)
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },

        // Branch info
        branch: {
          select: {
            id: true,
            branchName: true,
          },
        },

        // Program info
        program: {
          select: {
            id: true,
            programStatus: true,
          },
        },
      },
    });

    //  Transform data
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

      program: session.program
        ? {
            id: session.program.id,
            title: session.program.programStatus,
          }
        : null,
    }));

    //  Return paginated response
    return successPaginatedResponse(
      transformedData,
      { page, limit, total },
      'Own sessions retrieved successfully',
    );
  }

  // ----------- updateSession ------------
  @HandleError('Failed to update session', 'MANAGERDashboarSessionService')
  async updateSession(id: string, dto: ManagerCreateSessionDto) {
    const session = await this.prisma.client.session.update({
      where: { id },
      data: dto,
    });

    return {
      status: 'success',
      message: 'Session updated successfully',
      data: session,
    };
  }

  // ----------- deleteSession ------------
  @HandleError('Failed to delete session', 'MANAGERDashboarSessionService')
  async deleteSession(id: string) {
    const session = await this.prisma.client.session.delete({
      where: { id },
    });

    return {
      status: 'success',
      message: 'Session deleted successfully',
      data: session,
    };
  }

  // ---------------- updateSessionStatus------------------
  @HandleError(
    'Failed to update session status',
    'MANAGERDashboarSessionService',
  )
  async updateSessionStatus(id: string, dto: ManagerUpdateSessionStatusDto) {
    const session = await this.prisma.client.session.update({
      where: { id },
      data: {
        sessionstatus: dto.sessionstatus,
        sessioncompliance: dto.sessioncompliance,
      },
    });

    return {
      status: 'success',
      message: 'Session status updated successfully',
      data: {
        id: session.id,
        sessionstatus: dto.sessionstatus,
        sessioncompliance: dto.sessioncompliance,
      },
    };
  }
}
