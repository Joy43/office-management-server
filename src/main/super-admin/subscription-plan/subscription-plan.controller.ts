import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
} from '@nestjs/common';
import { SubscriptionPlanService } from './subscription-plan.service';
import { CreateSubscriptionDto } from './dto/create-subscription-plan.dto';
import { UpdateSubscriptionPlanDto } from './dto/update-subscription-plan.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { successResponse } from '@/common/response/response.util';
import { ValidateAdmin } from '@/core/jwt/jwt.decorator';

@ApiTags('Super Admin ---------- Subscription Plan Management')
@Controller('subscription-plan')
@ApiBearerAuth()
export class SubscriptionPlanController {
  constructor(
    private readonly subscriptionPlanService: SubscriptionPlanService,
  ) {}

  @Post('create-plan')
  @ValidateAdmin()
  @ApiOperation({
    summary: 'Create a new subscription plan.The plan will create by admin',
  })
  async createSubscriptionPlan(
    @Body() createSubscriptionPlanDto: CreateSubscriptionDto,
  ) {
    const res = await this.subscriptionPlanService.createSubscriptionPlan(
      createSubscriptionPlanDto,
    );
    return successResponse({
      statusCode: HttpStatus.CREATED,
      message: 'Subscription plan created successfully',
      data: res,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Get all subscription plan' })
  async findAll() {
    const res = await this.subscriptionPlanService.findAll();
    return successResponse({
      statusCode: HttpStatus.OK,
      message: 'Subscription plan fetched successfully',
      data: res,
    });
  }

  @Get('single-plan/:id')
  @ApiOperation({ summary: 'Get a single subscription plan' })
  async findOne(@Param('id') id: string) {
    const res = await this.subscriptionPlanService.findSinglePlan(id);
    return successResponse({
      statusCode: HttpStatus.OK,
      message: 'Subscription plan fetched successfully',
      data: res,
    });
  }

  @Patch('update-plan/:id')
  @ValidateAdmin()
  @ApiOperation({
    summary: 'Update a subscription plan.The plan will update by admin',
  })
  async updateSubscriptionPlan(
    @Param('id') id: string,
    @Body() updateSubscriptionPlanDto: UpdateSubscriptionPlanDto,
  ) {
    const res = await this.subscriptionPlanService.updateSubscriptionPlan(
      id,
      updateSubscriptionPlanDto,
    );
    return successResponse({
      statusCode: HttpStatus.CREATED,
      message: 'Subscription plan updated successfully',
      data: res,
    });
  }

  @Delete(':id')
  @ValidateAdmin()
  @ApiOperation({
    summary: 'Delete a subscription plan.The plan will delete by admin',
  })
  async deletePlan(@Param('id') id: string) {
    const res = await this.subscriptionPlanService.deletePlan(id);
    return successResponse({
      statusCode: HttpStatus.OK,
      message: 'Subscription plan deleted successfully',
      data: res,
    });
  }
}
