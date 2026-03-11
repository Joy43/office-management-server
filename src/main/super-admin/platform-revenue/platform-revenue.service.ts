import { HandleError } from '@/core/error/handle-error.decorator';
import { PrismaService } from '@/lib/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

import { Prisma } from '@prisma';
import dayjs from 'dayjs';
import {
  RevenueFilterDto,
  RevenueFilterType,
  TotalOrderListDto,
} from './dto/revenueFilter.dto';

@Injectable()
export class PlatformRevenueService {
  constructor(private readonly prisma: PrismaService) {}
  //  -----------utils some invoice amount calculations -----------
  private sumInvoices(invoices: { amount: string | null }[]) {
    return invoices.reduce(
      (sum, inv) => sum + (parseFloat(inv.amount || '0') || 0),
      0,
    );
  }

  // --------------------- getMonthlyRevenueGraph  utils---------------------
  private monthlyRevenueGraph(invoices: { amount: string; createdAt: Date }[]) {
    const monthlyMap: Record<string, number> = {};

    invoices.forEach((inv) => {
      const month = dayjs(inv.createdAt).format('MMM');
      monthlyMap[month] =
        (monthlyMap[month] || 0) + parseFloat(inv.amount || '0');
    });

    return {
      filter: 'MONTHLY',
      data: Object.entries(monthlyMap).map(([month, total]) => ({
        label: month,
        total,
      })),
    };
  }

  // --------------------- yearlyRevenueGraph utils ---------------------
  private yearlyRevenueGraph(invoices: { amount: string; createdAt: Date }[]) {
    const yearlyMap: Record<string, number> = {};

    invoices.forEach((inv) => {
      const year = dayjs(inv.createdAt).format('YYYY');
      yearlyMap[year] = (yearlyMap[year] || 0) + parseFloat(inv.amount || '0');
    });

    return {
      filter: 'YEARLY',
      data: Object.entries(yearlyMap).map(([year, total]) => ({
        label: year,
        total,
      })),
    };
  }

  // --------------------- findAllRevenue ---------------------
  @HandleError('Failed to fetch platform revenues')
  async findAllRevenueDashboard() {
    const totalTenants = await this.prisma.client.tenant.count();
    // -----------  Total Revenue   ----------
    const invoices = await this.prisma.client.invoice.findMany({
      select: {
        amount: true,
        createdAt: true,
        subscription: {
          select: { planName: true },
        },
      },
    });

    const totalRevenue = this.sumInvoices(invoices);

    // ----------  Monthly Revenue   ----------
    const startOfMonth = dayjs().startOf('month').toDate();
    const endOfMonth = dayjs().endOf('month').toDate();

    const monthlyInvoices = invoices.filter(
      (i) => i.createdAt >= startOfMonth && i.createdAt <= endOfMonth,
    );

    const monthlyRevenue = this.sumInvoices(monthlyInvoices);

    // ----------  Profit  ----------
    const netProfit = +(monthlyRevenue * 0.8).toFixed(2);

    // ---------- Selling Source ----------
    const planTotals = {
      STARTER: 0,
      GROWTH: 0,
      ENTERPRISE: 0,
    };

    invoices.forEach((inv) => {
      const plan = inv.subscription?.planName;
      if (plan) {
        planTotals[plan] += parseFloat(inv.amount || '0');
      }
    });
    // --------- monthly revenue calculation ----------
    const totalSelling = await this.prisma.client.invoice.findMany({
      select: { amount: true },
    });

    const monthlyMap: Record<string, number> = {};

    invoices.forEach((inv) => {
      const month = dayjs(inv.createdAt).format('MMM');
      monthlyMap[month] =
        (monthlyMap[month] || 0) + parseFloat(inv.amount || '0');
    });

    return {
      totalSelling,
      totalRevenue,
      monthlyRevenue,
      netProfit,
      totalTenants,
    };
  }

