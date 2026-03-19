import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';

export enum AnalyticsPeriod {
  WEEKLY = 'Weekly',
  MONTHLY = 'Monthly',
  YEARLY = 'Yearly',
}

export class HabitAnalysisFilterDto {
  @ApiPropertyOptional({
    description: 'Time period for habit analytics',
    enum: AnalyticsPeriod,
    default: AnalyticsPeriod.WEEKLY,
    example: AnalyticsPeriod.WEEKLY,
  })
  @IsOptional()
  @IsEnum(AnalyticsPeriod, {
    message: 'Period must be one of: Weekly, Monthly, Yearly',
  })
  period?: AnalyticsPeriod = AnalyticsPeriod.WEEKLY;
}
