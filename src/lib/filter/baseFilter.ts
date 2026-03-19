import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  BillingCycle,
  CallStatus,
  ConversationStatus,
  MetricType,
  ProgramStatus,
  SubscribePlaneName,
  SubscribeStatus,
} from '@prisma';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class BaseFilter {
  // Generic search
  @ApiPropertyOptional({ example: 'search text' })
  @IsOptional()
  @IsString()
  search?: string;

  // Pagination
  @ApiPropertyOptional({ example: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number = 1;

  @ApiPropertyOptional({ example: 10, default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number = 10;
  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  isActive?: boolean;

  // Location
  @ApiPropertyOptional({ example: 'Dhaka' })
  @IsOptional()
  @IsString()
  location?: string;

  // Enums
  @ApiPropertyOptional({ enum: CallStatus, example: CallStatus.ACTIVE })
  @IsOptional()
  @IsEnum(CallStatus)
  callStatus?: CallStatus;

  @ApiPropertyOptional({ enum: MetricType, example: MetricType.CSAT })
  @IsOptional()
  @IsEnum(MetricType)
  mettricType?: MetricType;

  @ApiPropertyOptional({ enum: ConversationStatus })
  @IsOptional()
  @IsEnum(ConversationStatus)
  conversationStatus?: ConversationStatus;

  @ApiPropertyOptional({ enum: ProgramStatus, example: ProgramStatus.ACTIVE })
  @IsOptional()
  @IsEnum(ProgramStatus)
  programStatus?: ProgramStatus;

  @ApiPropertyOptional({ enum: SubscribeStatus, example: SubscribeStatus.ACTIVE })
  @IsOptional()
  @IsEnum(SubscribeStatus)
  subscribeStatus?: SubscribeStatus;

  @ApiPropertyOptional({
    enum: SubscribePlaneName,
    example: SubscribePlaneName.ENTERPRISE,
  })
  @IsOptional()
  @IsEnum(SubscribePlaneName)
  subscribePlaneName?: SubscribePlaneName;

  @ApiPropertyOptional({ enum: BillingCycle, example: BillingCycle.ANNUAL })
  @IsOptional()
  @IsEnum(BillingCycle)
  billingCycle?: BillingCycle;
}
