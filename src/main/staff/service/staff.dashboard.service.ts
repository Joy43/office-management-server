// Staff Dashboard Service - Provides comprehensive dashboard data for staff members
import { PrismaService } from '@/lib/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import {
  AnalyticsPeriod,
  HabitAnalysisFilterDto,
} from '../dto/habit-analysis-filter.dto';

@Injectable()
export class StaffDashboardService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get complete staff dashboard data including habit stats and today's progress
   */
  async getStaffDashboardData(staffId: string) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfDay = new Date(today);
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    // Get all habits assigned to this staff member
    const habitAssignments = await this.prisma.client.habitAssignment.findMany({
      where: {
        userId: staffId,
        startDate: { lte: now },
        endDate: { gte: now },
      },
      include: {
        habit: true,
      },
    });

    const habitIds = habitAssignments.map((assignment) => assignment.habitId);

    // Total habits assigned to staff
    const totalHabits = habitIds.length;

    // Habit completed today
    const habitCompletedToday = await this.prisma.client.habitLog.count({
      where: {
        userId: staffId,
        habitId: { in: habitIds },
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
        completed: true,
      },
    });

    // Calculate best streak
    const bestStreak = await this.calculateBestStreak(staffId, habitIds);

    // Calculate today's progress percentage
    const todaysProgress =
      totalHabits > 0
        ? Math.round((habitCompletedToday / totalHabits) * 100)
        : 0;

    // Get habits remaining for today
    const completedHabitIdsToday = await this.prisma.client.habitLog.findMany({
      where: {
        userId: staffId,
        habitId: { in: habitIds },
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
        completed: true,
      },
      select: { habitId: true },
    });

    const completedHabitIds = completedHabitIdsToday.map((log) => log.habitId);
    const habitsRemaining = totalHabits - completedHabitIds.length;

    return {
      success: true,
      data: {
        stats: {
          habitCompleted: habitCompletedToday,
          totalHabits: totalHabits,
          bestStreak: bestStreak,
        },
        todaysProgress: {
          percentage: todaysProgress,
          habitsRemaining: habitsRemaining,
          completedCount: habitCompletedToday,
          totalCount: totalHabits,
        },
      },
    };
  }

  /**
   * Calculate the best streak for a staff member
   * Best streak is the longest consecutive days of completing at least one habit
   */
  private async calculateBestStreak(
    staffId: string,
    habitIds: string[],
  ): Promise<number> {
    if (habitIds.length === 0) return 0;

    // Get all habit logs for the staff member, ordered by date
    const habitLogs = await this.prisma.client.habitLog.findMany({
      where: {
        userId: staffId,
        habitId: { in: habitIds },
        completed: true,
      },
      orderBy: { date: 'asc' },
      select: { date: true },
    });

    if (habitLogs.length === 0) return 0;

    let maxStreak = 1;
    let currentStreak = 1;

    for (let i = 1; i < habitLogs.length; i++) {
      const prevDate = new Date(habitLogs[i - 1].date);
      const currDate = new Date(habitLogs[i].date);

      // Calculate difference in days
      const diffTime = currDate.getTime() - prevDate.getTime();
      const diffDays = diffTime / (1000 * 60 * 60 * 24);

      if (diffDays === 1) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else if (diffDays > 1) {
        currentStreak = 1;
      }
    }

    return maxStreak;
  }

  /**
   * Get habit analysis graph data with filtering by period
   * Supports Weekly, Monthly, and Yearly analytics
   */
  async getHabitAnalysisGraphData(
    staffId: string,
    filterDto: HabitAnalysisFilterDto,
  ) {
    const period = filterDto.period || AnalyticsPeriod.WEEKLY;

    switch (period) {
      case AnalyticsPeriod.WEEKLY:
        return this.getWeeklyAnalytics(staffId);
      case AnalyticsPeriod.MONTHLY:
        return this.getMonthlyAnalytics(staffId);
      case AnalyticsPeriod.YEARLY:
        return this.getYearlyAnalytics(staffId);
      default:
        return this.getWeeklyAnalytics(staffId);
    }
  }

  /**
   * Get weekly habit analysis data (Mon - Sun)
   */
  private async getWeeklyAnalytics(staffId: string) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Calculate start of the week (Monday)
    const dayOfWeek = today.getDay();
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() + diffToMonday);
    startOfWeek.setHours(0, 0, 0, 0);

    // Get active habit assignments
    const habitAssignments = await this.prisma.client.habitAssignment.findMany({
      where: {
        userId: staffId,
        startDate: { lte: now },
        endDate: { gte: startOfWeek },
      },
      select: { habitId: true },
    });

    const habitIds = habitAssignments.map((assignment) => assignment.habitId);

    // Get habit logs for the week
    const weeklyData = [];
    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

    for (let i = 0; i < 7; i++) {
      const currentDay = new Date(startOfWeek);
      currentDay.setDate(startOfWeek.getDate() + i);
      const endOfDay = new Date(currentDay);
      endOfDay.setHours(23, 59, 59, 999);

      const completedCount = await this.prisma.client.habitLog.count({
        where: {
          userId: staffId,
          habitId: { in: habitIds },
          date: {
            gte: currentDay,
            lte: endOfDay,
          },
          completed: true,
        },
      });

      weeklyData.push({
        label: daysOfWeek[i],
        date: currentDay.toISOString().split('T')[0],
        completedHabits: completedCount,
      });
    }

    // Calculate percentage change from previous week
    const previousWeekStart = new Date(startOfWeek);
    previousWeekStart.setDate(startOfWeek.getDate() - 7);
    const previousWeekEnd = new Date(startOfWeek);
    previousWeekEnd.setDate(startOfWeek.getDate() - 1);

    const currentWeekTotal = weeklyData.reduce(
      (sum, day) => sum + day.completedHabits,
      0,
    );
    const previousWeekTotal = await this.prisma.client.habitLog.count({
      where: {
        userId: staffId,
        habitId: { in: habitIds },
        date: {
          gte: previousWeekStart,
          lte: previousWeekEnd,
        },
        completed: true,
      },
    });

    const percentageChange =
      previousWeekTotal > 0
        ? Math.round(
            ((currentWeekTotal - previousWeekTotal) / previousWeekTotal) * 100,
          )
        : currentWeekTotal > 0
          ? 100
          : 0;

    return {
      success: true,
      data: {
        period: AnalyticsPeriod.WEEKLY,
        dateRange: {
          start: startOfWeek.toISOString().split('T')[0],
          end: new Date(startOfWeek.getTime() + 6 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split('T')[0],
        },
        percentageChange: percentageChange,
        chartData: weeklyData,
        summary: {
          totalCompleted: currentWeekTotal,
          averagePerPeriod: Math.round((currentWeekTotal / 7) * 10) / 10,
        },
      },
    };
  }

  /**
   * Get monthly habit analysis data (last 30 days)
   */
  private async getMonthlyAnalytics(staffId: string) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Start from 30 days ago
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 29);
    startDate.setHours(0, 0, 0, 0);

    // Get active habit assignments
    const habitAssignments = await this.prisma.client.habitAssignment.findMany({
      where: {
        userId: staffId,
        startDate: { lte: now },
        endDate: { gte: startDate },
      },
      select: { habitId: true },
    });

    const habitIds = habitAssignments.map((assignment) => assignment.habitId);

    // Group by weeks (4-5 weeks in a month)
    const monthlyData = [];
    const weeksInMonth = 4;

    for (let i = 0; i < weeksInMonth; i++) {
      const weekStart = new Date(startDate);
      weekStart.setDate(startDate.getDate() + i * 7);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);

      // Don't go beyond today
      const effectiveEnd = weekEnd > today ? today : weekEnd;

      const completedCount = await this.prisma.client.habitLog.count({
        where: {
          userId: staffId,
          habitId: { in: habitIds },
          date: {
            gte: weekStart,
            lte: effectiveEnd,
          },
          completed: true,
        },
      });

      monthlyData.push({
        label: `Week ${i + 1}`,
        dateRange: `${weekStart.toISOString().split('T')[0]} - ${effectiveEnd.toISOString().split('T')[0]}`,
        completedHabits: completedCount,
      });
    }

    // Calculate percentage change from previous month (30 days before)
    const previousMonthStart = new Date(startDate);
    previousMonthStart.setDate(startDate.getDate() - 30);
    const previousMonthEnd = new Date(startDate);
    previousMonthEnd.setDate(startDate.getDate() - 1);

    const currentMonthTotal = monthlyData.reduce(
      (sum, week) => sum + week.completedHabits,
      0,
    );
    const previousMonthTotal = await this.prisma.client.habitLog.count({
      where: {
        userId: staffId,
        habitId: { in: habitIds },
        date: {
          gte: previousMonthStart,
          lte: previousMonthEnd,
        },
        completed: true,
      },
    });

    const percentageChange =
      previousMonthTotal > 0
        ? Math.round(
            ((currentMonthTotal - previousMonthTotal) / previousMonthTotal) *
              100,
          )
        : currentMonthTotal > 0
          ? 100
          : 0;

    return {
      success: true,
      data: {
        period: AnalyticsPeriod.MONTHLY,
        dateRange: {
          start: startDate.toISOString().split('T')[0],
          end: today.toISOString().split('T')[0],
        },
        percentageChange: percentageChange,
        chartData: monthlyData,
        summary: {
          totalCompleted: currentMonthTotal,
          averagePerPeriod: Math.round((currentMonthTotal / 30) * 10) / 10,
        },
      },
    };
  }

  /**
   * Get yearly habit analysis data (last 12 months)
   */
  private async getYearlyAnalytics(staffId: string) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // Start from 12 months ago
    const startDate = new Date(today);
    startDate.setMonth(today.getMonth() - 11);
    startDate.setDate(1);
    startDate.setHours(0, 0, 0, 0);

    // Get active habit assignments
    const habitAssignments = await this.prisma.client.habitAssignment.findMany({
      where: {
        userId: staffId,
        startDate: { lte: now },
        endDate: { gte: startDate },
      },
      select: { habitId: true },
    });

    const habitIds = habitAssignments.map((assignment) => assignment.habitId);

    // Get data for each month
    const yearlyData = [];
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    for (let i = 0; i < 12; i++) {
      const monthStart = new Date(startDate);
      monthStart.setMonth(startDate.getMonth() + i);
      const monthEnd = new Date(monthStart);
      monthEnd.setMonth(monthStart.getMonth() + 1);
      monthEnd.setDate(0);
      monthEnd.setHours(23, 59, 59, 999);

      // Don't go beyond today
      const effectiveEnd = monthEnd > today ? today : monthEnd;

      const completedCount = await this.prisma.client.habitLog.count({
        where: {
          userId: staffId,
          habitId: { in: habitIds },
          date: {
            gte: monthStart,
            lte: effectiveEnd,
          },
          completed: true,
        },
      });

      yearlyData.push({
        label: monthNames[monthStart.getMonth()],
        month: `${monthStart.getFullYear()}-${String(monthStart.getMonth() + 1).padStart(2, '0')}`,
        completedHabits: completedCount,
      });
    }

    // Calculate percentage change from previous year
    const previousYearStart = new Date(startDate);
    previousYearStart.setFullYear(startDate.getFullYear() - 1);
    const previousYearEnd = new Date(startDate);
    previousYearEnd.setDate(startDate.getDate() - 1);

    const currentYearTotal = yearlyData.reduce(
      (sum, month) => sum + month.completedHabits,
      0,
    );
    const previousYearTotal = await this.prisma.client.habitLog.count({
      where: {
        userId: staffId,
        habitId: { in: habitIds },
        date: {
          gte: previousYearStart,
          lte: previousYearEnd,
        },
        completed: true,
      },
    });

    const percentageChange =
      previousYearTotal > 0
        ? Math.round(
            ((currentYearTotal - previousYearTotal) / previousYearTotal) * 100,
          )
        : currentYearTotal > 0
          ? 100
          : 0;

    return {
      success: true,
      data: {
        period: AnalyticsPeriod.YEARLY,
        dateRange: {
          start: startDate.toISOString().split('T')[0],
          end: today.toISOString().split('T')[0],
        },
        percentageChange: percentageChange,
        chartData: yearlyData,
        summary: {
          totalCompleted: currentYearTotal,
          averagePerPeriod: Math.round((currentYearTotal / 12) * 10) / 10,
        },
      },
    };
  }

  /**
   * Get today's huddles assigned to the staff member
   * Returns huddles scheduled for today with participant details
   */
  async getTodayHuddleData(staffId: string) {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0]; // YYYY-MM-DD format

    // Get all huddles where this staff member is a participant for today
    const todayHuddles = await this.prisma.client.huddle.findMany({
      where: {
        selectedDate: todayStr,
        membersParticipating: {
          some: {
            id: staffId,
          },
        },
      },
      include: {
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
            profilePicture: true,
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
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                profilePicture: true,
              },
            },
          },
        },
        branch: {
          select: {
            id: true,
            branchName: true,
          },
        },
      },
      orderBy: {
        startTime: 'asc',
      },
    });

    // Format the huddles for response
    const formattedHuddles = todayHuddles.map((huddle) => {
      const totalParticipants = huddle.participantStatuses.length;
      const completedParticipants = huddle.participantStatuses.filter(
        (p) => p.status === 'completed',
      ).length;
      const joinedParticipants = huddle.participantStatuses.filter(
        (p) => p.status === 'joined',
      ).length;

      // Get the current staff's participation status
      const myStatus = huddle.participantStatuses.find(
        (p) => p.userId === staffId,
      );

      return {
        id: huddle.id,
        name: huddle.topic,
        meetingId: `Meeting ID: ${huddle.id.substring(0, 8).toUpperCase()}`,
        duration: `${huddle.duration}min`,
        dateTime: {
          date: huddle.selectedDate,
          time: huddle.startTime,
          displayDate: new Date(
            `${huddle.selectedDate}T${huddle.startTime}`,
          ).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
          displayTime: huddle.startTime,
        },
        status: huddle.HuddleStatus,
        myParticipationStatus: myStatus?.status || 'pending',
        meetLink: huddle.meetLink,
        participants: {
          total: totalParticipants,
          completed: completedParticipants,
          joined: joinedParticipants,
          list: huddle.participantStatuses.map((p) => ({
            userId: p.user.id,
            name: p.user.name,
            email: p.user.email,
            profilePicture: p.user.profilePicture,
            status: p.status,
            joinedAt: p.joinedAt,
            completedAt: p.completedAt,
          })),
        },
        creator: {
          id: huddle.creator.id,
          name: huddle.creator.name,
          email: huddle.creator.email,
          profilePicture: huddle.creator.profilePicture,
        },
        branch: huddle.branch
          ? {
              id: huddle.branch.id,
              name: huddle.branch.branchName,
            }
          : null,
        createdAt: huddle.createdAt,
        updatedAt: huddle.updatedAt,
      };
    });

    return {
      success: true,
      data: {
        date: todayStr,
        totalHuddles: formattedHuddles.length,
        huddles: formattedHuddles,
      },
    };
  }
}