  // -------------- selling source data ---------------
  @HandleError('Failed to fetch selling source data')
  async getSellingSource(dto?: RevenueFilterDto) {
    const filter = dto?.filter ?? RevenueFilterType.MONTHLY;

    const invoices = await this.prisma.client.invoice.findMany({
      select: {
        amount: true,
        createdAt: true,
        subscription: {
          select: { planName: true },
        },
      },
    });

    // -------------------- Filter invoices based on MONTHLY or YEARLY --------------------
    let filteredInvoices = invoices;

    if (filter === RevenueFilterType.MONTHLY) {
      const startOfMonth = dayjs().startOf('month').toDate();
      const endOfMonth = dayjs().endOf('month').toDate();
      filteredInvoices = invoices.filter(
        (inv) => inv.createdAt >= startOfMonth && inv.createdAt <= endOfMonth,
      );
    } else if (filter === RevenueFilterType.YEARLY) {
      const startOfYear = dayjs().startOf('year').toDate();
      const endOfYear = dayjs().endOf('year').toDate();
      filteredInvoices = invoices.filter(
        (inv) => inv.createdAt >= startOfYear && inv.createdAt <= endOfYear,
      );
    }

    // ------------------- Calculate plan totals -------------------
    const planTotals = {
      STARTER: 0,
      GROWTH: 0,
      ENTERPRISE: 0,
    };

    filteredInvoices.forEach((inv) => {
      const plan = inv.subscription?.planName;
      if (plan) {
        planTotals[plan] += parseFloat(inv.amount || '0');
      }
    });

    const totalRevenue = Object.values(planTotals).reduce((a, b) => a + b, 0);

    return Object.entries(planTotals).map(([planName, total]) => ({
      planName,
      total,
      percentage:
        totalRevenue > 0 ? +((total / totalRevenue) * 100).toFixed(1) : 0,
    }));
  }

  // --------------------- findAllRevenue ---------------------

  @HandleError('Failed to fetch revenue graph data')
  async getRevenueGraph(dto: RevenueFilterDto) {
    const filter = dto.filter ?? RevenueFilterType.MONTHLY;

    const invoices = await this.prisma.client.invoice.findMany({
      select: {
        amount: true,
        createdAt: true,
      },
    });

    if (filter === RevenueFilterType.YEARLY) {
      return this.yearlyRevenueGraph(invoices);
    }

    return this.monthlyRevenueGraph(invoices);
  }

  // --------------------- getPlatformOverview ---------------------
  async getPlatformOverview() {
    const totalTenants = await this.prisma.client.tenant.count();
    const activeTenants = await this.prisma.client.tenant.count({
      where: {
        isVerified: true,
      },
    });
    // -----------------Monthly revenue calculation-----------------
    const invoices = await this.prisma.client.invoice.findMany({
      select: {
        amount: true,
      },
    });

    // -----------------  ------------- Calculate total revenue manually since amount is stored as string -----------------
    const totalRevenue = invoices.reduce((sum, invoice) => {
      const amountNum = parseFloat(invoice.amount) || 0;
      return sum + amountNum;
    }, 0);

    return {
      activeTenants,
      totalTenants,
      totalRevenue,
    };
  }

  // ---------------- total order list---------------------
  @HandleError('Failed to fetch order list')
  async getTotalOrdersChart(dto: TotalOrderListDto) {
    const { page = 1, limit = 10, search } = dto;
    const skip = (page - 1) * limit;

    const whereClause = search
      ? {
          OR: [
            { id: { contains: search } },
            {
              tenant: {
                companyName: {
                  contains: search,
                  mode: Prisma.QueryMode.insensitive,
                },
              },
            },
          ],
        }
      : {};

    const [total, orders] = await Promise.all([
      this.prisma.client.invoice.count({ where: whereClause }),
      this.prisma.client.invoice.findMany({
        where: whereClause,
        include: {
          tenant: true,
          subscription: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
    ]);

    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      data: orders,
    };
  }
}
