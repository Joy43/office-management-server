import { successResponse } from '@/common/response/response.util';
import { HandleError } from '@/core/error/handle-error.decorator';
import { PrismaService } from '@/lib/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MANAGERDashboardService {
  constructor(private readonly prisma: PrismaService) {}
  // // --------------getDashboardOrganizationOverview--------------
  // @HandleError('Failed to get manager dashboard overview')
  // async getDashboardOrganizationOverview() {
  //   const tenantId = 'tenant123';

  //   /* ---------------- EMPLOYEES ---------------- */
  //   const totalEmployees = await this.prisma.client.user.count({
  //     where: { tenantId },
  //   });

  //   const totalManagers = await this.prisma.client.user.count({
  //     where: {
  //       tenantId,
  //       role: { in: ['MANAGER', 'ADMIN'] },
  //     },
  //   });

  //   /* ---------------- BRANCHES ---------------- */
  //   const totalBranches = await this.prisma.client.branch.count({
  //     where: { tenantId },
  //   });

  //   /* ---------------- HUDDLES ---------------- */
  //   const totalHuddlesCompleted = await this.prisma.client.huddle.count({
  //     where: {
  //       creator: {
  //         tenantId,
  //       },
  //       HuddleStatus: 'completed',
  //     },
  //   });

  //   /* ---------------- SESSIONS ---------------- */
  //   const totalSessions = await this.prisma.client.session.count({
  //     where: {
  //       user: {
  //         tenantId,
  //       },
  //     },
  //   });

  //   const completedSessions = await this.prisma.client.session.count({
  //     where: {
  //       user: {
  //         tenantId,
  //       },
  //       sessionstatus: 'COMPLETED',
  //     },
  //   });

  //   /* ---------------- TEAM ADHERENCE (%) ---------------- */
  //   const teamAdherence =
  //     totalSessions === 0
  //       ? 0
  //       : Math.round((completedSessions / totalSessions) * 100);

  //   /* ---------------- ROLEPLAYS SCORED (using verified sessions) ---------------- */
  //   const roleplaysScored = await this.prisma.client.session.count({
  //     where: {
  //       user: {
  //         tenantId,
  //       },
  //       sessioncompliance: 'VERIFIED',
  //     },
  //   });

  //   /* ---------------- CSAT CHANGE ---------------- */
  //   const now = new Date();
  //   const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));

  //   // Current CSAT (last 30 days)
  //   const currentCSATMetrics = await this.prisma.client.metric.findMany({
  //     where: {
  //       tenantId,
  //       MatricType: 'CSAT',
  //       date: {
  //         gte: thirtyDaysAgo,
  //       },
  //     },
  //     select: { value: true },
  //   });

  //   // Previous CSAT (30-60 days ago)
  //   const sixtyDaysAgo = new Date(
  //     new Date().setDate(new Date().getDate() - 60),
  //   );
  //   const lastPeriodCSATMetrics = await this.prisma.client.metric.findMany({
  //     where: {
  //       tenantId,
  //       MatricType: 'CSAT',
  //       date: {
  //         gte: sixtyDaysAgo,
  //         lt: thirtyDaysAgo,
  //       },
  //     },
  //     select: { value: true },
  //   });

  //   // Calculate averages manually since value is stored as string
  //   const currentCSATValue =
  //     currentCSATMetrics.length > 0
  //       ? currentCSATMetrics.reduce(
  //           (sum, metric) => sum + parseFloat(metric.value || '0'),
  //           0,
  //         ) / currentCSATMetrics.length
  //       : 0;

  //   const lastPeriodCSATValue =
  //     lastPeriodCSATMetrics.length > 0
  //       ? lastPeriodCSATMetrics.reduce(
  //           (sum, metric) => sum + parseFloat(metric.value || '0'),
  //           0,
  //         ) / lastPeriodCSATMetrics.length
  //       : 0;

  //   const csatChange = Number(
  //     (currentCSATValue - lastPeriodCSATValue).toFixed(1),
  //   );

  //   return successResponse(
  //     {
  //       teamAdherence: `${teamAdherence}%`,
  //       huddlesCompleted: totalHuddlesCompleted,
  //       roleplaysScored,
  //       csatChange,
  //       meta: {
  //         totalEmployees,
  //         totalManagers,
  //         totalBranches,
  //         totalSessions,
  //         completedSessions,
  //       },
  //     },
  //     'Manager dashboard overview retrieved successfully',
  //   );
  // }

  // ------------------Recent Sessions------------------
  @HandleError('Failed to get recent sessions')
  async getRecentSessions() {
    const sessions = await this.prisma.client.session.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
    });

    return successResponse(sessions, 'Recent sessions retrieved successfully');
  }

  //   ------------------ GetcreateHuddleAlert-----------------------

  @HandleError('Failed to get Huddle alerts')
  async GetcreateHuddleAlert() {
    const huddles = await this.prisma.client.huddle.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
      select: {
        id: true,
        createdAt: true,
        _count: {
          select: {
            membersParticipating: true,
          },
        },
      },
    });

    const alerts = huddles.map((huddle) => ({
      huddleId: huddle.id,
      message: `${huddle._count.membersParticipating} staff${
        huddle._count.membersParticipating !== 1 ? 's' : ''
      } joined this huddle today`,
      date: huddle.createdAt,
    }));

    return successResponse(alerts, 'Huddle alerts retrieved successfully');
  }

  //   ------------------ Coaching Logs Overview-----------------------

  @HandleError('Failed to get coaching logs overview')
  async getCoachingLogsOverview() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    console.log('startofLastMonth', startOfLastMonth);
    /* ---------------- TOTAL SESSIONS ---------------- */
    const totalSessions = await this.prisma.client.session.count();

    /* ---------------- SESSIONS THIS MONTH ---------------- */
    const sessionsThisMonth = await this.prisma.client.session.count({
      where: {
        createdAt: { gte: startOfMonth },
      },
    });

    /* ---------------- ACTIVE CLIENTS ---------------- */
    const activeClients = await this.prisma.client.session.findMany({
      where: {
        isActive: true,
        userId: { not: null },
      },
      distinct: ['userId'],
      select: { userId: true },
    });

    /* ---------------- COMPLIANCE RATE ---------------- */
    const completedSessions = await this.prisma.client.session.count({
      where: {
        sessionstatus: 'COMPLETED',
      },
    });

    const verifiedSessions = await this.prisma.client.session.count({
      where: {
        sessionstatus: 'COMPLETED',
        sessioncompliance: 'VERIFIED',
      },
    });

    const complianceRate =
      completedSessions === 0
        ? 0
        : Number(((verifiedSessions / completedSessions) * 100).toFixed(1));

    /* ---------------- AVG SESSION TIME ---------------- */
    const sessions = await this.prisma.client.session.findMany({
      select: {
        duration: true,
      },
    });

    // Calculate average duration manually since duration is stored as string
    const totalDuration = sessions.reduce((sum, session) => {
      const durationNum = parseInt(session.duration) || 0;
      return sum + durationNum;
    }, 0);

    const avgSessionTime =
      sessions.length > 0 ? Math.round(totalDuration / sessions.length) : 0;

    return successResponse(
      {
        totalSessions,
        sessionsThisMonth,
        activeClients: activeClients.length,
        complianceRate,
        avgSessionTime,
      },
      'Coaching logs overview retrieved successfully',
    );
  }

  // ------------------ Organization Overview -----------------------
  @HandleError('Failed to get organization overview')
  async getOrganizationOverview(tenantId: string) {
    /* ---------------- EMPLOYEES ---------------- */
    const totalEmployees = await this.prisma.client.user.count({
      where: { tenantId },
    });

    const totalManagers = await this.prisma.client.user.count({
      where: {
        tenantId,
        role: { in: ['MANAGER', 'ADMIN'] },
      },
    });

    /* ---------------- BRANCHES ---------------- */
    const totalBranches = await this.prisma.client.branch.count({
      where: { tenantId },
    });

    /* ---------------- HUDDLES ---------------- */
    const huddlesCompleted = await this.prisma.client.huddle.count({
      where: {
        creator: { tenantId },
        HuddleStatus: 'completed',
      },
    });

    /* ---------------- SESSIONS ---------------- */
    const totalSessions = await this.prisma.client.session.count({
      where: { user: { tenantId } },
    });

    const completedSessions = await this.prisma.client.session.count({
      where: {
        user: { tenantId },
        sessionstatus: 'COMPLETED',
      },
    });

    /* ---------------- TEAM ADHERENCE (%) ---------------- */
    const teamAdherence =
      totalSessions === 0
        ? 0
        : Math.round((completedSessions / totalSessions) * 100);

    /* ---------------- ROLEPLAYS SCORED ---------------- */
    const roleplaysScored = await this.prisma.client.session.count({
      where: {
        user: { tenantId },
        sessioncompliance: 'VERIFIED',
      },
    });

    /* ---------------- CSAT CHANGE ---------------- */
    const now = new Date();
    const thirtyDaysAgo = new Date(new Date().setDate(now.getDate() - 30));
    const sixtyDaysAgo = new Date(new Date().setDate(now.getDate() - 60));

    const currentCSATMetrics = await this.prisma.client.metric.findMany({
      where: {
        tenantId,
        MatricType: 'CSAT',
        date: { gte: thirtyDaysAgo },
      },
      select: { value: true },
    });

    const lastCSATMetrics = await this.prisma.client.metric.findMany({
      where: {
        tenantId,
        MatricType: 'CSAT',
        date: {
          gte: sixtyDaysAgo,
          lt: thirtyDaysAgo,
        },
      },
      select: { value: true },
    });

    const avg = (metrics: { value: string | null }[]) =>
      metrics.length === 0
        ? 0
        : metrics.reduce((sum, m) => sum + Number(m.value || 0), 0) /
          metrics.length;

    const currentCSAT = avg(currentCSATMetrics);
    const previousCSAT = avg(lastCSATMetrics);

    const csatChange = Number((currentCSAT - previousCSAT).toFixed(1));

    /* ---------------- RESPONSE ---------------- */
    return successResponse(
      {
        OrganizationOverview: {
          teamAdherence: {
            label: 'Team Adherence',
            value: teamAdherence,
            unit: '%',
            trend: teamAdherence > 0 ? 'up' : 'neutral',
          },
          huddlesCompleted: {
            label: 'Huddles Completed',
            value: huddlesCompleted,
          },
          roleplaysScored: {
            label: 'Roleplays Scored',
            value: roleplaysScored,
          },
          csat: {
            label: 'CSAT',
            value: Math.abs(csatChange),
            unit: 'pts',
            trend: csatChange >= 0 ? 'up' : 'down',
          },
        },
        meta: {
          totalEmployees,
          totalManagers,
          totalBranches,
          totalSessions,
          completedSessions,
        },
      },
      'Organization overview retrieved successfully',
    );
  }
}
