import { HandleError } from '@/core/error/handle-error.decorator';
import { PrismaService } from '@/lib/prisma/prisma.service';
import { BadRequestException, Injectable } from '@nestjs/common';

import { CreateSubscriptionDto } from './dto/create-subscription-plan.dto';
import { UpdateSubscriptionPlanDto } from './dto/update-subscription-plan.dto';

@Injectable()
export class SubscriptionPlanService {
  constructor(private readonly prisma: PrismaService) {}

  @HandleError('Failed to create subscription plan')
  async createSubscriptionPlan(dto: CreateSubscriptionDto) {
    return this.prisma.client.subscription.create({
      data: dto,
    });
  }

  async findAll() {
    return this.prisma.client.subscription.findMany();
  }

  @HandleError('Failed to find subscription plan')
  async findSinglePlan(id: string) {
    const plan = await this.prisma.client.subscription.findUnique({
      where: { id },
    });

    if (!plan) {
      throw new BadRequestException('Plan not found');
    }

    return plan;
  }

  @HandleError('Failed to update subscription plan')
  async updateSubscriptionPlan(
    id: string,
    updateSubscriptionPlanDto: UpdateSubscriptionPlanDto,
  ) {
    await this.findSinglePlan(id);

    return this.prisma.client.subscription.update({
      where: { id },
      data: updateSubscriptionPlanDto,
    });
  }

  @HandleError('Failed to delete subscription plan')
  async deletePlan(id: string) {
    await this.findSinglePlan(id);

    return this.prisma.client.subscription.delete({
      where: { id },
    });
  }
}
