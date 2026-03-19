import { PrismaService } from '@/lib/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { MyHabitsFilterDto } from '../dto/my-habits-filter.dto';

@Injectable()
export class StaffHabitsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get all habits assigned to the staff member, grouped by coaches
   */
  async getMyHabits(staffId: string, filterDto: MyHabitsFilterDto) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfDay = new Date(today);
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    // Build where clause for habit assignments
    const whereClause: any = {
      userId: staffId,
      startDate: { lte: now },
      endDate: { gte: now },
    };

    // Filter by coach/assigner
    if (filterDto.coachId) {
      whereClause.assignedBy = filterDto.coachId;
    }

    // Get all active habit assignments for the staff
    const habitAssignments = await this.prisma.client.habitAssignment.findMany({
      where: whereClause,
      include: {
        habit: {
          include: {
            habitAdding: true,
          },
        },
        assignedByUser: {
          select: {
            id: true,
            name: true,
            email: true,
            profilePicture: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Get today's completion status for all habits
    const habitIds = habitAssignments.map((assignment) => assignment.habitId);

    const todayLogs = await this.prisma.client.habitLog.findMany({
      where: {
        userId: staffId,
        habitId: { in: habitIds },
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      select: {
        habitId: true,
        completed: true,
        proofUrl: true,
      },
    });

    // Create a map for quick lookup
    const completionMap = new Map();
    todayLogs.forEach((log) => {
      completionMap.set(log.habitId, {
        completed: log.completed,
        proofUrl: log.proofUrl,
      });
    });

    // Group habits by coach
    const coachesMap = new Map();

    habitAssignments.forEach((assignment) => {
      const coach = assignment.assignedByUser;
      const habit = assignment.habit;
      const completionStatus = completionMap.get(habit.id);

      // Apply search filter
      if (
        filterDto.search &&
        !habit.title.toLowerCase().includes(filterDto.search.toLowerCase())
      ) {
        return;
      }

      // Apply status filter
      if (filterDto.status === 'completed' && !completionStatus?.completed) {
        return;
      }
      if (filterDto.status === 'pending' && completionStatus?.completed) {
        return;
      }

      const habitData = {
        id: habit.id,
        title: habit.title,
        description: habit.description,
        points: habit.points,
        frequency: 'Daily', // Default frequency
        isCompletedToday: completionStatus?.completed || false,
        proofUrl: completionStatus?.proofUrl || null,
        assignmentDetails: {
          assignmentId: assignment.id,
          startDate: assignment.startDate,
          endDate: assignment.endDate,
          assignedAt: assignment.createdAt,
        },
      };

      if (!coachesMap.has(coach.id)) {
        coachesMap.set(coach.id, {
          coach: {
            id: coach.id,
            name: coach.name,
            email: coach.email,
            profilePicture: coach.profilePicture,
            role: coach.role,
          },
          habits: [],
          totalHabits: 0,
          completedHabits: 0,
          completionPercentage: 0,
        });
      }

      const coachData = coachesMap.get(coach.id);
      coachData.habits.push(habitData);
      coachData.totalHabits++;
      if (habitData.isCompletedToday) {
        coachData.completedHabits++;
      }
    });

    // Calculate completion percentages and format response
    const assignedByCoaches = Array.from(coachesMap.values()).map(
      (coachData) => {
        const percentage =
          coachData.totalHabits > 0
            ? Math.round(
                (coachData.completedHabits / coachData.totalHabits) * 100,
              )
            : 0;

        return {
          ...coachData,
          completionPercentage: percentage,
          completionStatus: `${coachData.completedHabits} of ${coachData.totalHabits} habits completed`,
        };
      },
    );

    // Calculate overall statistics
    const totalHabits = habitAssignments.length;
    const completedHabits = Array.from(completionMap.values()).filter(
      (log) => log.completed,
    ).length;
    const overallPercentage =
      totalHabits > 0 ? Math.round((completedHabits / totalHabits) * 100) : 0;

    return {
      success: true,
      data: {
        summary: {
          totalCoaches: assignedByCoaches.length,
          totalHabits: totalHabits,
          completedToday: completedHabits,
          pendingToday: totalHabits - completedHabits,
          overallCompletionPercentage: overallPercentage,
        },
        assignedByCoaches: assignedByCoaches,
      },
    };
  }

  /**
   * Get habits assigned by a specific coach
   */
  async getHabitsByCoach(staffId: string, coachId: string) {
    const filterDto = new MyHabitsFilterDto();
    filterDto.coachId = coachId;
    return this.getMyHabits(staffId, filterDto);
  }

  /**
   * Mark a habit as completed for today
   */
  async markHabitCompleted(
    staffId: string,
    habitId: string,
    proofUrl?: string,
  ) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Check if habit is assigned to this staff
    const assignment = await this.prisma.client.habitAssignment.findFirst({
      where: {
        userId: staffId,
        habitId: habitId,
        startDate: { lte: now },
        endDate: { gte: now },
      },
    });

    if (!assignment) {
      return {
        success: false,
        message: 'Habit not assigned to you or assignment has expired',
      };
    }

    // Create or update habit log for today
    const habitLog = await this.prisma.client.habitLog.upsert({
      where: {
        habitId_userId_date: {
          habitId: habitId,
          userId: staffId,
          date: today,
        },
      },
      update: {
        completed: true,
        proofUrl: proofUrl || '',
        updatedAt: now,
      },
      create: {
        habitId: habitId,
        userId: staffId,
        tenantId: assignment.branchId || '', // Use branchId as tenantId if available
        date: today,
        completed: true,
        proofUrl: proofUrl || '',
      },
      include: {
        habit: {
          select: {
            title: true,
            points: true,
          },
        },
      },
    });

    return {
      success: true,
      message: 'Habit marked as completed',
      data: {
        habitLog: {
          id: habitLog.id,
          habitTitle: habitLog.habit.title,
          points: habitLog.habit.points,
          completedAt: habitLog.updatedAt,
          proofUrl: habitLog.proofUrl,
        },
      },
    };
  }

  /**
   * Unmark a habit (mark as incomplete)
   */
  async unmarkHabitCompleted(staffId: string, habitId: string) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const habitLog = await this.prisma.client.habitLog.findUnique({
      where: {
        habitId_userId_date: {
          habitId: habitId,
          userId: staffId,
          date: today,
        },
      },
    });

    if (!habitLog) {
      return {
        success: false,
        message: 'Habit log not found for today',
      };
    }

    await this.prisma.client.habitLog.update({
      where: {
        id: habitLog.id,
      },
      data: {
        completed: false,
        proofUrl: '',
      },
    });

    return {
      success: true,
      message: 'Habit marked as incomplete',
    };
  }
}
