import {
  successPaginatedResponse,
  successResponse,
} from '@/common/response/response.util';
import { AppError } from '@/core/error/handle-error.app';
import { HandleError } from '@/core/error/handle-error.decorator';
import { PrismaService } from '@/lib/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { GetClientAdminPaymentHistoryDto } from './dto/get-payment-history-client-admin.dto';

@Injectable()
export class InvoiceManagementService {
  constructor(private readonly prisma: PrismaService) {}

  // ---------- Get all invoices with subscription plan details for client admin ----
  @HandleError('Failed to retrieve payment history', 'InvoiceManagement')
  async findAllPaymentHistory(
    userId: string,
    dto: GetClientAdminPaymentHistoryDto,
  ) {
    const { search, duration, page = 1, limit = 10 } = dto;

    const user = await this.prisma.client.user.findUnique({
      where: { id: userId },
      select: { tenantId: true },
    });

    if (!user?.tenantId) {
      throw new AppError(404, 'User tenant not found');
    }

    const skip = (page - 1) * limit;

    const whereCondition: any = {
      tenantId: user.tenantId,
    };

    if (search || duration) {
      whereCondition.subscription = {
        is: {
          AND: [
            ...(search
              ? [
                  {
                    OR: [
                      {
                        planName: search.toUpperCase() as any,
                      },

                      {
                        planTitle: {
                          contains: search,
                          mode: 'insensitive',
                        },
                      },
                    ],
                  },
                ]
              : []),

            // ------------------ duration filter (STRING)------------
            ...(duration
              ? [
                  {
                    duration: {
                      contains: duration,
                      mode: 'insensitive',
                    },
                  },
                ]
              : []),
          ],
        },
      };
    }

    const total = await this.prisma.client.invoice.count({
      where: whereCondition,
    });

    const invoices = await this.prisma.client.invoice.findMany({
      where: whereCondition,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        subscription: {
          select: {
            id: true,
            planName: true,
            planTitle: true,
            planFeatures: true,
            subscribeStatus: true,
            billingCycle: true,
            amount: true,
            duration: true,
          },
        },
        tenant: {
          select: {
            id: true,
            companyName: true,
            companyEmail: true,
            status: true,
          },
        },
      },
    });

