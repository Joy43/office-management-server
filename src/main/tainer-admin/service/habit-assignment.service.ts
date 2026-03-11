// ============= UPDATED SERVICE =============

// service/habit-assignment.service.ts
import {
  successPaginatedResponse,
  successResponse,
} from '@/common/response/response.util';
import { HandleError } from '@/core/error/handle-error.decorator';
import { PrismaService } from '@/lib/prisma/prisma.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateScoreHabitsDto } from '../dto/create-score-habits.dto';
import { GetAssignedTeamMembersDto } from '../dto/get-assigned-team-members.dto';
import { GetUsersWithHuddlesSessionsDto } from '../dto/get-users-with-huddles-sessions.dto';

@Injectable()
export class HabitAssignmentService {
  constructor(private prisma: PrismaService) {}

  /**
   * Get assigned team members with their habit progress
   */
  async getAssignedTeamMembers(
    managerId: string,
    dto: GetAssignedTeamMembersDto,
  ) {
    const { page = 1, limit = 10, search, status } = dto;

    // Get manager's branch and tenant
    const manager = await this.prisma.client.user.findUnique({
      where: { id: managerId },
      select: {
        branchId: true,
        branch: {
          select: {
            tenantId: true,
          },
        },
      },
    });

    if (!manager?.branchId) {
      throw new NotFoundException('Manager is not assigned to any branch');
    }

    const tenantId = manager.branch?.tenantId;

    // Build where clause for users
    const userWhereClause: any = {
      branchId: manager.branchId,
      role: { in: ['USER', 'STAFF'] },
      status: 'ACTIVE',
    };

    // Add search filter
    if (search) {
      userWhereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ];
    }

    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this.prisma.client.user.findMany({
        where: userWhereClause,
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          profilePicture: true,
          habitAssignments: {
            where: {
              branchId: manager.branchId,
            },
            include: {
              habit: {
                select: {
                  id: true,
                  title: true,
                  description: true,
                },
              },
              assignedByUser: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          habitLogs: {
            where: {
              ...(tenantId && { tenantId: tenantId }),
            },
            orderBy: {
              date: 'desc',
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.client.user.count({ where: userWhereClause }),
    ]);

    // Transform data with calculations
    const transformedData = users.map((user) => {
      const assignments = user.habitAssignments;
      const logs = user.habitLogs;

      const totalHabits = assignments.length;
      const completedLogs = logs.filter((log) => log.completed).length;
      const totalLogs = logs.length;

      // Calculate streak
      const streak = this.calculateStreak(logs);

      // Calculate score (0-5 scale)
      const score =
        totalLogs > 0
          ? Math.min(5, Math.round((completedLogs / totalLogs) * 5 * 10) / 10)
          : 0;

      // Determine status
      const statusValue = this.getStatusFromScore(score);

      // Get primary habit
      const primaryHabit = assignments[0]?.habit;
      const habitCompletionPercentage = 90;

      // Get assigned by info
      const assignedByUser = assignments[0]?.assignedByUser;

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        profilePicture: user.profilePicture,
        habitName: primaryHabit?.title || 'No habit assigned',
        habitDescription: primaryHabit?.description || '',
        habits: totalHabits,
        habitCompletionPercentage,
        streak,
        totalHabits,
        score,
        status: statusValue,
        assignedBy: assignedByUser
          ? {
              id: assignedByUser.id,
              name: assignedByUser.name,
            }
          : null,
      };
    });

    // Apply status filter
    let filteredData = transformedData;
    if (status) {
      filteredData = transformedData.filter((item) => item.status === status);
    }

    return successPaginatedResponse(
      filteredData,
      { page, limit, total: status ? filteredData.length : total },
      'Assigned team members retrieved successfully',
    );
  }

  /**
   * Create score and habits for a team member
   */
  async createScoreAndHabits(managerId: string, dto: CreateScoreHabitsDto) {
    const { userId, habitScores, feedbackNotes, assessmentText } = dto;

    // Verify manager's branch and get tenant from branch
    const manager = await this.prisma.client.user.findUnique({
      where: { id: managerId },
      select: {
        branchId: true,
        name: true,
        branch: {
          select: {
            tenantId: true,
          },
        },
      },
    });

    if (!manager?.branchId) {
      throw new NotFoundException('Manager is not assigned to any branch');
    }

    const tenantId = manager.branch?.tenantId;
    if (!tenantId) {
      throw new BadRequestException('Branch tenant not found');
    }

    // Verify user belongs to same branch
    const user = await this.prisma.client.user.findFirst({
      where: {
        id: userId,
        branchId: manager.branchId,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found in your branch');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Calculate overall completion percentage
    const totalScore = habitScores.reduce((sum, h) => sum + h.score, 0);
    const maxScore = habitScores.length * 5;
    const completionPercentage = Math.round((totalScore / maxScore) * 100);

    // Process each habit score
    const results = await Promise.all(
      habitScores.map(async (habitScore) => {
        // Find or create habit
        let habit = await this.prisma.client.microHabit.findFirst({
          where: {
            title: habitScore.habitName,
            tenantId: tenantId,
          },
        });

        if (!habit) {
          // Create new habit
          habit = await this.prisma.client.microHabit.create({
            data: {
              title: habitScore.habitName,
              description: `Habit: ${habitScore.habitName}`,
              tenantId: tenantId,
              userId: managerId,
            },
          });
        }

        // Check if assignment exists
        let assignment = await this.prisma.client.habitAssignment.findFirst({
          where: {
            habitId: habit.id,
            userId: userId,
            branchId: manager.branchId,
          },
        });

        if (!assignment) {
          // Create habit assignment
          assignment = await this.prisma.client.habitAssignment.create({
            data: {
              habitId: habit.id,
              userId: userId,
              branchId: manager.branchId,
              assignedBy: managerId,
              startDate: new Date(),
              endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            },
          });
        }

        // Create or update habit log for today
        const habitLog = await this.prisma.client.habitLog.upsert({
          where: {
            habitId_userId_date: {
              habitId: habit.id,
              userId: userId,
              date: today,
            },
          },
          update: {
            completed: habitScore.score >= 3,
          },
          create: {
            habitId: habit.id,
            userId: userId,
            tenantId: tenantId,
            date: today,
            completed: habitScore.score >= 3,
          },
        });

        return {
          habitId: habit.id,
          habitName: habitScore.habitName,
          score: habitScore.score,
          completed: habitLog.completed,
          status: this.getHabitStatus(habitScore.score),
        };
      }),
    );

    // Create additional habit if provided
    let additionalHabitResult = null;
    if (dto.additionalHabitName) {
      const additionalHabit = await this.prisma.client.microHabit.create({
        data: {
          title: dto.additionalHabitName,
          description: dto.additionalHabitDescription || '',
          tenantId: tenantId,
          userId: managerId,
        },
      });

      await this.prisma.client.habitAssignment.create({
        data: {
          habitId: additionalHabit.id,
          userId: userId,
          branchId: manager.branchId,
          assignedBy: managerId,
          startDate: new Date(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      });

      additionalHabitResult = {
        habitId: additionalHabit.id,
        habitName: additionalHabit.title,
        habitDescription: additionalHabit.description,
      };
    }

    return successResponse(
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
        manager: {
          id: managerId,
          name: manager.name,
        },
        completionPercentage,
        habitScores: results,
        feedbackNotes,
        assessmentText,
        additionalHabit: additionalHabitResult,
        createdAt: new Date(),
      },
      'Score and habits created successfully',
    );
  }

  /**
   * Calculate streak from habit logs
   */
  private calculateStreak(logs: any[]): number {
    if (logs.length === 0) return 0;

    const sortedLogs = logs
      .filter((log) => log.completed)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (sortedLogs.length === 0) return 0;

    let streak = 1;

    for (let i = 0; i < sortedLogs.length - 1; i++) {
      const currentDate = new Date(sortedLogs[i].date);
      const nextDate = new Date(sortedLogs[i + 1].date);

      const diffTime = currentDate.getTime() - nextDate.getTime();
      const diffDays = diffTime / (1000 * 60 * 60 * 24);

      if (diffDays === 1) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  }

  /**
   * Get status based on score
   */
  private getStatusFromScore(score: number): string {
    if (score >= 4.5) return 'GREAT';
    if (score >= 3.5) return 'GOOD';
    if (score >= 2.5) return 'AVERAGE';
    return 'POOR';
  }

  /**
   * Get habit status from individual score
   */
  private getHabitStatus(score: number): string {
    if (score === 5) return 'EXCELLENT';
    if (score === 4) return 'GOOD';
    if (score === 3) return 'AVERAGE';
    if (score === 2) return 'NEEDS_IMPROVEMENT';
    return 'POOR';
  }

  /**
   *----------------- Get all users with their accessible huddles and sessions-----------------
   */

  @HandleError('Failed to retrieve users with huddles and sessions')
  async getUsersWithHuddlesAndSessions(
    managerId: string,
    dto: GetUsersWithHuddlesSessionsDto,
  ) {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      includeCompleted = true,
    } = dto;

    // Get manager's branch and tenant info
    const manager = await this.prisma.client.user.findUnique({
      where: { id: managerId },
      select: { branchId: true, tenantId: true, name: true },
    });

    if (!manager?.branchId) {
      throw new NotFoundException('Manager is not assigned to any branch');
    }

    // Build user where clause
    const userWhereClause: any = {
      branchId: manager.branchId,
      role: { in: ['USER', 'STAFF'] },
    };

    // Add status filter
    if (status) {
      userWhereClause.status = status;
    }

    // Add search filter
    if (search) {
      userWhereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ];
    }

    const skip = (page - 1) * limit;

    // Build huddle where clause
    const huddleWhereClause: any = {
      branchId: manager.branchId,
    };

    if (!includeCompleted) {
      huddleWhereClause.HuddleStatus = { in: ['scheduled'] };
    }

    // Build session where clause
    const sessionWhereClause: any = {
      branchId: manager.branchId,
    };

    if (!includeCompleted) {
      sessionWhereClause.sessionstatus = {
        in: ['PENDING', 'DARFT', 'SCHEDULE'],
      };
    }

    // Fetch users with their huddles and sessions
    const [users, total] = await Promise.all([
      this.prisma.client.user.findMany({
        where: userWhereClause,
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          profilePicture: true,
          role: true,
          status: true,
          isOnline: true,
          lastActiveAt: true,
          createdAt: true,

          // Huddles where user is creator
          createdHuddles: {
            where: huddleWhereClause,
            select: {
              id: true,
              topic: true,
              duration: true,
              meetLink: true,
              HuddleStatus: true,
              startTime: true,
              selectedDate: true,
              createdAt: true,
              creator: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
              membersParticipating: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  profilePicture: true,
                },
              },
              participantStatuses: {
                select: {
                  id: true,
                  status: true,
                  completedAt: true,
                  joinedAt: true,
                  user: {
                    select: {
                      id: true,
                      name: true,
                      email: true,
                    },
                  },
                },
              },
            },
            orderBy: {
              selectedDate: 'desc',
            },
          },

          // Huddles where user is participating
          participatingHuddles: {
            where: huddleWhereClause,
            select: {
              id: true,
              topic: true,
              duration: true,
              meetLink: true,
              HuddleStatus: true,
              startTime: true,
              selectedDate: true,
              createdAt: true,
              creator: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
              membersParticipating: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  profilePicture: true,
                },
              },
            },
            orderBy: {
              selectedDate: 'desc',
            },
          },

          // Sessions where user is speaker
          speakerSessions: {
            where: sessionWhereClause,
            select: {
              id: true,
              SessionTitle: true,
              agenda: true,
              scheduledAt: true,
              duration: true,
              meetingLink: true,
              SessionType: true,
              sessionstatus: true,
              sessioncompliance: true,
              createdAt: true,
              speaker: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
              sessionMemberParticipants: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  profilePicture: true,
                },
              },
              program: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
            orderBy: {
              scheduledAt: 'desc',
            },
          },

          // Sessions where user is participant
          sessionMemberParticipants: {
            where: sessionWhereClause,
            select: {
              id: true,
              SessionTitle: true,
              agenda: true,
              scheduledAt: true,
              duration: true,
              meetingLink: true,
              SessionType: true,
              sessionstatus: true,
              sessioncompliance: true,
              createdAt: true,
              speaker: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
              sessionMemberParticipants: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  profilePicture: true,
                },
              },
            },
            orderBy: {
              scheduledAt: 'desc',
            },
          },

          // Huddle participant statuses
          huddleParticipantStatuses: {
            where: {
              huddle: huddleWhereClause,
            },
            select: {
              id: true,
              status: true,
              completedAt: true,
              joinedAt: true,
              notes: true,
              huddle: {
                select: {
                  id: true,
                  topic: true,
                  selectedDate: true,
                  startTime: true,
                },
              },
            },
            orderBy: {
              createdAt: 'desc',
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.client.user.count({ where: userWhereClause }),
    ]);

    // Transform and analyze data
    const transformedData = users.map((user: any) => {
      const allHuddles = [
        ...(user.createdHuddles || []),
        ...(user.participatingHuddles || []),
      ];
      const uniqueHuddles = Array.from(
        new Map(allHuddles.map((h) => [h.id, h])).values(),
      );

      // Merge all unique sessions
      const allSessions = [
        ...(user.speakerSessions || []),
        ...(user.sessionMemberParticipants || []),
      ];
      const uniqueSessions = Array.from(
        new Map(allSessions.map((s) => [s.id, s])).values(),
      );

      // Calculate huddle statistics
      const huddleStats = {
        total: uniqueHuddles.length,
        scheduled: uniqueHuddles.filter((h) => h.HuddleStatus === 'scheduled')
          .length,
        completed: uniqueHuddles.filter((h) => h.HuddleStatus === 'completed')
          .length,
        cancelled: uniqueHuddles.filter((h) => h.HuddleStatus === 'cancelled')
          .length,
        asCreator: (user.createdHuddles || []).length,
        asParticipant: (user.participatingHuddles || []).length,
      };

      // Calculate session statistics
      const sessionStats = {
        total: uniqueSessions.length,
        pending: uniqueSessions.filter((s) => s.sessionstatus === 'PENDING')
          .length,
        scheduled: uniqueSessions.filter((s) => s.sessionstatus === 'SCHEDULE')
          .length,
        completed: uniqueSessions.filter((s) => s.sessionstatus === 'COMPLETED')
          .length,
        cancelled: uniqueSessions.filter((s) => s.sessionstatus === 'CANCELED')
          .length,
        asSpeaker: (user.speakerSessions || []).length,
        asParticipant: (user.sessionMemberParticipants || []).length,
      };

      // Calculate participation rate
      const totalEvents = huddleStats.total + sessionStats.total;
      const completedEvents = huddleStats.completed + sessionStats.completed;
      const participationRate =
        totalEvents > 0 ? Math.round((completedEvents / totalEvents) * 100) : 0;

      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          profilePicture: user.profilePicture,
          role: user.role,
          status: user.status,
          isOnline: user.isOnline,
          lastActiveAt: user.lastActiveAt,
          createdAt: user.createdAt,
        },
        analytics: {
          huddles: huddleStats,
          sessions: sessionStats,
          totalEvents,
          completedEvents,
          participationRate,
        },
        huddles: uniqueHuddles.map((huddle) => ({
          ...huddle,
          userRole: huddle.creator.id === user.id ? 'creator' : 'participant',
        })),
        sessions: uniqueSessions.map((session) => ({
          ...session,
          userRole: session.speaker?.id === user.id ? 'speaker' : 'participant',
        })),
        huddleParticipantStatuses: user.huddleParticipantStatuses || [],
      };
    });

    return successPaginatedResponse(
      transformedData,
      { page, limit, total },
      'Users with huddles and sessions retrieved successfully',
    );
  }
}
