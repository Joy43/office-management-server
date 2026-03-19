import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BillingCycle, SubscribePlaneName, SubscribeStatus } from '@prisma';
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateSubscriptionDto {
  @ApiProperty({
    description:
      'The name of the subscription plan use in ||STARTER || GROWTH || ENTERPRISE',
    enum: SubscribePlaneName,
    example: SubscribePlaneName.STARTER,
  })
  @IsEnum(SubscribePlaneName, {
    message: 'planName must be a valid subscription plan',
  })
  planName: SubscribePlaneName;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  planTitle?: string;

  @ApiPropertyOptional({
    isArray: true,
    example: ['Unlimited projects', 'Priority support', 'Advanced analytics'],
    description: 'List of features included in the plan',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  planFeatures?: string[];

  @ApiProperty({
    enum: SubscribeStatus,
  })
  @IsEnum(SubscribeStatus)
  subscribeStatus: SubscribeStatus;

  @ApiProperty({
    enum: BillingCycle,
  })
  @IsEnum(BillingCycle)
  billingCycle: BillingCycle;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  amount?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  duration?: string;
}
