import { successResponse } from '@/common/response/response.util';
import { HandleError } from '@/core/error/handle-error.decorator';
import { PrismaService } from '@/lib/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TainerAdminDashboardService {
  constructor(private readonly prisma: PrismaService) {}

  // ------------------ Performance Overview -----------------------
  @HandleError('Failed to get performance overview')
  async getTainerDashboardOverview(tenantId: string) {
    const startOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1,
    );

    /* ---------------- SESSIONS THIS MONTH ---------------- */
    const sessionsThisMonth = await this.prisma.client.session.count({
      where: {
        user: { tenantId },
        createdAt: { gte: startOfMonth },
      },
    });

    /* ---------------- HABIT COMPLETION RATE ---------------- */
    const totalHabits = await this.prisma.client.habitLog.count({
      where: { tenantId },
    });

    const completedHabits = await this.prisma.client.habitLog.count({
      where: {
        tenantId,
      },
    });

    const habitCompletionRate =
      totalHabits === 0 ? 0 : Math.round((completedHabits / totalHabits) * 100);

    /* ---------------- ROLE-PLAYS SCORED ---------------- */
    const roleplaysScored = await this.prisma.client.session.count({
      where: {
        user: { tenantId },
        sessioncompliance: 'VERIFIED',
      },
    });

    /* ---------------- AVG SCORE ---------------- */
    const avgScore = 0;

    /* ---------------- RESPONSE ---------------- */
    return successResponse(
      {
        cards: {
          sessionsThisMonth: {
            label: 'Sessions This Month',
            value: sessionsThisMonth,
          },
          habitCompletionRate: {
            label: 'Habit Completion Rate',
            value: habitCompletionRate,
            unit: '%',
          },
          roleplaysScored: {
            label: 'Roleplays Scored',
            value: roleplaysScored,
          },
          avgScore: {
            label: 'Avg Score',
            value: avgScore,
            unit: '/5',
          },
        },
      },
      'Performance overview retrieved successfully',
    );
  }
}
