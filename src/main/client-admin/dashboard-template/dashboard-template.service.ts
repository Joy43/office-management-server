import { PrismaService } from '@/lib/prisma/prisma.service';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { AppError } from './../../../core/error/handle-error.app';

import { successResponse } from '@/common/response/response.util';
import { HandleError } from '@/core/error/handle-error.decorator';
import { TempleteStatus } from '@prisma';
import { GetOwnTemplatesDto } from './dto/GetOwnTemplatesDto';

@Injectable()
export class DashboardTemplateService {
  constructor(private readonly prisma: PrismaService) {}

  // ------------------------getOwnTemplates----------------------
// dashboard-template.service.ts
@HandleError('DashboardTemplateService.getOwnTemplates error')
async getOwnTemplates(tenantId: string, dto: GetOwnTemplatesDto) {
  const { search, page = 1, limit = 10 } = dto;

  const skip = (page - 1) * limit;

  const whereCondition: any = {
    OR: [{ tenantId }, { isGlobal: true }],
  };

  if (search) {
    whereCondition.templateName = {
      contains: search,
      mode: 'insensitive',
    };
  }

  const [templates, total] = await Promise.all([
    this.prisma.client.template.findMany({
      where: whereCondition,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    this.prisma.client.template.count({
      where: whereCondition,
    }),
  ]);

  return successResponse(
    {
      templates,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    },
    'Templates retrieved successfully',
  );
}

  // ------------------------ Tenent Active Plan ----------------------
  @HandleError(' DashboardTemplateService.TenentActivePlan error')
  async TenentActivePlan(userId: string) {
    // Get user with tenant info
    const user = await this.prisma.client.user.findUnique({
      where: { id: userId },
      select: { tenantId: true },
    });

    if (!user?.tenantId) {
      throw new AppError(404, 'User tenant not found');
    }

    // ----- Get tenant subscription details------------
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

    //-------------------- Transform data--------------------------------
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

    return successResponse(
      { ...transformedData },
      'Tenant subscription plan details retrieved successfully',
    );
  }

  @HandleError('DashboardTemplateService.selectTemplateById error')
  async selectTemplateById(
    templateId: string,
    tenantId: string,
    userId: string,
  ) {
    // Find template that is either global or belongs to the tenant
    const template = await this.prisma.client.template.findFirst({
      where: {
        id: templateId,
        isActive: true,
        OR: [{ isGlobal: true }, { tenantId }],
      },
    });

    if (!template) {
      throw new ForbiddenException('You cannot use this template');
    }

    // If the template is global, assign it to tenant (so tenant can "own" it)
    if (template.isGlobal && !template.tenantId) {
      await this.prisma.client.template.update({
        where: { id: template.id },
        data: { tenantId },
      });
    }

    // Return the template as selected
    return successResponse(
      { template },
      'Template selected successfully for this tenant',
    );
  }

  @HandleError('DashboardTemplateService.updateTemplateStatus error')
  async updateTemplateStatus(
    templateId: string,
    status: TempleteStatus,
    tenantId: string,
  ) {
    // Ensure tenant owns the template (or it's global)
    const template = await this.prisma.client.template.findFirst({
      where: {
        id: templateId,
        OR: [{ tenantId }, { isGlobal: true }],
      },
    });

    if (!template) {
      throw new ForbiddenException(
        'You are not allowed to update this template',
      );
    }

    const updatedTemplate = await this.prisma.client.template.update({
      where: { id: templateId },
      data: {
        templatestatus: status,
      },
    });

    return successResponse(
      { template: updatedTemplate },
      'Template status updated successfully',
    );
  }

  // ------------------------- delete by own template ----------------------
  @HandleError('DashboardTemplateService.deleteTemplate error')
  async deleteTemplate(templateId: string, tenantId: string) {
    // Ensure tenant owns the template (or it's global)
    const template = await this.prisma.client.template.findFirst({
      where: {
        id: templateId,
        OR: [{ tenantId }, { isGlobal: true }],
      },
    });

    if (!template) {
      throw new ForbiddenException(
        'You are not allowed to delete this template | It may not exist or belong to another tenant',
      );
    }

    await this.prisma.client.template.delete({
      where: { id: templateId },
    });

    return successResponse(null, 'Template deleted successfully');
  }
}