    return successPaginatedResponse(
      invoices,
      { page, limit, total },
      'Payment history retrieved successfully',
    );
  }

  // --------- Get invoice details by ID with subscription plan details ----------
  @HandleError('Failed to retrieve invoice details', 'InvoiceManagement')
  async getDetailsPaymentById(id: string, userId: string) {
    // Get user with tenant info
    const user = await this.prisma.client.user.findUnique({
      where: { id: userId },
      select: { tenantId: true },
    });

    if (!user?.tenantId) {
      throw new AppError(404, 'User tenant not found');
    }

    // Fetch invoice with subscription details
    const invoiceDetails = await this.prisma.client.invoice.findFirst({
      where: {
        id,
        tenantId: user.tenantId,
      },
      include: {
        subscription: {
          select: {
            id: true,
            planName: true,
            planTitle: true,
            planFeatures: true,
            subscribeStatus: true,
            billingCycle: true,
            amount: true,
            duration: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        tenant: {
          select: {
            id: true,
            companyName: true,
            companyEmail: true,
            subdomain: true,
            status: true,
            locale: true,
            timezone: true,
            isVerified: true,
          },
        },
      },
    });

    if (!invoiceDetails) {
      throw new AppError(404, 'Invoice not found');
    }

    // -----------------Transform data------------------
    const transformedData = {
      id: invoiceDetails.id,
      amount: invoiceDetails.amount,
      currency: invoiceDetails.currency,
      status: invoiceDetails.status,
      dueDate: invoiceDetails.dueDate,
      paidAt: invoiceDetails.paidAt,
      stripeInvoiceId: invoiceDetails.stripeInvoiceId,
      createdAt: invoiceDetails.createdAt,
      updatedAt: invoiceDetails.updatedAt,
      subscription: invoiceDetails.subscription
        ? {
            id: invoiceDetails.subscription.id,
            planName: invoiceDetails.subscription.planName,
            planTitle: invoiceDetails.subscription.planTitle,
            planFeatures: invoiceDetails.subscription.planFeatures,
            status: invoiceDetails.subscription.subscribeStatus,
            billingCycle: invoiceDetails.subscription.billingCycle,
            amount: invoiceDetails.subscription.amount,
            duration: invoiceDetails.subscription.duration,
            createdAt: invoiceDetails.subscription.createdAt,
            updatedAt: invoiceDetails.subscription.updatedAt,
          }
        : null,
      tenant: invoiceDetails.tenant
        ? {
            id: invoiceDetails.tenant.id,
            companyName: invoiceDetails.tenant.companyName,
            companyEmail: invoiceDetails.tenant.companyEmail,
            subdomain: invoiceDetails.tenant.subdomain,
            status: invoiceDetails.tenant.status,
            locale: invoiceDetails.tenant.locale,
            timezone: invoiceDetails.tenant.timezone,
            isVerified: invoiceDetails.tenant.isVerified,
          }
        : null,
    };

    return successResponse(
      transformedData,
      'Invoice details retrieved successfully',
    );
  }

  // -------------- Get tenant subscription plan details & other separate show details----
  @HandleError(
    'Failed to retrieve tenant subscription plan details',
    'InvoiceManagement',
  )
  async getTenantSubscriptionPlan(userId: string) {
    // Get user with tenant info
    const user = await this.prisma.client.user.findUnique({
      where: { id: userId },
      select: { tenantId: true },
    });

    if (!user?.tenantId) {
      throw new AppError(404, 'User tenant not found');
    }

    //----------------- Fetch invoice with subscription details--------------
    const tenantSubscriptionDetails =
      await this.prisma.client.invoice.findFirst({
        where: { tenantId: user.tenantId },
        include: {
          subscription: {
            select: {
              id: true,
              planName: true,
              planTitle: true,
              planFeatures: true,
              subscribeStatus: true,
              billingCycle: true,
              amount: true,
              duration: true,

              createdAt: true,
              updatedAt: true,
            },
          },
          tenant: {
            select: {
              id: true,
              companyName: true,
              companyEmail: true,
              subdomain: true,
              status: true,
              locale: true,
              timezone: true,
              isVerified: true,
            },
          },
        },
      });

    if (!tenantSubscriptionDetails) {
      throw new AppError(404, 'Tenant subscription details not found');
    }

    // --------------------- Transform data ---------------------
    const transformedData = {
      Mysubscription: tenantSubscriptionDetails.subscription
        ? {
            id: tenantSubscriptionDetails.subscription.id,
            planName: tenantSubscriptionDetails.subscription.planName,
            planTitle: tenantSubscriptionDetails.subscription.planTitle,
            planFeatures: tenantSubscriptionDetails.subscription.planFeatures,
            status: tenantSubscriptionDetails.subscription.subscribeStatus,
            billingCycle: tenantSubscriptionDetails.subscription.billingCycle,
            amount: tenantSubscriptionDetails.subscription.amount,
            duration: tenantSubscriptionDetails.subscription.duration,
            createdAt: tenantSubscriptionDetails.subscription.createdAt,
            updatedAt: tenantSubscriptionDetails.subscription.updatedAt,
          }
        : null,
      tenant: tenantSubscriptionDetails.tenant
        ? {
            id: tenantSubscriptionDetails.tenant.id,
            companyName: tenantSubscriptionDetails.tenant.companyName,
            companyEmail: tenantSubscriptionDetails.tenant.companyEmail,
            subdomain: tenantSubscriptionDetails.tenant.subdomain,
            status: tenantSubscriptionDetails.tenant.status,
            locale: tenantSubscriptionDetails.tenant.locale,
            timezone: tenantSubscriptionDetails.tenant.timezone,
            isVerified: tenantSubscriptionDetails.tenant.isVerified,
          }
        : null,
    };

    //  --------------- Get all other subscription plan details---------------
    const othersSubcriptionDetails =
      await this.prisma.client.subscription.findMany({
        select: {
          id: true,
          planName: true,
          planTitle: true,
          planFeatures: true,
          subscribeStatus: true,
          billingCycle: true,
          amount: true,
          duration: true,
          createdAt: true,
          updatedAt: true,
        },
      });

    return successResponse(
      { ...transformedData, othersSubcriptionDetails },
      'Tenant subscription plan details retrieved successfully',
    );
  }
}
